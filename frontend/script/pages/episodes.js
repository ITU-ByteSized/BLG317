import { initNavbar } from "../components/navbar.js";
import { getQueryParam, goTo } from "../utils/router.js";
import { apiGetMovieById } from "../api/movies.api.js";
import { apiRequest } from "../api/request.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const id = getQueryParam("id");
    if (!id) {
        goTo("index.html");
        return;
    }

    document.getElementById("back-link").href = `movie.html?id=${id}`;

    const titleEl = document.getElementById("series-title");
    const tabsContainer = document.getElementById("season-tabs");
    const listContainer = document.getElementById("episode-list");

    try {
        const seriesData = await apiGetMovieById(id);
        const series = seriesData.movie || seriesData;
        titleEl.textContent = series.primary_title || "Unknown Series";

        const episodes = await apiRequest(`/movies/${id}/episodes`);

        if (!episodes || episodes.length === 0) {
            listContainer.innerHTML = "<p>No episodes found for this title.</p>";
            return;
        }

        const seasons = {};
        episodes.forEach(ep => {
            const sNum = ep.season_number || 0;
            if (!seasons[sNum]) seasons[sNum] = [];
            seasons[sNum].push(ep);
        });

        const sortedSeasons = Object.keys(seasons).sort((a, b) => Number(a) - Number(b));
        
        tabsContainer.innerHTML = "";
        sortedSeasons.forEach((sNum, index) => {
            const btn = document.createElement("button");
            btn.className = "season-tab";
            btn.textContent = sNum === "0" ? "Extras" : `Season ${sNum}`;
            
            if (index === 0) {
                btn.classList.add("active");
                renderEpisodes(seasons[sNum], listContainer);
            }

            btn.addEventListener("click", () => {
                document.querySelectorAll(".season-tab").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                renderEpisodes(seasons[sNum], listContainer);
            });

            tabsContainer.appendChild(btn);
        });

    } catch (err) {
        console.error(err);
        titleEl.textContent = "Error Loading Series";
        listContainer.innerHTML = `<p style="color:#ff4444">Failed to load episodes.</p>`;
    }
});

function renderEpisodes(list, container) {
    container.innerHTML = "";
    
    if(!list || list.length === 0) {
        container.innerHTML = "<p>No episodes in this season.</p>";
        return;
    }

    list.forEach(ep => {
        const div = document.createElement("div");
        div.className = "episode-card";

        const rating = ep.average_rating ? `★ ${ep.average_rating}` : "";
        const votes = ep.num_votes ? `(${ep.num_votes.toLocaleString()} votes)` : "";
        const runtime = ep.runtime_minutes ? `• ${ep.runtime_minutes} min` : "";

        div.innerHTML = `
            <div class="ep-number">S${ep.season_number} <br> E${ep.episode_number}</div>
            <div class="ep-info">
                <div class="ep-title">${ep.primary_title}</div>
                <div class="ep-meta">
                    ${rating ? `<span class="ep-rating">${rating}</span>` : ""}
                    <span>${votes}</span>
                    <span>${runtime}</span>
                </div>
            </div>
        `;
        
        div.style.cursor = "pointer";
        div.addEventListener("click", () => {
            if(ep.production_id) goTo(`movie.html?id=${ep.production_id}`);
        });

        container.appendChild(div);
    });
}