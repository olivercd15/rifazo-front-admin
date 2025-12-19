import { supaFetch } from './supaFetch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

export async function getAdminTickets(params?: { raffle_id?: string; status?: string; user_name?: string; user_phone?: string }) {
    const searchParams = new URLSearchParams();
    searchParams.set('select', '*');

    if (params?.raffle_id) {
        searchParams.set('raffle_id', `eq.${params.raffle_id}`);
    }

    if (params?.status) {
        searchParams.set('ticket_status', `eq.${params.status}`);
    }

    if (params?.user_name && params.user_name.trim() !== '') {
        searchParams.set('user_name', `ilike.%${params.user_name}%`);
    }

    if (params?.user_phone && params.user_phone.trim() !== '') {
        searchParams.set('user_phone', `ilike.%${params.user_phone}%`);
    }

    searchParams.set('order', 'ticket_reserved_at.desc');

    const url = `${SUPABASE_URL}/rest/v1/vw_admin_tickets?${searchParams.toString()}`;

    return supaFetch(url);
}

export async function cancelTicket(ticketId: string) {
    return supaFetch(`${SUPABASE_URL}/rest/v1/tickets?id=eq.${ticketId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=minimal'
        },
        body: JSON.stringify({ status: 'deleted' })
    });
}
