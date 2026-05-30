import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

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

    // Get the application with gig info
    const { data: application } = await supabase
      .from('applications')
      .select(`
        *,
        gig:gigs!applications_gig_id_fkey(
          id,
          employer_id,
          status
        )
      `)
      .eq('id', id)
      .single();

    if (!application) {
      return NextResponse.json({ error: 'Application not found' }, { status: 404 });
    }

    // Check authorization - employer owns the gig OR applicant owns the application
    const isEmployer = application.gig.employer_id === profile.id;
    const isApplicant = application.applicant_id === profile.id;

    if (!isEmployer && !isApplicant) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Status transitions
    if (body.status === 'ACCEPTED' && isEmployer) {
      // Accept application - update gig and create conversation
      const updates = await supabase.rpc('accept_application', {
        application_id: id,
        gig_id: application.gig_id,
        employer_id: profile.id,
        applicant_id: application.applicant_id
      });

      if (updates.error) {
        console.error('Application acceptance error:', updates.error);
        return NextResponse.json({ error: 'Failed to accept application' }, { status: 500 });
      }

      return NextResponse.json({ success: true, conversation_id: updates.data });
    } else if (body.status === 'REJECTED' && isEmployer) {
      // Reject application
      const { error } = await supabase
        .from('applications')
        .update({ status: 'REJECTED', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Application rejection error:', error);
        return NextResponse.json({ error: 'Failed to reject application' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else if (body.status === 'WITHDRAWN' && isApplicant) {
      // Withdraw application
      const { error } = await supabase
        .from('applications')
        .update({ status: 'WITHDRAWN', updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        console.error('Application withdrawal error:', error);
        return NextResponse.json({ error: 'Failed to withdraw application' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 });
    }
  } catch (error) {
    console.error('Application update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
