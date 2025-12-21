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

export function apiGetMovieById(id) {
    return apiRequest(`/movies/${encodeURIComponent(id)}`);
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