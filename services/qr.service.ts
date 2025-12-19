import { supaFetch } from './supaFetch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

/* ===== READ ===== */
export async function getQrImages() {
    return supaFetch(`${SUPABASE_URL}/rest/v1/qr_images?select=*`);
}

/* ===== CREATE ===== */
export async function createQrImage(payload: { name: string; url_image: string; is_enabled: boolean }) {
    return supaFetch(`${SUPABASE_URL}/rest/v1/qr_images`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
    });
}

/* ===== CREATE BY UPLOAD FUNC ===== */
export async function createQrImageEdge(payload: { name: string; image_base64: string; is_enabled: boolean }) {
    return supaFetch(`${SUPABASE_URL}/functions/v1/upload-qr-image`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
}

/* ===== UPDATE ===== */
export async function updateQrImage(
    id: string,
    payload: {
        name: string;
        url_image: string;
        is_enabled: boolean;
    }
) {
    return supaFetch(`${SUPABASE_URL}/rest/v1/qr_images?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
        },
        body: JSON.stringify(payload)
    });
}

/* ===== DELETE ===== */
export async function deleteQrImage(id: string) {
    return supaFetch(`${SUPABASE_URL}/rest/v1/qr_images?id=eq.${id}`, {
        method: 'DELETE',
        headers: {
            Prefer: 'return=minimal'
        }
    });
}

/* ===== TOGGLE ===== */
export async function toggleQrEnabled(id: string, value: boolean) {
    return supaFetch(`${SUPABASE_URL}/rest/v1/qr_images?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Prefer: 'return=representation'
        },
        body: JSON.stringify({ is_enabled: value })
    });
}
