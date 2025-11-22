export function initRatingStars({
    wrapperId,
    initialValue = 0,
    maxStars = 10,
    onRate = null,
    readOnly = false
} = {}) {
    const wrapper = document.getElementById(wrapperId);
    if (!wrapper) return;

    wrapper.classList.add("rating-star-wrapper");
    wrapper.innerHTML = "";

    let current = initialValue;

    for (let i = 1; i <= maxStars; i++) {
        const star = document.createElement("span");
        star.className = "rating-star";
        star.dataset.value = i;
        star.innerHTML = "★";

        if (!readOnly) {
            star.addEventListener("mouseenter", () => highlight(i));
            star.addEventListener("mouseleave", () => highlight(current));

            star.addEventListener("click", () => {
                current = i;
                highlight(current);
                if (typeof onRate === "function") onRate(current);
            });
        }

        wrapper.appendChild(star);
    }

    highlight(current);

    function highlight(value) {
        const stars = wrapper.querySelectorAll(".rating-star");
        stars.forEach(s => {
            const v = Number(s.dataset.value);
            if (v <= value) s.classList.add("active");
            else s.classList.remove("active");
        });
    }
}