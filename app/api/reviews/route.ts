import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/reviews - Get reviews for a user or gig
export async function GET(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = createServerClient();
    const { searchParams } = new URL(request.url);

    const user_id = searchParams.get('user_id');
    const gig_id = searchParams.get('gig_id');

    let query = supabase
      .from('reviews')
      .select(`
        *,
        reviewer:profiles!reviews_reviewer_id_fkey(
          id,
          display_name,
          avatar_url
        ),
        reviewee:profiles!reviews_reviewee_id_fkey(
          id,
          display_name,
          avatar_url
        ),
        gig:gigs(
          id,
          title
        )
      `)
      .order('created_at', { ascending: false });

    if (user_id) {
      query = query.eq('reviewee_id', user_id);
    } else if (gig_id) {
      query = query.eq('gig_id', gig_id);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Reviews fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
    }

    return NextResponse.json({ reviews: data });
  } catch (error) {
    console.error('Reviews fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/reviews - Create a review
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

    // Verify the user is part of this gig (either as employer or selected applicant)
    const { data: gig } = await supabase
      .from('gigs')
      .select('employer_id')
      .eq('id', body.gig_id)
      .single();

    const { data: application } = await supabase
      .from('applications')
      .select('applicant_id')
      .eq('gig_id', body.gig_id)
      .eq('status', 'ACCEPTED')
      .single();

    if (!gig || !application) {
      return NextResponse.json({ error: 'Gig not found' }, { status: 404 });
    }

    const isEmployer = gig.employer_id === profile.id;
    const isWorker = application.applicant_id === profile.id;

    if (!isEmployer && !isWorker) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Determine reviewee
    const reviewee_id = isEmployer ? application.applicant_id : gig.employer_id;

    // Check if already reviewed
    const { data: existing } = await supabase
      .from('reviews')
      .select('id')
      .eq('gig_id', body.gig_id)
      .eq('reviewer_id', profile.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ error: 'Already reviewed' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('reviews')
      .insert({
        gig_id: body.gig_id,
        reviewer_id: profile.id,
        reviewee_id: reviewee_id,
        rating: body.rating,
        comment: body.comment
      })
      .select()
      .single();

    if (error) {
      console.error('Review creation error:', error);
      return NextResponse.json({ error: 'Failed to create review' }, { status: 500 });
    }

    // Update trust score and average rating
    await supabase.rpc('update_user_rating', { user_id: reviewee_id });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Review creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
