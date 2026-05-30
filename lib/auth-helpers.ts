import { auth, currentUser } from '@clerk/nextjs/server';
import { createServerClient, getProfile } from '@/lib/supabase-server';

export async function getAuthenticatedUser() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return null;
    }

    const profile = await getProfile(userId);

    return {
      userId,
      profile,
      isOnboarded: profile?.onboarding_complete || false
    };
  } catch (error) {
    console.error('Get authenticated user error:', error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();

  if (!user) {
    throw new Error('Unauthorized');
  }

  return user;
}

export async function requireProfile() {
  const user = await requireAuth();

  if (!user.profile) {
    throw new Error('Profile not found');
  }

  return user;
}

export async function requireRole(allowedRoles: string[]) {
  const user = await requireProfile();

  if (!allowedRoles.includes(user.profile.role)) {
    throw new Error('Insufficient permissions');
  }

  return user;
}
