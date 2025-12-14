import { authStore } from './auth.store';
import { refreshSession } from './auth.service';

export async function supaFetch(url: string, options: any = {}) {
    const token = authStore.accessToken;
    const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON;

    const config = {
        ...options,
        headers: {
            apikey: apikey!,
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    };

    let response = await fetch(url, config);

    // Si el token expiró
    if (response.status === 401 || response.status === 403) {
        try {
            await refreshSession();

            // Intentamos de nuevo
            config.headers.Authorization = `Bearer ${authStore.accessToken}`;
            response = await fetch(url, config);
        } catch (e) {
            throw new Error('Sesión expirada. Inicia sesión de nuevo.');
        }
    }

    const data = await response.json();
    if (!response.ok) throw new Error(JSON.stringify(data));

    return data;
}
