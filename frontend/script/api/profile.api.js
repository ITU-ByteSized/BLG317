import { apiRequest } from "./request.js";

export function fetchMyRatings() {
    return apiRequest("/profile/ratings");
}
