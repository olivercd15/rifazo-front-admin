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
