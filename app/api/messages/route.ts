import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// POST /api/messages - Send a message
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

    // Verify user is part of conversation
    const { data: conversation } = await supabase
      .from('conversations')
      .select('participant1_id, participant2_id')
      .eq('id', body.conversation_id)
      .single();

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    if (conversation.participant1_id !== profile.id && conversation.participant2_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: body.conversation_id,
        sender_id: profile.id,
        content: body.content
      })
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey(
          id,
          display_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Message send error:', error);
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    // Update conversation timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', body.conversation_id);

    // Broadcast via Supabase Realtime
    await supabase.channel(`chat_${body.conversation_id}`).send({
      type: 'broadcast',
      event: 'new_message',
      payload: data
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Message send error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
