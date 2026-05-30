import { createServerClient, getProfile } from '@/lib/supabase-server';
import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';

// This endpoint syncs Clerk user with Supabase profile
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const supabase = createServerClient();
    const body = await request.json();

    // Check if profile exists
    let profile = await getProfile(userId);

    if (!profile) {
      // Create profile
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          display_name: body.display_name || `${clerkUser.firstName} ${clerkUser.lastName}`.trim() || 'User',
          avatar_url: body.avatar_url || clerkUser.imageUrl,
          role: body.role || 'STUDENT',
          location: body.location,
          onboarding_complete: body.onboarding_complete || false
        })
        .select()
        .single();

      if (error) {
        console.error('Profile sync error:', error);
        return NextResponse.json({ error: 'Failed to create profile' }, { status: 500 });
      }

      profile = data;
    } else if (body.onboarding_complete !== undefined) {
      // Update onboarding status
      const { data, error } = await supabase
        .from('profiles')
        .update({
          onboarding_complete: body.onboarding_complete,
          role: body.role || profile.role,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Profile update error:', error);
        return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
      }

      profile = data;
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Auth sync error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
