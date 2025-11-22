import { apiRequest } from "./request.js";

export function apiGetHome() {
    return apiRequest("/movies/home");
}

export function apiSearchMovies(query = "", type = "all") {
    let path = `/movies?search=${encodeURIComponent(query)}`;
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
