import { apiRequest } from "./request.js";

export function apiGetHome() {
    return apiRequest("/movies/home");
}


export function apiSearchMovies(query = "", type = "all", page = 1) {
    
    let path = `/movies?search=${encodeURIComponent(query)}&page=${page}&limit=20`; 
    
    if (type && type !== "all") {
        path += `&type=${encodeURIComponent(type)}`;
    }
    return apiRequest(path);
}

export async function apiGetMovieById(id, user_id = null) {
    let url = `${API_BASE_URL}/movies/${encodeURIComponent(id)}`;
    if (user_id) {
        url += `?user_id=${encodeURIComponent(user_id)}`;
    }
    return await apiRequest(url);
}

export function apiRateMovie(id, rating) {
    return apiRequest(`/movies/${encodeURIComponent(id)}/rate`, {
        method: "POST",
        body: JSON.stringify({ rating })
    });
}

export function apiGetMovieEpisodes(id) {
    return apiRequest(`/movies/${encodeURIComponent(id)}/episodes`);
}

export function apiGetMovieAwards(id) {
    return apiRequest(`/movies/${encodeURIComponent(id)}/awards`);
}