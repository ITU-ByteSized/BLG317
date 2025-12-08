import { initNavbar } from "../components/navbar.js";
import { createMovieCard } from "../components/movieCard.js";
import { createPagination } from "../components/pagination.js";
import { apiGetHome, apiSearchMovies } from "../api/movies.api.js";
import { $ } from "../utils/dom.js";

let currentFilter = "all";
let currentPage = 1;
let currentSearchQuery = "";


function showLoading() {
    const container = $("#movie-container");
    container.innerHTML = `<p style="text-align:center; padding:40px; color:#666;">Loading...</p>`;
}

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
    currentFilter = 'all'; 
    await loadSearch();
}

async function loadSearch() {
    showLoading();
    try {
        
        const data = await apiSearchMovies(currentSearchQuery, currentFilter, currentPage);

        renderMovies(data.results || []);
        
        
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
        $("#movie-container").innerHTML = "<p style='text-align:center; color:red;'>Error loading data.</p>";
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