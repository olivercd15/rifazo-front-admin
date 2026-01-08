import { supaFetch } from '@/services/supaFetch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/* ===== GET LIST (VIEW) ===== */
export async function getPromoMulti(filters?: {
    is_active?: boolean;
    promo_name?: string;
}) {
    const params = new URLSearchParams({
        select: '*',
        order: 'created_at.desc'
    });

    if (filters?.is_active !== undefined) {
        params.append('is_active', `eq.${filters.is_active}`);
    }

    if (filters?.promo_name) {
        params.append('name', `ilike.*${filters.promo_name}*`);
    }

    return supaFetch(
        `${SUPABASE_URL}/rest/v1/vw_admin_promos_multi?${params.toString()}`
    );
}


/* ===== CREATE ===== */
export async function createPromoMulti(payload: Partial<any>) {
  return supaFetch(`${SUPABASE_URL}/rest/v1/promos_multi`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify(payload)
  });
}

/* ===== UPDATE ===== */
export async function updatePromoMulti(
  id: string,
  payload: Partial<any>
) {
  return supaFetch(
    `${SUPABASE_URL}/rest/v1/promos_multi?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify(payload)
    }
  );
}

/* ===== DELETE ===== */
export async function deletePromoMulti(id: string) {
  return supaFetch(
    `${SUPABASE_URL}/rest/v1/promos_multi?id=eq.${id}`,
    {
      method: 'DELETE'
    }
  );
}
