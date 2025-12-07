import { apiRequest } from "./request.js";

export function fetchAwards() {
    return apiRequest("/awards");
}