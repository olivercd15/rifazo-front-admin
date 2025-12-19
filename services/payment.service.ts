import { supaFetch } from './supaFetch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function getAdminPayments(params?: { status?: string; user_name?: string; user_phone?: string }) {
    const sp = new URLSearchParams();
    sp.set('select', '*');

    if (params?.status) {
        sp.set('payment_status', `eq.${params.status}`);
    }

    if (params?.user_name && params.user_name.trim() !== '') {
        sp.set('user_name', `ilike.%${params.user_name}%`);
    }

    if (params?.user_phone && params.user_phone.trim() !== '') {
        sp.set('user_phone', `ilike.%${params.user_phone}%`);
    }

    sp.set('order', 'payment_created_at.desc');

    return supaFetch(`${SUPABASE_URL}/rest/v1/vw_admin_payments?${sp.toString()}`);
}


// Edge functions
export async function approvePayment(paymentId: string) {
    console.log('APROBANDO PAYMENT ID:', paymentId);
    return supaFetch(`${SUPABASE_URL}/functions/v1/approve-payment`, {
        method: 'POST',
        body: JSON.stringify({ payment_id: paymentId })
    });
}

export async function rejectPayment(paymentId: string) {
    return supaFetch(`${SUPABASE_URL}/functions/v1/reject-payment`, {
        method: 'POST',
        body: JSON.stringify({ payment_id: paymentId })
    });
}
