import { initNavbar } from "../components/navbar.js";
import { apiGetMovieById } from "../api/movies.api.js"; 
import { getQueryParam } from "../utils/router.js"; 

document.addEventListener("DOMContentLoaded", async () => {
    
    initNavbar();

    
    const movieId = getQueryParam('id');
    const backLink = document.getElementById("back-link");

    if (movieId) {
        
        if (backLink) backLink.href = `movie.html?id=${movieId}`;
        await loadAltTitles(movieId);
    } else {
        
        if (backLink) backLink.href = "index.html"; 
        renderError("No Movie ID provided in URL.");
    }
});

async function loadAltTitles(movieId) {
    try {
        
        const data = await apiGetMovieById(movieId);
        
       
        const movie = data.movie || data;
        
        renderPage(movie);

    } catch (err) {
        console.error("Fetch Error:", err);
        renderError("Connection failed. Is backend running?");
    }
}

function renderError(msg) {
    const title = document.getElementById("movie-title");
    const body = document.getElementById("alt-titles-body");
    
    if (title) title.innerText = "Error";
    if (body) body.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">${msg}</td></tr>`;
}

function renderPage(movie) {
    const titleEl = document.getElementById("movie-title");
    if (titleEl) titleEl.innerText = `Alternative Titles: ${movie.primary_title}`;

    const tbody = document.getElementById("alt-titles-body");
    if (!tbody) return;
    
    tbody.innerHTML = ""; 

    if (!movie.alt_titles || movie.alt_titles.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:#888; padding:30px;">No alternative titles found for this movie.</td></tr>`;
        return;
    }

    movie.alt_titles.forEach(item => {
        const row = document.createElement("tr");

        const region = item.region_name ? item.region_name : `<span style="opacity:0.5">Global / Unknown</span>`;
        const lang = item.language_name ? item.language_name : "-";
        
        let typeBadge = "";
        if (item.types) {
            typeBadge = `<span class="tag-pill">${item.types}</span>`;
        } else {
            typeBadge = `<span style="opacity:0.5; font-size:0.8rem;">Original</span>`;
        }

        const titleDisplay = item.is_original_title ? 
            `<strong style="color:#fff;">${item.localized_title}</strong> <span title="Original Title" style="color:gold; cursor:help;">★</span>` : 
            `<span style="color:#ddd;">${item.localized_title}</span>`;

        row.innerHTML = `
            <td>${region}</td>
            <td>${lang}</td>
            <td>${titleDisplay}</td>
            <td>${typeBadge}</td>
        `;
        tbody.appendChild(row);
    });
}