import { apiRequest } from "./request.js";
import { setToken, setUser, clearAuth, getUser } from "../utils/storage.js";

export async function signup(username, email, password) {
    const data = await apiRequest("/auth/signup", {
        method: "POST",
        body: JSON.stringify({ username, email, password })
    });
    if (data.token) setToken(data.token);
    if (data.user) setUser(data.user);
    return data;
}

export async function login(email, password) {
    const data = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password })
    });
    if (data.token) setToken(data.token);
    if (data.user) setUser(data.user);
    return data;
}

export async function fetchProfile() {
    return apiRequest("/profile/me");
}

export function logout() {
    clearAuth();
}

export function getCachedUser() {
    return getUser();
}
