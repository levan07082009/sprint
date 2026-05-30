import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/applications - Get applications (for student or employer)
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
    const { searchParams } = new URL(request.url);

    const as_applicant = searchParams.get('as_applicant') === 'true';
    const status = searchParams.get('status');

    let query = supabase
      .from('applications')
      .select(`
        *,
        gig:gigs(
          id,
          title,
          budget,
          currency,
          status,
          employer:profiles!gigs_employer_id_fkey(
            id,
            display_name,
            avatar_url
          )
        ),
        applicant:profiles!applications_applicant_id_fkey(
          id,
          display_name,
          avatar_url,
          trust_score
        )
      `)
      .order('created_at', { ascending: false });

    if (as_applicant) {
      // Get student's applications
      query = query.eq('applicant_id', profile.id);
    } else {
      // Get applications for employer's gigs
      const { data: gigIds } = await supabase
        .from('gigs')
        .select('id')
        .eq('employer_id', profile.id);

      if (!gigIds || gigIds.length === 0) {
        return NextResponse.json({ applications: [] });
      }

      query = query.in('gig_id', gigIds.map(g => g.id));
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Applications fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
    }

    return NextResponse.json({ applications: data });
  } catch (error) {
    console.error('Applications fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/applications - Create an application
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

    // Only students can apply
    if (profile.role !== 'STUDENT') {
      return NextResponse.json({ error: 'Only students can apply to gigs' }, { status: 403 });
    }

    const body = await request.json();
    const supabase = createServerClient();

    // Check if gig is active
    const { data: gig } = await supabase
      .from('gigs')
      .select('status')
      .eq('id', body.gig_id)
      .single();

    if (!gig || gig.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Gig is not available' }, { status: 400 });
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from('applications')
      .select('id')
      .eq('gig_id', body.gig_id)
      .eq('applicant_id', profile.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Already applied to this gig' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('applications')
      .insert({
        gig_id: body.gig_id,
        applicant_id: profile.id,
        cover_note: body.cover_note,
        proposed_rate: body.proposed_rate,
        status: 'PENDING'
      })
      .select()
      .single();

    if (error) {
      console.error('Application creation error:', error);
      return NextResponse.json({ error: 'Failed to submit application' }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Application creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
