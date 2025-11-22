import { initSearchBar } from "../components/searchbar.js";
import { initAuthButtons } from "../components/authButtons.js";
import { goTo } from "../utils/router.js";

export function initNavbar(options = {}) {
    const header = document.querySelector("header");
    if (!header) return;

    header.innerHTML = `
        <div class="navbar-inner">
            <div class="navbar-left logo-section">
                <span id="navbar-logo" class="logo-text">ByteSized<span>DB</span></span>
            </div>
            <div class="navbar-center">
                <div id="search-bar-wrapper"></div>
            </div>
            <div class="navbar-right auth-btns"></div>
        </div>
    `;

    const logo = document.getElementById("navbar-logo");
    if (logo) {
        logo.style.cursor = "pointer";
        logo.addEventListener("click", () => goTo("index.html"));
    }

    const defaultSearchBehavior = (query) => {
        goTo(`index.html?search=${encodeURIComponent(query || "")}`);
    };

    initSearchBar({
        wrapperId: "search-bar-wrapper",
        placeholder: "Search titles",
        onSearch: options.onSearch || defaultSearchBehavior
    });

    initAuthButtons();
}