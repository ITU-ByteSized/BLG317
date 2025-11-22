import { initNavbar } from "../components/navbar.js";
import { createMovieCard } from "../components/movieCard.js";
import { createPagination } from "../components/pagination.js";
import { apiGetHome, apiSearchMovies } from "../api/movies.api.js";
import { $ } from "../utils/dom.js";

let currentFilter = "all";
let currentPage = 1;
let currentSearchQuery = "";

initNavbar({
    onSearch: (q) => {
        const url = new URL(window.location);
        if(q) url.searchParams.set("search", q);
        else url.searchParams.delete("search");
        window.history.pushState({}, "", url);
        
        currentSearchQuery = q;
        currentPage = 1;
        loadSearch();
    }
});

window.setFilter = (type, btn) => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentFilter = type;
    currentPage = 1;
    loadSearch();
};

function renderMovies(list) {
    const container = $("#movie-container");
    container.innerHTML = "";

    container.classList.remove("top-layout");

    if (!list || list.length === 0) {
        container.innerHTML = "<p class='empty-text' style='grid-column: 1/-1; text-align: center; color: #888; margin-top: 50px;'>No results found.</p>";
        return;
    }

    list.forEach(m => {
        const card = createMovieCard(m);
        container.appendChild(card);
    });
}

async function loadHome() {
    if (currentFilter !== 'all') {
        await loadSearch();
        return;
    }

    try {
        const data = await apiGetHome();
        let allItems = [];
        if (data.movies) allItems = allItems.concat(data.movies);
        if (data.series) allItems = allItems.concat(data.series);
        if (data.episodes) allItems = allItems.concat(data.episodes);
        
        renderMovies(allItems);
    } catch (err) {
        console.error("Home load error:", err);
    }
}

async function loadSearch() {
    try {
        const data = await apiSearchMovies(currentSearchQuery, currentFilter, currentPage);

        renderMovies(data.results || data || []);
        
        const totalPages = data.total_pages || 1;
        
        createPagination({
            containerId: "pagination-wrapper",
            currentPage,
            totalPages,
            onPageChange: (p) => {
                currentPage = p;
                loadSearch();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    } catch (err) {
        console.error("Search load error:", err);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    if (searchParam) {
        currentSearchQuery = searchParam;
        setTimeout(() => {
            const input = $("#search-input");
            if(input) input.value = searchParam;
        }, 100);
        loadSearch();
    } else {
        loadHome();
    }
});