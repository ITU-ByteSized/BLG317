export function createPersonKnownForCard(item) {
  const root = document.createElement("div");
  root.className = "person-known-card";

  const imgWrap = document.createElement("div");
  imgWrap.className = "person-card-image";

  const img = document.createElement("img");
  img.alt = item.primary_title || "";
  img.src = item.poster_url || "../style/components/default_poster.png";
  img.loading = "lazy";
  imgWrap.appendChild(img);

  const meta = document.createElement("div");
  meta.className = "person-card-meta";

  const title = document.createElement("div");
  title.className = "person-card-title";
  title.textContent = item.primary_title || "Untitled";

  const year = document.createElement("div");
  year.className = "person-card-year";
  if (item.start_year) year.textContent = item.start_year;

  meta.appendChild(title);
  meta.appendChild(year);

  root.appendChild(imgWrap);
  root.appendChild(meta);

  root.addEventListener("click", () => {
    if (item.production_id) {
      const prefix = window.location.pathname.includes("/pages/")
        ? ""
        : "pages/";
      window.location.href = `${prefix}movie.html?id=${encodeURIComponent(
        item.production_id
      )}`;
    }
  });

  return root;
}
