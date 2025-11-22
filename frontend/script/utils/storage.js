const TOKEN_KEY = "bs_token";
const USER_KEY = "bs_user";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
}

export function setToken(token, remember = true) {
    if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

export function getUser() {
    const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function setUser(user, remember = true) {
    if (!user) return;
    const str = JSON.stringify(user);
    if (remember) {
        localStorage.setItem(USER_KEY, str);
    } else {
        sessionStorage.setItem(USER_KEY, str);
    }
}

export function clearUser() {
    localStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(USER_KEY);
}

export function clearAuth() {
    clearToken();
    clearUser();
}

export function isLoggedIn() {
    return !!getToken();
}

export function logout() {
    clearAuth();
}