const API_URL = "http://127.0.0.1:5000/api";


const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');


if (movieId) {
    document.getElementById("back-link").href = `movie.html?id=${movieId}`;
} else {
    document.getElementById("back-link").href = "index.html"; 
}

async function loadAltTitles() {
    
    if (!movieId) {
        document.querySelector(".movie-header").innerHTML = "<h2 style='color:red;'>Error: No Movie ID provided in URL.</h2>";
        document.getElementById("alt-titles-body").innerHTML = "";
        return;
    }

    try {
        
        const res = await fetch(`${API_URL}/movies/${movieId}`);
        
        if (!res.ok) throw new Error("Network response was not ok");
        
        const movie = await res.json();
        
        renderPage(movie);

    } catch (err) {
        console.error("Fetch Error:", err);
        document.getElementById("movie-title").innerText = "Error loading movie data.";
        document.getElementById("alt-titles-body").innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">Connection failed. Is backend running?</td></tr>`;
    }
}

function renderPage(movie) {
    
    document.getElementById("movie-title").innerText = `Alternative Titles: ${movie.primary_title}`;

    const tbody = document.getElementById("alt-titles-body");
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


loadAltTitles();