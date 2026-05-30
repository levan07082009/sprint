import { createServerClient, getProfile } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/transactions - Get user's transactions
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

    const { data, error } = await supabase
      .from('transactions')
      .select(`
        *,
        gig:gigs(
          id,
          title,
          budget
        ),
        payer:profiles!transactions_payer_id_fkey(
          id,
          display_name,
          avatar_url
        ),
        payee:profiles!transactions_payee_id_fkey(
          id,
          display_name,
          avatar_url
        )
      `)
      .or(`payer_id.eq.${profile.id},payee_id.eq.${profile.id}`)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Transactions fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch transactions' }, { status: 500 });
    }

    // Calculate wallet balance
    const asPayer = data.filter(t => t.payer_id === profile.id);
    const asPayee = data.filter(t => t.payee_id === profile.id);

    const totalSpent = asPayer
      .filter(t => t.status === 'RELEASED')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const totalEarned = asPayee
      .filter(t => t.status === 'RELEASED')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    const inEscrow = asPayer
      .filter(t => t.status === 'ESCROW')
      .reduce((sum, t) => sum + parseFloat(t.amount), 0);

    return NextResponse.json({
      transactions: data,
      wallet: {
        balance: profile.role === 'STUDENT' ? totalEarned : 0,
        spent: totalSpent,
        earned: totalEarned,
        in_escrow: inEscrow
      }
    });
  } catch (error) {
    console.error('Transactions fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/transactions - Create a transaction
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

    // Get the gig and verify the user is the employer
    const { data: gig } = await supabase
      .from('gigs')
      .select('employer_id, status, budget')
      .eq('id', body.gig_id)
      .single();

    if (!gig || gig.employer_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Get the accepted application
    const { data: application } = await supabase
      .from('applications')
      .select('applicant_id')
      .eq('gig_id', body.gig_id)
      .eq('status', 'ACCEPTED')
      .single();

    if (!application) {
      return NextResponse.json({ error: 'No accepted application found' }, { status: 400 });
    }

    // Create transaction in escrow
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        gig_id: body.gig_id,
        payer_id: profile.id,
        payee_id: application.applicant_id,
        amount: body.amount || gig.budget,
        status: body.payment_method === 'QR_CODE' ? 'RELEASED' : 'ESCROW',
        payment_method: body.payment_method || 'STRIPE',
        stripe_payment_intent_id: body.stripe_payment_intent_id
      })
      .select()
      .single();

    if (error) {
      console.error('Transaction creation error:', error);
      return NextResponse.json({ error: 'Failed to create transaction' }, { status: 500 });
    }

    // Update gig status to COMPLETED
    await supabase
      .from('gigs')
      .update({ status: 'COMPLETED', updated_at: new Date().toISOString() })
      .eq('id', body.gig_id);

    // Update user stats
    await supabase.rpc('increment_gigs_completed', { user_id: application.applicant_id });
    await supabase.rpc('update_earnings', {
      user_id: application.applicant_id,
      amount: parseFloat(data.amount)
    });

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Transaction creation error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
