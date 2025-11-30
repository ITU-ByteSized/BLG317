import { initNavbar } from "../components/navbar.js";
import { getQueryParam } from "../utils/router.js";
import { fetchPersonDetails } from "../api/people.api.js";
import { createPersonKnownForCard } from "../components/personCard.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const id = getQueryParam("id");
    if (!id) return;

    const initialsEl = document.getElementById("person-initials");
    const nameEl = document.getElementById("person-name");
    const yearsEl = document.getElementById("person-years");
    const profsEl = document.getElementById("person-professions");
    const knownForContainer = document.getElementById("person-knownfor");
    const filmographyContainer = document.getElementById("person-filmography");

    if (knownForContainer) knownForContainer.textContent = "Loading...";

    try {
        const data = await fetchPersonDetails(id);
        const person = data.person || data;

        if (nameEl && person.name) nameEl.textContent = person.name;

        if (initialsEl && person.name) {
            const parts = person.name.trim().split(" ");
            const initials = parts.slice(0, 2).map(p => p[0]).join("").toUpperCase();
            initialsEl.textContent = initials;
        }

        if (yearsEl) {
            const birth = person.birth_year || "";
            const death = person.death_year || "";
            if (birth || death) {
                yearsEl.textContent = death ? `${birth} - ${death}` : `${birth} - `;
            } else {
                yearsEl.textContent = "";
            }
        }

        if (profsEl && person.professions && person.professions.length) {
            profsEl.textContent = person.professions.join(" • ");
        }

        if (knownForContainer) {
            knownForContainer.innerHTML = "";
            const list = data.known_for || data.knownFor || [];
            if (!list.length) {
                knownForContainer.textContent = "No known titles found.";
            } else {
                list.forEach((item) => {
                    const card = createPersonKnownForCard(item);
                    knownForContainer.appendChild(card);
                });
            }
        }

        if (filmographyContainer) {
            filmographyContainer.innerHTML = "";
            const credits = data.filmography || [];
            if (!credits.length) {
                filmographyContainer.textContent = "No filmography found.";
            } else {
                credits.forEach((credit) => {
                    const row = document.createElement("div");
                    row.className = "filmography-row";
                    const year = credit.year || "";
                    const title = credit.primary_title || "";
                    const job = credit.job || credit.category || "";
                    row.textContent = year ? `${year} • ${title}` : title;
                    if (job) row.textContent += ` (${job})`;
                    row.addEventListener("click", () => {
                        if (credit.production_id) {
                            window.location.href = `movie.html?id=${encodeURIComponent(credit.production_id)}`;
                        }
                    });
                    filmographyContainer.appendChild(row);
                });
            }
        }
    } catch (err) {
        if (knownForContainer) {
            knownForContainer.textContent = err.message || "Person details could not be loaded.";
        }
    }
});
