import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/conversations - Get user's conversations
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('conversations')
      .select(`
        *,
        participant1:profiles!conversations_participant1_id_fkey(
          id,
          display_name,
          avatar_url,
          role
        ),
        participant2:profiles!conversations_participant2_id_fkey(
          id,
          display_name,
          avatar_url,
          role
        ),
        gig:gigs(
          id,
          title,
          budget,
          currency
        ),
        messages(
          id,
          content,
          created_at,
          read_at,
          sender_id
        )
      `)
      .or(`participant1_id.eq.${profile.id},participant2_id.eq.${profile.id}`)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Conversations fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    // Transform to show the other participant
    const conversations = data.map(conv => {
      const isParticipant1 = conv.participant1_id === profile.id;
      const otherParticipant = isParticipant1 ? conv.participant2 : conv.participant1;
      const lastMessage = conv.messages && conv.messages.length > 0
        ? conv.messages[conv.messages.length - 1]
        : null;

      return {
        ...conv,
        other_participant: otherParticipant,
        last_message: lastMessage,
        unread_count: conv.messages?.filter(
          (m: any) => !m.read_at && m.sender_id !== profile.id
        ).length || 0
      };
    });

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/conversations - Create a conversation
export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const body = await request.json();
    const supabase = createServerClient();

    // Ensure participant IDs are ordered consistently
    const [participant1_id, participant2_id] = [profile.id, body.participant_id].sort();

    // Check if conversation exists
    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('participant1_id', participant1_id)
      .eq('participant2_id', participant2_id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(existing);
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        participant1_id,
        participant2_id,
        gig_id: body.gig_id
      })
      .select()
      .single();

    if (error) {
      console.error('Conversation creation error:', error);
      return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Conversation creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
