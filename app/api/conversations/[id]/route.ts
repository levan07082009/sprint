import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await getProfile(userId);
    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const supabase = createServerClient();

    // Get conversation with messages
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
          currency,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Conversation fetch error:', error);
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Verify user is participant
    if (data.participant1_id !== profile.id && data.participant2_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get messages
    const { data: messages } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(
          id,
          display_name,
          avatar_url
        )
      `)
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
      .limit(100);

    // Mark messages as read
    await supabase
      .from('messages')
      .update({ read_at: new Date().toISOString() })
      .eq('conversation_id', id)
      .neq('sender_id', profile.id)
      .is('read_at', null);

    return NextResponse.json({ ...data, messages });
  } catch (error) {
    console.error('Conversation fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
