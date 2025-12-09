import { initNavbar } from "../components/navbar.js";
import { fetchMyRatings } from "../api/profile.api.js";
import { createMovieCard } from "../components/movieCard.js";
import { getToken, getUser } from "../utils/storage.js";
import { goTo } from "../utils/router.js";
import { API_URL } from "../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const token = getToken();
    if (!token) {
        goTo("login.html");
        return;
    }

    const usernameEl = document.getElementById("profile-username");
    const initialEl = document.getElementById("profile-initial");
    const bioEl = document.getElementById("profile-bio");
    const locEl = document.getElementById("profile-location");
    const btnAdmin = document.getElementById("btn-admin-panel");
    const avatarContainer = document.querySelector(".profile-avatar-large");
    
    const statCountEl = document.getElementById("stat-count");
    const statYearEl = document.getElementById("stat-year");
    const ratingsContainer = document.getElementById("profile-ratings");
    const movieSection = document.querySelector(".movie-section");

    try {
        const localUser = getUser();
        let query = "";
        
        if(localUser && localUser.email) {
            query = `?email=${encodeURIComponent(localUser.email)}&current_user=${encodeURIComponent(localUser.email)}`;
        }
        
        const res = await fetch(`${API_URL}/profile/me${query}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const user = await res.json();

        if (user && !user.error) {
            if (user.is_private) {
                if (usernameEl) usernameEl.textContent = user.username || "User";
                
                const detailsContainer = document.querySelector(".profile-details");
                if (detailsContainer) {
                     const msg = document.createElement("p");
                     msg.style.color = "#ff4444";
                     msg.style.fontSize = "1.2rem";
                     msg.style.marginTop = "20px";
                     msg.textContent = user.message || "Bu profil gizlidir.";
                     
                     if(bioEl) bioEl.style.display = "none";
                     if(locEl) locEl.style.display = "none";
                     if(document.querySelector(".profile-stats")) document.querySelector(".profile-stats").style.display = "none";
                     
                     detailsContainer.appendChild(msg);
                }

                if (avatarContainer && user.avatar_url) {
                    avatarContainer.style.backgroundImage = `url('${user.avatar_url}')`;
                    avatarContainer.style.backgroundSize = "cover";
                    avatarContainer.style.backgroundPosition = "center";
                    avatarContainer.innerHTML = ""; 
                }

                if (movieSection) movieSection.style.display = "none";
                
                return; 
            }

            if (usernameEl) usernameEl.textContent = user.username || "User";
            
            if (avatarContainer) {
                if (user.avatar_url) {
                    avatarContainer.style.backgroundImage = `url('${user.avatar_url}')`;
                    avatarContainer.style.backgroundSize = "cover";
                    avatarContainer.style.backgroundPosition = "center";
                    avatarContainer.innerHTML = "";
                } else {
                    avatarContainer.style.backgroundImage = "none";
                    if (initialEl && user.username) {
                        initialEl.textContent = user.username.charAt(0).toUpperCase();
                    }
                }
            }

            if (bioEl) bioEl.textContent = user.bio || "No biography yet.";
            if (locEl) locEl.textContent = user.location ? `📍 ${user.location}` : "";

            if (statYearEl && user.member_since) {
                const date = new Date(user.member_since);
                statYearEl.textContent = date.getFullYear();
            }

            if (statCountEl && user.stats) {
                statCountEl.textContent = user.stats.total_ratings || 0;
            }

            if (user.urole === 'admin') {
                if (btnAdmin) btnAdmin.classList.remove('hidden');
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