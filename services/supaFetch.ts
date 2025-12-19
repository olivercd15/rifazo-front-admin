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

    // 🔄 Token expirado → refresh
    if (response.status === 401 || response.status === 403) {
        try {
            await refreshSession();
            config.headers.Authorization = `Bearer ${authStore.accessToken}`;
            response = await fetch(url, config);
        } catch {
            throw new Error('Sesión expirada. Inicia sesión de nuevo.');
        }
    }

    // ✅ 204 No Content (DELETE / PATCH minimal)
    if (response.status === 204) {
        return null;
    }

    // 🧠 Leer como texto primero (seguro)
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new Error(JSON.stringify(data));
    }

    return data;
}
