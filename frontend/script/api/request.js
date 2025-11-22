import { API_URL } from "../config.js";
import { getToken } from "../utils/storage.js";

export async function apiRequest(path, options = {}) {
    const headers = options.headers ? { ...options.headers } : {};
    if (!headers["Content-Type"] && options.body) {
        headers["Content-Type"] = "application/json";
    }

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers
    });

    let data;
    try {
        data = await res.json();
    } catch {
        data = null;
    }

    if (!res.ok) {
        const message = data && data.message ? data.message : `HTTP ${res.status}`;
        const error = new Error(message);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}