import { initNavbar } from "../components/navbar.js";
import { getQueryParam } from "../utils/router.js";
import { 
    apiGetMovieById, 
    apiRateMovie, 
    apiGetMovieAwards, 
    apiGetMovieEpisodes 
} from "../api/movies.api.js";

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

    const btnCast = document.getElementById("btn-cast");
    const btnCrew = document.getElementById("btn-crew");
    const btnAlt = document.getElementById("btn-alt-titles");
    const btnEp = document.getElementById("btn-episodes");
    const btnAwards = document.getElementById("btn-awards");

    const sectionCast = document.getElementById("section-cast");
    const sectionCrew = document.getElementById("section-crew");
    const sectionAlt = document.getElementById("section-alt");
    const sectionEp = document.getElementById("section-episodes");
    const sectionAwards = document.getElementById("section-awards");

    const altListEl = document.getElementById("movie-alt-list");
    const epListEl = document.getElementById("movie-episodes-list");
    const seasonTabsEl = document.getElementById("season-tabs");
    const awardsListEl = document.getElementById("movie-awards-list");

    if (overviewEl) {
        overviewEl.innerHTML = "<span style='color:#888'>Loading details...</span>";
    }

    let currentMovie = null;

    try {
        const data = await apiGetMovieById(id);
        const movie = data.movie || data;
        currentMovie = movie;

        if (titleEl) titleEl.textContent = movie.primary_title || "Untitled";
        
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
                castEl.innerHTML = "<p class='text-muted' style='text-align:center; width:100%; grid-column:1/-1;'>No cast information.</p>";
            } else {
                castList.forEach((person) => {
                    const card = createPersonCard(person, "actor");
                    castEl.appendChild(card);
                });
            }
        }

        if (altListEl && movie.alt_titles) {
            renderAltTitles(movie.alt_titles, altListEl);
        }

        if (btnEp) {
            const type = (movie.type || "").toLowerCase();
            const isSeries = type === "tvseries" || type === "tvminiseries";
            if (!isSeries) {
                btnEp.classList.add("hidden");
                btnEp.style.display = "none";
            } else {
                btnEp.classList.remove("hidden");
                btnEp.style.display = "";
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
        if (titleEl) titleEl.textContent = "Content Not Found";
        if (overviewEl) overviewEl.textContent = "Could not load details.";
    }

    const allTabs = [btnCast, btnCrew, btnAlt, btnEp, btnAwards];
    const allSections = [sectionCast, sectionCrew, sectionAlt, sectionEp, sectionAwards];

    const switchTab = (activeBtn, sectionToShow) => {
        allTabs.forEach(b => {
            if (b) b.classList.remove("active");
        });
        if (activeBtn) activeBtn.classList.add("active");

        allSections.forEach(s => {
            if (s) s.classList.add("hidden");
        });

        if (sectionToShow) sectionToShow.classList.remove("hidden");
    };

    if (btnCast) {
        btnCast.addEventListener("click", () => switchTab(btnCast, sectionCast));
    }

    if (btnCrew) {
        btnCrew.addEventListener("click", () => switchTab(btnCrew, sectionCrew));
    }

    if (btnAlt) {
        btnAlt.addEventListener("click", () => {
            switchTab(btnAlt, sectionAlt);
        });
    }

    if (btnEp) {
        btnEp.addEventListener("click", async () => {
            switchTab(btnEp, sectionEp);

            if (sectionEp.dataset.loaded === "true") return;

            if (epListEl) {
                epListEl.innerHTML = "<p style='color:#888'>Loading episodes...</p>";
                try {
                    const episodes = await apiGetMovieEpisodes(id);
                    renderEpisodesTab(episodes, epListEl, seasonTabsEl);
                    sectionEp.dataset.loaded = "true";
                } catch (err) {
                    console.error(err);
                    epListEl.innerHTML = "<p style='color:red'>Failed to load episodes.</p>";
                }
            }
        });
    }

    if (btnAwards) {
        btnAwards.addEventListener("click", async () => {
            switchTab(btnAwards, sectionAwards);

            if (sectionAwards.dataset.loaded === "true") return;

            if (awardsListEl) {
                awardsListEl.innerHTML = "<p style='color:#888'>Loading awards...</p>";
                try {
                    const awards = await apiGetMovieAwards(id);
                    renderMovieAwards(awards, awardsListEl);
                    sectionAwards.dataset.loaded = "true";
                } catch (err) {
                    console.error(err);
                    awardsListEl.innerHTML = "<p style='color:red'>Failed to load awards.</p>";
                }
            }
        });
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

function renderAltTitles(list, container) {
    container.innerHTML = "";
    if (!list || list.length === 0) {
        container.innerHTML = "<tr><td colspan='3' style='padding:15px; text-align:center;'>No alternative titles found.</td></tr>";
        return;
    }

    list.forEach(item => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #333";
        
        const region = item.region_name || "-";
        const lang = item.language_name || "-";
        const title = item.localized_title || "";
        const isOriginal = item.is_original_title ? " (Original)" : "";

        row.innerHTML = `
            <td style="padding: 10px;">${region}</td>
            <td style="padding: 10px;">${lang}</td>
            <td style="padding: 10px; color: #fff;">${title}<span style="color:#666; font-size:0.8rem">${isOriginal}</span></td>
        `;
        container.appendChild(row);
    });
}

function renderEpisodesTab(episodes, listContainer, tabsContainer) {
    listContainer.innerHTML = "";
    tabsContainer.innerHTML = "";

    if (!episodes || episodes.length === 0) {
        listContainer.innerHTML = "<p>No episodes found.</p>";
        return;
    }

    const seasons = {};
    episodes.forEach(ep => {
        const sNum = ep.season_number || 0;
        if (!seasons[sNum]) seasons[sNum] = [];
        seasons[sNum].push(ep);
    });

    const sortedSeasons = Object.keys(seasons).sort((a, b) => Number(a) - Number(b));

    sortedSeasons.forEach((sNum, index) => {
        const btn = document.createElement("button");
        btn.className = "season-tab-btn";
        btn.textContent = sNum === "0" ? "Extras" : `Season ${sNum}`;
        btn.style.padding = "8px 16px";
        btn.style.background = "transparent";
        btn.style.border = "1px solid #444";
        btn.style.color = "#ccc";
        btn.style.borderRadius = "20px";
        btn.style.cursor = "pointer";

        if (index === 0) {
            btn.style.background = "var(--accent-color)";
            btn.style.color = "#000";
            btn.style.fontWeight = "bold";
            renderEpisodeListSimple(seasons[sNum], listContainer);
        }

        btn.addEventListener("click", () => {
            Array.from(tabsContainer.children).forEach(b => {
                b.style.background = "transparent";
                b.style.color = "#ccc";
                b.style.fontWeight = "normal";
            });
            btn.style.background = "var(--accent-color)";
            btn.style.color = "#000";
            btn.style.fontWeight = "bold";

            renderEpisodeListSimple(seasons[sNum], listContainer);
        });

        tabsContainer.appendChild(btn);
    });
}

function renderEpisodeListSimple(list, container) {
    container.innerHTML = "";
    if(!list) return;

    list.forEach(ep => {
        const div = document.createElement("div");
        div.style.padding = "12px";
        div.style.borderBottom = "1px solid #333";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.gap = "15px";

        const num = `<span style="color:var(--accent-color); font-weight:bold; min-width:40px;">E${ep.episode_number}</span>`;
        const title = `<span style="color:#fff; font-weight:600;">${ep.primary_title || "Episode"}</span>`;
        const rating = ep.average_rating ? `<span style="color:#888; font-size:0.9rem;">★ ${ep.average_rating}</span>` : "";

        div.innerHTML = `${num} <div style="display:flex; flex-direction:column;">${title} ${rating}</div>`;
        
        container.appendChild(div);
    });
}

function renderMovieAwards(awards, container) {
    container.innerHTML = "";

    if (!awards || awards.length === 0) {
        container.innerHTML = "<p class='text-muted' style='grid-column:1/-1;'>No awards found for this title.</p>";
        return;
    }

    awards.forEach(award => {
        const div = document.createElement("div");
        div.className = "award-card"; 
        div.style.cursor = "default";

        div.innerHTML = `
            <div class="award-info" style="width:100%">
                <div class="award-category" style="color:var(--accent-color); font-weight:bold;">${award.ceremony_year} ${award.category_name}</div>
                <div class="award-movie-title" style="margin:5px 0; color:#fff;">${award.winner ? "🏆 WINNER" : "Nominee"}</div>
                ${award.detail ? `<div class="award-detail" style="color:#888; font-size:0.9rem;">${award.detail}</div>` : ""}
            </div>
        `;
        container.appendChild(div);
    });
}

// Kullanıcı Puanlama Yıldızları
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
            if (hintEl) hintEl.textContent = `Rate: ${i}/10`;
        });

        span.addEventListener("mouseleave", () => {
            updateStarsUI(container, current);
            if (hintEl) hintEl.textContent = "";
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