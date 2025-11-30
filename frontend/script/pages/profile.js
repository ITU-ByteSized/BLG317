import { initNavbar } from "../components/navbar.js";
import { fetchProfile } from "../api/auth.api.js";
import { fetchMyRatings } from "../api/profile.api.js";
import { createMovieCard } from "../components/movieCard.js";
import { getToken } from "../utils/storage.js";
import { goTo } from "../utils/router.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const token = getToken();
    if (!token) {
        goTo("login.html");
        return;
    }

    const usernameEl = document.getElementById("profile-username");
    const emailEl = document.getElementById("profile-email");
    const initialEl = document.getElementById("profile-initial");
    const statCountEl = document.getElementById("stat-count");
    const statYearEl = document.getElementById("stat-year");
    const ratingsContainer = document.getElementById("profile-ratings");

    try {
        const user = await fetchProfile();
        if (user) {
            if (usernameEl) usernameEl.textContent = user.username || "User";
            if (emailEl) emailEl.textContent = user.email || "";
            
            if (initialEl && user.username) {
                initialEl.textContent = user.username.charAt(0).toUpperCase();
            }

            if (statYearEl) statYearEl.textContent = user.member_since || new Date().getFullYear();
            if (statCountEl && user.stats) {
                statCountEl.textContent = user.stats.total_ratings || 0;
            }
        }
    } catch (e) {
        console.error("Profile load error", e);
    }

    if (!ratingsContainer) return;
    ratingsContainer.innerHTML = "<p style='color:#888'>Loading ratings...</p>";

    try {
        const ratings = await fetchMyRatings();
        ratingsContainer.innerHTML = "";

        if (!ratings || ratings.length === 0) {
            ratingsContainer.innerHTML = "<p style='color:#888; grid-column:1/-1;'>You haven't rated any titles yet.</p>";
            return;
        }

        ratings.forEach((item) => {
            const movieData = { ...item };
            const card = createMovieCard(movieData);
            ratingsContainer.appendChild(card);
        });
    } catch (err) {
        ratingsContainer.innerHTML = `<p style='color:var(--accent-color)'>Failed to load ratings: ${err.message}</p>`;
    }
});