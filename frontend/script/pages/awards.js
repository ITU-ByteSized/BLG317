import { initNavbar } from "../components/navbar.js";
import { fetchAwards } from "../api/awards.api.js";
import { goTo } from "../utils/router.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const container = document.getElementById("awards-container");

    try {
        const data = await fetchAwards();
        renderAwards(data, container);
    } catch (err) {
        console.error("Awards load error:", err);
        container.innerHTML = `<p style="text-align:center; color:#ff4444;">Failed to load awards. Is the backend running?</p>`;
    }
});

function renderAwards(groupedData, container) {
    container.innerHTML = "";
    
    const years = Object.keys(groupedData).sort((a, b) => b - a);

    if (years.length === 0) {
        container.innerHTML = "<p>No awards found.</p>";
        return;
    }

    years.forEach(year => {
        const awardsList = groupedData[year];
        
        const section = document.createElement("div");
        section.className = "ceremony-group";

        const title = document.createElement("h2");
        title.className = "ceremony-title";
        title.innerHTML = `${year} <span style="font-size:1rem; color:#888; font-weight:normal;">Academy Awards</span>`;
        section.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "awards-grid";

        awardsList.forEach(award => {
            const card = createAwardCard(award);
            grid.appendChild(card);
        });

        section.appendChild(grid);
        container.appendChild(section);
    });
}

function createAwardCard(award) {
    const card = document.createElement("div");
    card.className = "award-card";

    const posterUrl = award.poster_url || "https://via.placeholder.com/70x105/333/888?text=N/A";
    
    card.innerHTML = `
        <img src="${posterUrl}" class="award-poster" alt="${award.primary_title}" onerror="this.src='https://via.placeholder.com/70x105/333/888?text=Err'">
        <div class="award-info">
            <div class="award-category">${award.category_name}</div>
            <div class="award-movie-title">${award.primary_title || "Unknown Title"}</div>
            ${award.detail ? `<div class="award-detail">${award.detail}</div>` : ""}
        </div>
    `;

    if (award.production_id) {
        card.addEventListener("click", () => {
            goTo(`movie.html?id=${encodeURIComponent(award.production_id)}`);
        });
    }

    return card;
}