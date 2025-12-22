import { apiRequest } from "./request.js";

export function fetchMyRatings() {
    return apiRequest("/profile/ratings");
}

export function apiGetUserRatings(email) {
    return apiRequest(`/profile/ratings?email=${encodeURIComponent(email)}`);
}

export function apiGetUserComments(email) {
    return apiRequest(`/profile/comments?email=${encodeURIComponent(email)}`);
}