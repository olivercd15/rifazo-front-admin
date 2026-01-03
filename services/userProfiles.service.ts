import { supaFetch } from './supaFetch';
import { authStore } from './auth.store';
import { updateUserProfile} from '../types/userProfiles'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON;


export async function getUserProfiles() {
    return supaFetch(`${SUPABASE_URL}/rest/v1/user_profiles?select=*`);
}


export async function createUserProfiles(body: updateUserProfile, email: string) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/user_profiles?email=eq.${email}`, {
        method: 'PATCH',
        headers: {
            apikey: SUPABASE_KEY!,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(body)
    });
    const data = await response.json();

    localStorage.setItem('SUPABASE RESPONSE:', data);

    if (!response.ok) {
        const message = data.error_description || data.msg || data.error || 'Error desconocido al iniciar sesión';
        throw new Error(message);
    }
    return data;
}
