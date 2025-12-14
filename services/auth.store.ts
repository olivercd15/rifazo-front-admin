export const authStore = {
    get accessToken() {
        return localStorage.getItem('access_token');
    },

    set accessToken(token: string | null) {
        if (!token) localStorage.removeItem('access_token');
        else localStorage.setItem('access_token', token);
    },

    get refreshToken() {
        return localStorage.getItem('refresh_token');
    },

    set refreshToken(token: string | null) {
        if (!token) localStorage.removeItem('refresh_token');
        else localStorage.setItem('refresh_token', token);
    }
};
