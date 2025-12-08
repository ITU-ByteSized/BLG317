import { apiRequest } from "../api/request.js";
import { goTo } from "../utils/router.js";

function debounce(fn, wait = 250) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function initSearchBar(options = {}) {
  const {
    wrapperId = "search-bar-wrapper",
    placeholder = "Search",
    onSearch,
  } = options;

  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  wrapper.classList.add("searchbar-wrapper");

  wrapper.innerHTML = `
        <div class="searchbar-container">
            <input 
                type="text" 
                id="search-input" 
                class="searchbar-input"
                placeholder="${placeholder}"
                autocomplete="off"
            />

            <button class="searchbar-icon-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" class="searchbar-icon">
                    <path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 
                    5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 
                    5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41zM10 
                    16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 
                    6-2.69 6-6 6z"/>
                </svg>
            </button>

            <div class="searchbar-underline"></div>
            <div class="search-dropdown" id="search-dropdown" hidden></div>
        </div>
    `;

  const input = wrapper.querySelector("#search-input");
  const iconBtn = wrapper.querySelector(".searchbar-icon-btn");
  const dropdown = wrapper.querySelector("#search-dropdown");

  const openDropdown = () => {
    dropdown.hidden = false;
    wrapper.classList.add("open");
  };
  const closeDropdown = () => {
    dropdown.hidden = true;
    wrapper.classList.remove("open");
  };

  const renderResults = (movies = [], people = [], q = "") => {
    if (!movies.length && !people.length) {
      dropdown.innerHTML = `<div class="search-empty">No results for "${q}"</div>`;
      openDropdown();
      return;
    }

    const makeMovieItem = (m) => `
            <div class="search-item movie-item" data-id="${m.production_id}">
                <img class="search-thumb" src="${m.poster_url || ""}" alt="${(
      m.primary_title || ""
    ).replace(/"/g, "")}">
                <div class="search-body">
                    <div class="search-title">${
                      m.primary_title || "Untitled"
                    }</div>
                    <div class="search-sub">${m.start_year || ""}</div>
                </div>
            </div>`;

    const makePersonItem = (p) => `
            <div class="search-item person-item" data-id="${p.person_id}">
                <div class="search-avatar">${(p.primary_name || "").slice(
                  0,
                  1
                )}</div>
                <div class="search-body">
                    <div class="search-title">${
                      p.primary_name || "Unknown"
                    }</div>
                    <div class="search-sub">${p.primary_profession || ""}</div>
                </div>
            </div>`;

    let html = "";
    if (movies.length) {
      html += `<div class="search-section"><div class="search-section-title">Filmler</div>`;
      html += movies.map(makeMovieItem).join("");
      html += `</div>`;
    }

    if (people.length) {
      html += `<div class="search-section"><div class="search-section-title">Sanatçılar</div>`;
      html += people.map(makePersonItem).join("");
      html += `</div>`;
    }

    dropdown.innerHTML = html;
    openDropdown();

    // attach click handlers
    dropdown.querySelectorAll(".movie-item").forEach((el) => {
      el.addEventListener("mousedown", (e) => {
        const id = el.dataset.id;
        const prefix = window.location.pathname.includes("/pages/")
          ? ""
          : "pages/";
        window.location.href = `${prefix}movie.html?id=${encodeURIComponent(
          id
        )}`;
      });
    });

    dropdown.querySelectorAll(".person-item").forEach((el) => {
      el.addEventListener("mousedown", (e) => {
        const id = el.dataset.id;
        const prefix = window.location.pathname.includes("/pages/")
          ? ""
          : "pages/";
        window.location.href = `${prefix}person.html?id=${encodeURIComponent(
          id
        )}`;
      });
    });
  };

  const doSearch = async (q) => {
    if (!q || q.trim().length < 2) {
      closeDropdown();
      return;
    }
    try {
      const [moviesResp, peopleResp] = await Promise.all([
        apiRequest(`/movies?search=${encodeURIComponent(q)}&limit=5`).catch(
          () => ({ results: [] })
        ),
        apiRequest(`/people?search=${encodeURIComponent(q)}`).catch(() => []),
      ]);

      const movies = moviesResp && moviesResp.results ? moviesResp.results : [];
      const people = Array.isArray(peopleResp)
        ? peopleResp
        : peopleResp.results || [];
      renderResults(movies, people.slice(0, 5), q);
    } catch (err) {
      dropdown.innerHTML = `<div class="search-error">Error</div>`;
      openDropdown();
    }
  };

  const debounced = debounce(doSearch, 300);

  input.addEventListener("input", (e) => {
    const v = e.target.value;
    debounced(v);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDropdown();
    }
    if (e.key === "Enter") {
      if (onSearch) onSearch(input.value);
      closeDropdown();
    }
  });

  iconBtn.addEventListener("click", () => {
    if (onSearch) onSearch(input.value);
  });

  // close when clicking outside
  document.addEventListener("mousedown", (ev) => {
    if (!wrapper.contains(ev.target)) closeDropdown();
  });
}
