import { supaFetch } from './supaFetch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/* ===== READ ===== */
export async function getRaffles() {
    return supaFetch(`${SUPABASE_URL}/rest/v1/raffles?select=*`);
}

/* ===== CREATE ===== */
export async function createRaffle(payload: Partial<any>) {
    return supaFetch(`${SUPABASE_URL}/rest/v1/raffles`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
    });
}

/* ===== UPDATE ===== */
export async function updateRaffle(id: string, payload: Partial<any>) {
    return supaFetch(`${SUPABASE_URL}/rest/v1/raffles?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
    });
}

/* ===== DELETE ===== */
export async function deleteRaffle(id: string) {
    return supaFetch(`${SUPABASE_URL}/rest/v1/raffles?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
            Prefer: 'return=minimal'
        }
    });
}



/* ===== CREATE RAFFLE CARD UPLOAD ===== */
export async function uploadRaffleCardEdge(payload: {
    raffle_id: string;
    file_name: string;
    content_type: string;
}) {
    return supaFetch(
        `${SUPABASE_URL}/functions/v1/upload-raffle-card`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    );
}


/* ===== ASSIGN RAFFLE WINNER ===== */
export async function assignRaffleWinner(payload: {
    raffle_id: string;
    ticket_number: string;
}) {
    return supaFetch(
        `${SUPABASE_URL}/functions/v1/assign-winner`,
        {
            method: 'POST',
            body: JSON.stringify(payload)
        }
    );
}


/* ===== GET ACTIVE TICKETS BY RAFFLE (WITH USER NAME) ===== */
export async function getActiveTicketsByRaffle(raffleId: string) {
    return supaFetch(
        `${SUPABASE_URL}/rest/v1/tickets?raffle_id=eq.${raffleId}&status=eq.active&select=id,ticket_number,user_id,user_profiles(full_name,email)`
    );
}



