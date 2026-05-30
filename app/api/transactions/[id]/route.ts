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

    // Get the transaction
    const { data: transaction } = await supabase
      .from('transactions')
      .select('payer_id, payee_id, status, amount')
      .eq('id', id)
      .single();

    if (!transaction) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
    }

    // Only payer can release funds
    if (transaction.payer_id !== profile.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    if (body.status === 'RELEASED' && transaction.status === 'ESCROW') {
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'RELEASED',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Transaction release error:', error);
        return NextResponse.json({ error: 'Failed to release funds' }, { status: 500 });
      }

      // Update payee's earnings
      await supabase.rpc('update_earnings', {
        user_id: transaction.payee_id,
        amount: parseFloat(transaction.amount)
      });

      return NextResponse.json({ success: true });
    } else if (body.status === 'REFUNDED' && transaction.status === 'ESCROW') {
      const { error } = await supabase
        .from('transactions')
        .update({
          status: 'REFUNDED',
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        console.error('Transaction refund error:', error);
        return NextResponse.json({ error: 'Failed to refund' }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid status transition' }, { status: 400 });
  } catch (error) {
    console.error('Transaction update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
