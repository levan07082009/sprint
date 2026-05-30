import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

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

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createServerClient();

    // Check if profile already exists
    const existing = await getProfile(userId);

    if (existing) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('profiles')
      .insert({
        user_id: userId,
        display_name: body.display_name,
        avatar_url: body.avatar_url,
        bio: body.bio,
        role: body.role,
        location: body.location,
        hourly_rate: body.hourly_rate,
        onboarding_complete: body.onboarding_complete || false
      })
      .select()
      .single();

    if (error) {
      console.error('Profile creation error:', error);
      return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
    }

    // Create user stats
    await supabase
      .from('user_stats')
      .insert({ user_id: data.id });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Profile creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = request.headers.get('x-user-id');

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const supabase = createServerClient();

    const { data, error } = await supabase
      .from('profiles')
      .update({
        display_name: body.display_name,
        avatar_url: body.avatar_url,
        bio: body.bio,
        location: body.location,
        hourly_rate: body.hourly_rate,
        onboarding_complete: body.onboarding_complete,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
