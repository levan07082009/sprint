import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Define public routes that do not require authentication
const isPublicRoute = createRouteMatcher([
  '/', 
  '/sign-in(.*)', 
  '/sign-up(.*)', 
  '/api/webhooks(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  if (isPublicRoute(req)) return NextResponse.next();

  const session = await auth();
  
  // If no user, redirect to sign-in
  if (!session.userId) {
    return session.redirectToSignIn({ returnBackUrl: req.url });
  }

  // Extract role from session claims (populated via Clerk public metadata)
  const role = (session.sessionClaims?.metadata as any)?.role as 'STUDENT' | 'BUSINESS' | 'INDIVIDUAL' | undefined;
  const path = req.nextUrl.pathname;

  // Handle users without an assigned role (send to onboarding)
  if (!role && !path.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/onboarding', req.url));
  }

  // Enforce strict Role-Based Routing
  if (role === 'STUDENT' && !path.startsWith('/student') && !path.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/student', req.url));
  }
  if (role === 'BUSINESS' && !path.startsWith('/business') && !path.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/business', req.url));
  }
  if (role === 'INDIVIDUAL' && !path.startsWith('/individual') && !path.startsWith('/onboarding')) {
    return NextResponse.redirect(new URL('/individual', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
