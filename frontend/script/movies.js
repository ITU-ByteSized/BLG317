const API_URL = "http://127.0.0.1:5000/api";

let currentFilter = "all";

function setFilter(type, btn) {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = type;
    searchMovies();
}

function formatRuntime(minutes) {
    if (!minutes) return "N/A";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

function setTopLayout(enabled) {
    const container = document.getElementById("movie-container");
    if (enabled) {
        container.classList.add("top-layout");
    } else {
        container.classList.remove("top-layout");
    }
}

function createMovieCard(m) {
    const card = document.createElement("div");
    card.className = "movie-card";

    const posterUrl = m.poster_url || "https://via.placeholder.com/300x450/1f1f1f/555?text=No+Image";
    const formattedTime = formatRuntime(m.runtime_minutes);

    let typeBadge = "";
    if (m.type && m.type.toLowerCase() !== "movie") {
        let displayType = m.type;
        if (m.type === "tvSeries") displayType = "TV Series";
        if (m.type === "tvMiniSeries") displayType = "Mini Series";
        if (m.type === "tvEpisode") displayType = "Episode";
        if (m.type === "tvMovie") displayType = "TV Movie";
        if (m.type === "short") displayType = "Short";

        typeBadge = `<div class="type-pill">${displayType}</div>`;
    }

    const ratingValue = m.average_rating ? m.average_rating : "-";

    card.innerHTML = `
        <img src="${posterUrl}" class="poster-img" alt="${m.primary_title}" onerror="this.src='https://via.placeholder.com/300x450/1f1f1f/555?text=Image+Error'">
        ${typeBadge}
        <div class="card-info-default">
            <h3 class="movie-title">${m.primary_title}</h3>
            <div class="rating-badge">★ ${ratingValue}</div>
        </div>
        <div class="card-overlay">
            <div class="overlay-title">${m.primary_title}</div>
            <div class="divider"></div>
            <div class="overlay-meta">${m.start_year || "N/A"}</div>
            <div class="overlay-meta">${formattedTime}</div>
            <div class="overlay-rating">★ ${ratingValue}</div>
        </div>
    `;
    return card;
}

function renderMovies(movies) {
    const container = document.getElementById("movie-container");
    container.innerHTML = "";

    if (!movies || movies.length === 0) {
        container.innerHTML = "<p style='color:var(--text-muted); grid-column:1/-1; text-align:center; margin-top:50px; font-size:1.2rem;'>No titles found for your query.</p>";
        return;
    }

    movies.forEach(m => {
        const card = createMovieCard(m);
        container.appendChild(card);
    });
}

function renderTopMovies(grouped) {
    const container = document.getElementById("movie-container");
    container.innerHTML = "";

    const groups = [
        { key: "movies", title: "Top Movies" },
        { key: "series", title: "Top Series" },
        { key: "episodes", title: "Top Episodes" }
    ];

    let hasAny = false;

    groups.forEach(g => {
        const list = grouped[g.key] || [];
        if (!list.length) return;

        hasAny = true;

        const col = document.createElement("div");
        col.className = "top-column";

        const titleEl = document.createElement("h2");
        titleEl.className = "top-column-title";
        titleEl.textContent = g.title;
        col.appendChild(titleEl);

        const colCards = document.createElement("div");
        colCards.className = "column-cards";

        list.forEach(m => {
            const card = createMovieCard(m);
            colCards.appendChild(card);
        });

        col.appendChild(colCards);
        container.appendChild(col);
    });

    if (!hasAny) {
        container.innerHTML = "<p style='color:var(--text-muted); grid-column:1/-1; text-align:center; margin-top:50px; font-size:1.2rem;'>No data available.</p>";
    }
}

function loadMovies(query = "") {
    const container = document.getElementById("movie-container");

    if (currentFilter === "all" && !query.trim()) {
        setTopLayout(true);
        container.innerHTML = "";
        fetch(`${API_URL}/movies/top`)
            .then(res => {
                if (!res.ok) throw new Error("Network response was not ok");
                return res.json();
            })
            .then(data => {
                renderTopMovies(data);
            })
            .catch(err => {
                console.error("Fetch Error:", err);
                container.innerHTML = `<p style='color:var(--accent-color); text-align:center; grid-column:1/-1;'>
                    Connection error. Is the backend running?<br>
                    <small>${err.message}</small>
                </p>`;
            });
        return;
    }

    setTopLayout(false);

    let url = `${API_URL}/movies?search=${encodeURIComponent(query)}`;
    if (currentFilter !== "all") {
        url += `&type=${encodeURIComponent(currentFilter)}`;
    }

    fetch(url)
        .then(res => {
            if (!res.ok) throw new Error("Network response was not ok");
            return res.json();
        })
        .then(data => {
            container.innerHTML = "";
            renderMovies(data);
        })
        .catch(err => {
            console.error("Fetch Error:", err);
            container.innerHTML = `<p style='color:var(--accent-color); text-align:center; grid-column:1/-1;'>
                Connection error. Is the backend running?<br>
                <small>${err.message}</small>
            </p>`;
        });
}

function searchMovies() {
    const query = document.getElementById("search-input").value;
    loadMovies(query);
}

function handleEnter(e) {
    if (e.key === "Enter") searchMovies();
}

loadMovies();
