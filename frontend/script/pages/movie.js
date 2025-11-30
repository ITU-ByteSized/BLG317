import { initNavbar } from "../components/navbar.js";
import { getQueryParam } from "../utils/router.js";
import { apiGetMovieById, apiRateMovie } from "../api/movies.api.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const id = getQueryParam("id");
    if (!id) return;

    const titleEl = document.getElementById("movie-title");
    const posterEl = document.getElementById("movie-poster");
    const submetaEl = document.getElementById("movie-submeta");
    const genresEl = document.getElementById("movie-genres");
    const overviewEl = document.getElementById("movie-overview");
    const castEl = document.getElementById("movie-cast");
    const crewEl = document.getElementById("movie-crew");
    const ratingsEl = document.getElementById("movie-ratings");
    const starsBox = document.getElementById("user-rating-stars");
    const hintEl = document.getElementById("user-rating-hint");

    if (overviewEl) {
        overviewEl.innerHTML = "<span style='color:#888'>Loading details...</span>";
    }

    try {
        const data = await apiGetMovieById(id);
        const movie = data.movie || data;

        if (titleEl) {
            titleEl.textContent = movie.primary_title || "Untitled";
        }
        
        if (posterEl) {
            posterEl.src = movie.poster_url || "https://via.placeholder.com/500x750?text=No+Poster";
            posterEl.onerror = () => {
                posterEl.src = "https://via.placeholder.com/500x750?text=Image+Error";
            };
        }

        const heroSection = document.getElementById("movie-hero");
        if (heroSection && movie.poster_url) {
            heroSection.style.backgroundImage =
                `linear-gradient(to bottom, rgba(18,18,18,0.85), var(--bg-color)), url('${movie.poster_url}')`;
        }

        if (submetaEl) {
            const year = movie.start_year || "N/A";
            const runtime = movie.runtime_minutes ? `${movie.runtime_minutes} min` : "";
            const adult = movie.is_adult ? "<span class='meta-tag'>18+</span>" : "";
            submetaEl.innerHTML = `<span>${year}</span> • <span>${runtime}</span> ${adult}`;
        }

        if (genresEl) {
            const genreList = movie.genres || [];
            if (genreList.length > 0) {
                genresEl.innerHTML = genreList
                    .map(g => `<span class="genre-tag">${g}</span>`)
                    .join("");
            } else {
                genresEl.innerHTML = "";
            }
        }

        if (overviewEl) {
            overviewEl.textContent = movie.overview || movie.plot || "No overview available.";
        }

        if (castEl) {
            castEl.innerHTML = "";
            const castList = data.cast || [];
            if (castList.length === 0) {
                castEl.innerHTML = "<p class='text-muted'>No cast information.</p>";
            } else {
                castList.forEach((person) => {
                    const card = createPersonCard(person, "actor");
                    castEl.appendChild(card);
                });
            }
        }

        if (crewEl) {
            crewEl.innerHTML = "";
            const crewList = data.crew || [];
            if (crewList.length === 0) {
                crewEl.innerHTML = "<p class='text-muted'>No crew information.</p>";
            } else {
                crewList.forEach((person) => {
                    const card = createPersonCard(person, "crew");
                    crewEl.appendChild(card);
                });
            }
        }

        if (ratingsEl) {
            const avg = movie.average_rating;
            const votes = movie.num_votes;
            
            if (avg) {
                ratingsEl.innerHTML = `
                    <div class="rating-display-big">
                        <span class="rating-star-icon">★</span>
                        <span class="rating-value">${avg}</span>
                        <span class="rating-max">/10</span>
                    </div>
                    <div class="rating-votes">${votes ? votes.toLocaleString() : 0} votes</div>
                `;
            } else {
                ratingsEl.innerHTML = "<p class='text-muted'>Not rated yet.</p>";
            }
        }

        if (starsBox) {
            initUserRatingStars(starsBox, hintEl, id);
        }

    } catch (err) {
        console.error("Movie load error:", err);
        if (titleEl) {
            titleEl.textContent = "Content Not Found";
        }
        if (overviewEl) {
            overviewEl.textContent = "Could not load details. Check console for errors.";
        }
    }
});

function createPersonCard(person, type) {
    const div = document.createElement("div");
    div.className = "person-card";
    
    const name = person.name || person.primary_name || "Unknown";
    const initials = name
        .split(" ")
        .map(n => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
    
    let subText = "";
    if (type === "actor") {
        subText = person.characters || "Actor";
    } else {
        subText = person.job || person.category || "Crew";
    }

    div.innerHTML = `
        <div class="person-avatar-small">${initials}</div>
        <div class="person-info">
            <div class="person-name">${name}</div>
            <div class="person-role">${subText}</div>
        </div>
    `;

    div.addEventListener("click", () => {
        if (person.person_id) {
            window.location.href = `person.html?id=${encodeURIComponent(person.person_id)}`;
        }
    });

    return div;
}

function initUserRatingStars(container, hintEl, movieId) {
    container.innerHTML = "";
    const current = 0;

    for (let i = 1; i <= 10; i++) {
        const span = document.createElement("span");
        span.className = "rating-star-ui";
        span.innerHTML = "★";
        span.dataset.value = String(i);

        span.addEventListener("mouseenter", () => {
            updateStarsUI(container, i);
            if (hintEl) {
                hintEl.textContent = `Rate: ${i}/10`;
            }
        });

        span.addEventListener("mouseleave", () => {
            updateStarsUI(container, current);
            if (hintEl) {
                hintEl.textContent = "";
            }
        });

        span.addEventListener("click", async () => {
            try {
                await apiRateMovie(movieId, i);
                alert(`You rated this ${i}/10!`);
            } catch (err) {
                console.error(err);
                alert("Error saving rating.");
            }
        });

        container.appendChild(span);
    }
}

function updateStarsUI(container, value) {
    const stars = Array.from(container.querySelectorAll(".rating-star-ui"));
    stars.forEach((star, idx) => {
        if (idx < value) {
            star.classList.add("active");
        } else {
            star.classList.remove("active");
        }
    });
}
