export function initSearchBar(options = {}) {
    const {
        wrapperId = "search-bar-wrapper",
        placeholder = "Search",
        onSearch
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
            />

            <button class="searchbar-icon-btn">
                <svg viewBox="0 0 24 24" class="searchbar-icon">
                    <path d="M21.71 20.29l-5.01-5.01C17.54 13.68 18 11.91 18 10c0-4.41-3.59-8-8-8S2 
                    5.59 2 10s3.59 8 8 8c1.91 0 3.68-.46 5.28-1.3l5.01 
                    5.01c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41zM10 
                    16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 
                    6-2.69 6-6 6z"/>
                </svg>
            </button>

            <div class="searchbar-underline"></div>
        </div>
    `;

    const input = wrapper.querySelector("#search-input");
    const iconBtn = wrapper.querySelector(".searchbar-icon-btn");

    const triggerSearch = () => onSearch(input.value);

    input.addEventListener("keyup", (e) => {
        if (e.key === "Enter") triggerSearch();
    });

    iconBtn.addEventListener("click", triggerSearch);
}
