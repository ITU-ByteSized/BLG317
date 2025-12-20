import { initNavbar } from "../components/navbar.js";
import { createMovieCard } from "../components/movieCard.js";
import { createPagination } from "../components/pagination.js";
import { apiRequest } from "../api/request.js";
import { apiGetAllGenres } from "../api/movies.api.js";
import { $ } from "../utils/dom.js";

let currentFilter = "all";
let currentPage = 1;
let currentSearchQuery = "";

let filterState = {
    genre: "all",
    minYear: "",
    maxYear: "",
    minRating: ""
};

async function populateGenres() {
    const genreSelect = document.getElementById("filter-genre");
    if (!genreSelect) return;

    try {
        const genres = await apiGetAllGenres();
        genres.forEach(g => {
            const option = document.createElement("option");
            option.value = g.genre_name;
            option.textContent = g.genre_name;
            genreSelect.appendChild(option);
        });
    } catch (err) {
        console.error("Genres could not be loaded:", err);
    }
}

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
    document.querySelectorAll(".filter-btn").forEach(b => {
        if(!b.classList.contains("special-filter")) b.classList.remove("active");
    });
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
        const params = new URLSearchParams({
            search: currentSearchQuery,
            type: currentFilter,
            page: currentPage,
            limit: 20,
            genre: filterState.genre !== "all" ? filterState.genre : "",
            min_year: filterState.minYear,
            max_year: filterState.maxYear,
            min_rating: filterState.minRating
        });

        const data = await apiRequest(`/movies?${params.toString()}`);

        renderMovies(data.results || []);
        
        createPagination({
            containerId: "pagination-wrapper",
            currentPage,
            totalPages: data.total_pages || 1,
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
    
    populateGenres();

    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');

    const modal = document.getElementById("filter-modal");
    const btnOpen = document.getElementById("btn-open-filter");
    const btnClose = document.querySelector(".close-modal");
    const btnApply = document.getElementById("btn-apply-filter");
    const btnClear = document.getElementById("btn-clear-filter");

    if(btnOpen) btnOpen.addEventListener("click", () => modal.classList.remove("hidden"));
    
    if(btnClose) btnClose.addEventListener("click", () => modal.classList.add("hidden"));
    
    window.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    });

    if(btnApply) btnApply.addEventListener("click", () => {
        filterState.genre = document.getElementById("filter-genre").value;
        filterState.minYear = document.getElementById("filter-year-min").value;
        filterState.maxYear = document.getElementById("filter-year-max").value;
        filterState.minRating = document.getElementById("filter-rating").value;
        
        currentPage = 1;
        modal.classList.add("hidden");
        loadSearch();
    });

    if(btnClear) btnClear.addEventListener("click", () => {
        document.getElementById("filter-genre").value = "all";
        document.getElementById("filter-year-min").value = "";
        document.getElementById("filter-year-max").value = "";
        document.getElementById("filter-rating").value = "";
        
        filterState = { genre: "all", minYear: "", maxYear: "", minRating: "" };
        
        currentPage = 1;
        modal.classList.add("hidden");
        loadSearch();
    });

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