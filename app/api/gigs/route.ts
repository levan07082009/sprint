import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/gigs - Get gigs (with filters)
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

    const status = searchParams.get('status');
    const employer_only = searchParams.get('employer_only') === 'true';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
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
        applications(count)
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // If employer_only, show only their gigs
    if (employer_only) {
      query = query.eq('employer_id', profile.id);
    } else if (!status || status === 'ACTIVE') {
      // Default: show active gigs to students
      query = query.eq('status', 'ACTIVE');
    } else if (status) {
      query = query.eq('status', status);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Gigs fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch gigs' }, { status: 500 });
    }

    return NextResponse.json({ gigs: data, total: count });
  } catch (error) {
    console.error('Gigs fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/gigs - Create a new gig
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

    // Only BUSINESS and INDIVIDUAL can create gigs
    if (profile.role === 'STUDENT') {
      return NextResponse.json({ error: 'Students cannot post gigs' }, { status: 403 });
    }

    const body = await request.json();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('gigs')
      .insert({
        employer_id: profile.id,
        title: body.title,
        description: body.description,
        budget: body.budget,
        currency: body.currency || 'USD',
        status: body.status || 'ACTIVE',
        urgency: body.urgency || 'STANDARD',
        location: body.location,
        required_skills: body.required_skills || []
      })
      .select()
      .single();

    if (error) {
      console.error('Gig creation error:', error);
      return NextResponse.json({ error: 'Failed to create gig' }, { status: 500 });
    }

    // Update user stats
    await supabase.rpc('increment_gigs_posted', { user_id: profile.id });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Gig creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
