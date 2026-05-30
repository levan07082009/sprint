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

    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('gigs')
      .select(`
        *,
        employer:profiles!gigs_employer_id_fkey(
          id,
          display_name,
          avatar_url,
          trust_score,
          role
        ),
        applications(
          id,
          status,
          cover_note,
          proposed_rate,
          created_at,
          applicant:profiles!applications_applicant_id_fkey(
            id,
            display_name,
            avatar_url,
            trust_score
          )
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Gig fetch error:', error);
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Gig fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
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

    const body = await request.json();
    const supabase = createServerClient();

    // Verify ownership
    const { data: gig } = await supabase
      .from('gigs')
      .select('employer_id')
      .eq('id', id)
      .single();

    if (!gig || gig.employer_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('gigs')
      .update({
        title: body.title,
        description: body.description,
        budget: body.budget,
        status: body.status,
        urgency: body.urgency,
        location: body.location,
        required_skills: body.required_skills,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Gig update error:', error);
      return NextResponse.json({ error: 'Failed to update gig' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Gig update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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

    // Verify ownership
    const { data: gig } = await supabase
      .from('gigs')
      .select('employer_id')
      .eq('id', id)
      .single();

    if (!gig || gig.employer_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { error } = await supabase
      .from('gigs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Gig delete error:', error);
      return NextResponse.json({ error: 'Failed to delete gig' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Gig delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
