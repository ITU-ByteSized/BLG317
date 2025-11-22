export function createPagination({
    containerId,
    currentPage,
    totalPages,
    onPageChange
}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    if (totalPages <= 1) return;

    const makeBtn = (label, page, disabled = false, active = false) => {
        const btn = document.createElement("button");
        btn.textContent = label;
        btn.className = "pagination-btn";

        if (active) btn.classList.add("active");
        if (disabled) btn.disabled = true;

        btn.addEventListener("click", () => {
            if (!disabled && typeof onPageChange === "function") {
                onPageChange(page);
            }
        });

        return btn;
    };

    container.appendChild(
        makeBtn("←", currentPage - 1, currentPage === 1)
    );

    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (currentPage <= 2) end = Math.min(5, totalPages);
    if (currentPage >= totalPages - 1) start = Math.max(1, totalPages - 4);

    for (let page = start; page <= end; page++) {
        container.appendChild(
            makeBtn(page, page, false, page === currentPage)
        );
    }

    container.appendChild(
        makeBtn("→", currentPage + 1, currentPage === totalPages)
    );
}