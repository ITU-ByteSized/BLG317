import { apiRequest } from "./request.js";

export function fetchPersonDetails(id) {
    return apiRequest(`/people/${encodeURIComponent(id)}`);
}
