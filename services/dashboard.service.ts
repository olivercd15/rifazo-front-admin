import { supaFetch } from './supaFetch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export async function getDashboardStats() {
    const [raffles, activeRaffles, completedRaffles, pendingPayments, activeTickets] = await Promise.all([
        supaFetch(`${SUPABASE_URL}/rest/v1/raffles?select=id`),
        supaFetch(`${SUPABASE_URL}/rest/v1/raffles?select=id&status=eq.active`),
        supaFetch(`${SUPABASE_URL}/rest/v1/raffles?select=id&status=eq.completed`),
        supaFetch(`${SUPABASE_URL}/rest/v1/payments?select=id&status=eq.delivered`),
        supaFetch(`${SUPABASE_URL}/rest/v1/tickets?select=id&status=eq.active`)
    ]);

    return {
        totalRaffles: raffles.length,
        activeRaffles: activeRaffles.length,
        completedRaffles: completedRaffles.length,
        pendingPayments: pendingPayments.length,
        activeTickets: activeTickets.length,
    };
}

export async function getRecentRaffles() {
    return supaFetch(`${SUPABASE_URL}/rest/v1/raffles?select=id,title,status,created_at&order=created_at.desc&limit=5`);
}

export async function getPendingPayments() {
    return supaFetch(`${SUPABASE_URL}/rest/v1/vw_admin_payments?select=payment_id,raffle_title,user_name,payment_amount&payment_status=eq.delivered&limit=5`);
}
