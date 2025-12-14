import { supaFetch } from './supaFetch';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;


export async function getQrImages() {
    return supaFetch(`${SUPABASE_URL}/rest/v1/qr_images?select=*`);
}

export async function getQrVouchers() {
    return supaFetch(`${SUPABASE_URL}/rest/v1/vw_qr_vouchers?select=*`);
}
