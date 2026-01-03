const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON;

import { authStore } from './auth.store';
import { createClient } from '@supabase/supabase-js'

export async function loginUser(email: string, password: string) {

    console.log('LOGIN PAYLOAD:', { email, password });

    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_KEY!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    console.log('LOGIN STATUS:', response.status);

    const data = await response.json();

    console.log('SUPABASE RESPONSE:', data);

    if (!response.ok) {
        const message = data.error_description || data.msg || data.error || 'Error desconocido al iniciar sesión';

        throw new Error(message);
    }

    authStore.accessToken = data.access_token;
    authStore.refreshToken = data.refresh_token;

    return data;
}

export async function refreshSession() {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
        method: 'POST',
        headers: {
            apikey: SUPABASE_KEY!,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            refresh_token: authStore.refreshToken
        })
    });

    const data = await response.json();
    if (!response.ok) throw new Error('No se pudo refrescar la sesión');

    authStore.accessToken = data.access_token;
    authStore.refreshToken = data.refresh_token;

    return data;
}


export async function signUpUser(email: string, password: string) {
    const supabase = createClient(
        SUPABASE_URL!,
        SUPABASE_KEY!,
    )
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    })
    if (error) {
        const message = error.message || 'Error desconocido al crear usuario';
        throw new Error(message);
    }
    return data;
}

