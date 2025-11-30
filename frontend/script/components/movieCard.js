import { goTo } from "../utils/router.js";

function formatRuntime(minutes) {
    if (!minutes) return "N/A";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
}

export function createMovieCard(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";

    const posterUrl = movie.poster_url 
        || "https://via.placeholder.com/300x450/1f1f1f/555?text=No+Image";

    const formattedTime = formatRuntime(movie.runtime_minutes);
    const ratingValue = movie.average_rating ? movie.average_rating : "-";

    let typeBadge = "";
    if (movie.type && movie.type.toLowerCase() !== "movie") {
        let displayType = movie.type;
        if (movie.type === "tvSeries") displayType = "TV Series";
        if (movie.type === "tvMiniSeries") displayType = "Mini Series";
        if (movie.type === "tvEpisode") displayType = "Episode";

        typeBadge = `<div class="type-pill">${displayType}</div>`;
    }

    card.innerHTML = `
        <img 
            src="${posterUrl}" 
            class="poster-img" 
            alt="${movie.primary_title}"
            onerror="this.src='https://via.placeholder.com/300x450/1f1f1f/555?text=Image+Error'"
        >
        ${typeBadge}

        <div class="card-info-default">
            <h3 class="movie-title">${movie.primary_title}</h3>
            <div class="rating-badge">★ ${ratingValue}</div>
        </div>

        <div class="card-overlay">
            <div class="overlay-title">${movie.primary_title}</div>
            <div class="divider"></div>
            <div class="overlay-meta">${movie.start_year || "N/A"}</div>
            <div class="overlay-meta">${formattedTime}</div>
            <div class="overlay-rating">★ ${ratingValue}</div>
        </div>
    `;

    card.addEventListener("click", () => {
        if (movie.production_id) {
            goTo(`movie.html?id=${encodeURIComponent(movie.production_id)}`);
        }
    });

    return card;
}