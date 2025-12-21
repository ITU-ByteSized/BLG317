import { initNavbar } from "../components/navbar.js";
import { getQueryParam, goTo } from "../utils/router.js";
import { getUser } from "../utils/storage.js";
import { apiGetMovieById, apiGetMovieAwards, apiGetMovieEpisodes } from "../api/movies.api.js";
import { apiRequest } from "../api/request.js";

function safeImgSrc(u) {
    if (!u) return "";
    const s = String(u).trim();
    const low = s.toLowerCase();
    if (low.startsWith("javascript:")) return "";
    if (low.startsWith("data:") && !low.startsWith("data:image/")) return "";
    return s.replace(/["'\\\n\r]/g, "");
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const id = getQueryParam("id");
    if (!id) return;

    const titleEl = document.getElementById("movie-title");
    const posterEl = document.getElementById("movie-poster");
    const submetaEl = document.getElementById("movie-submeta");
    const genresEl = document.getElementById("movie-genres");
    const overviewEl = document.getElementById("movie-overview");
    const ratingsEl = document.getElementById("movie-ratings");
    const starsBox = document.getElementById("user-rating-stars");
    const hintEl = document.getElementById("user-rating-hint");

    const btnComments = document.getElementById("btn-comments");
    const btnCast = document.getElementById("btn-cast");
    const btnCrew = document.getElementById("btn-crew");
    const btnAlt = document.getElementById("btn-alt-titles");
    const btnEp = document.getElementById("btn-episodes");
    const btnAwards = document.getElementById("btn-awards");

    const sectionComments = document.getElementById("section-comments");
    const sectionCast = document.getElementById("section-cast");
    const sectionCrew = document.getElementById("section-crew");
    const sectionAlt = document.getElementById("section-alt");
    const sectionEp = document.getElementById("section-episodes");
    const sectionAwards = document.getElementById("section-awards");

    const castEl = document.getElementById("movie-cast");
    const crewEl = document.getElementById("movie-crew");
    const altListEl = document.getElementById("movie-alt-list");
    const altSearchInput = document.getElementById("alt-search-input");
    const epListEl = document.getElementById("movie-episodes-list");
    const seasonTabsEl = document.getElementById("season-tabs");
    const awardsListEl = document.getElementById("movie-awards-list");
    const commentsListEl = document.getElementById("comments-list");

    const commentInput = document.getElementById("comment-text");
    const btnSubmitComment = document.getElementById("btn-submit-comment");
    const btnSpoilerToggle = document.getElementById("btn-spoiler-toggle");
    const spoilerModal = document.getElementById("spoiler-modal");
    const btnSpoilerConfirm = document.getElementById("btn-spoiler-confirm");
    const btnSpoilerCancel = document.getElementById("btn-spoiler-cancel");
    const spoilerInput = document.getElementById("spoiler-input");

    if (overviewEl) overviewEl.innerHTML = "<span style='color:#888'>Loading details...</span>";

    let currentMovie = null;

    const allTabs = [btnComments, btnCast, btnCrew, btnAlt, btnEp, btnAwards];
    const allSections = [sectionComments, sectionCast, sectionCrew, sectionAlt, sectionEp, sectionAwards];

    const switchTab = (activeBtn, sectionToShow) => {
        allTabs.forEach(b => b && b.classList.remove("active"));
        if (activeBtn) activeBtn.classList.add("active");
        allSections.forEach(s => s && s.classList.add("hidden"));
        if (sectionToShow) sectionToShow.classList.remove("hidden");
    };

    try {
        const data = await apiGetMovieById(id);
        const movie = data.movie || data;
        currentMovie = movie;

        if (titleEl) titleEl.textContent = movie.primary_title || "Untitled";

        if (posterEl) {
            const src = safeImgSrc(movie.poster_url) || "https://via.placeholder.com/500x750?text=No+Poster";
            posterEl.src = src;
            posterEl.onerror = () => {
                posterEl.src = "https://via.placeholder.com/500x750?text=Image+Error";
            };
        }

        const heroSection = document.getElementById("movie-hero");
        if (heroSection && movie.poster_url) {
            const bg = safeImgSrc(movie.poster_url);
            if (bg) {
                heroSection.style.backgroundImage = `linear-gradient(to bottom, rgba(18,18,18,0.85), var(--bg-color)), url('${bg}')`;
            }
        }

        if (submetaEl) {
            const parts = [];
            parts.push(movie.start_year || "N/A");
            if (movie.runtime_minutes) parts.push(`${movie.runtime_minutes} min`);
            const adult = movie.is_adult ? "<span class='meta-tag'>18+</span>" : "";
            submetaEl.innerHTML = `${parts.join(" • ")} ${adult}`;
        }

        if (genresEl) {
            const genreList = movie.genres || [];
            genresEl.innerHTML = genreList.length > 0 ? genreList.map(g => `<span class="genre-tag">${escapeHtml(g)}</span>`).join("") : "";
        }

        if (overviewEl) overviewEl.textContent = movie.overview || movie.plot || "No overview available.";

        if (castEl) {
            castEl.innerHTML = "";
            const castList = data.cast || [];
            if (castList.length === 0) {
                castEl.innerHTML = "<p class='text-muted' style='text-align:center; width:100%; grid-column:1/-1;'>No cast information.</p>";
            } else {
                castList.forEach(person => castEl.appendChild(createPersonCard(person, "actor")));
            }
        }

        if (crewEl) {
            crewEl.innerHTML = "";
            const crewList = movie.crew || [];
            if (crewList.length === 0) {
                crewEl.innerHTML = "<p class='text-muted' style='text-align:center; width:100%; grid-column:1/-1;'>No crew information available.</p>";
            } else {
                crewList.forEach(person => crewEl.appendChild(createPersonCard(person, "crew")));
            }
        }

        if (altListEl && Array.isArray(movie.alt_titles)) {
            renderAltTitles(movie.alt_titles, altListEl);
            if (altSearchInput) {
                altSearchInput.addEventListener("input", (e) => {
                    const val = String(e.target.value || "").toLowerCase();
                    const filtered = movie.alt_titles.filter(item => {
                        const lang = String(item.language_name || "").toLowerCase();
                        const reg = String(item.region_name || "").toLowerCase();
                        const title = String(item.localized_title || "").toLowerCase();
                        return lang.includes(val) || reg.includes(val) || title.includes(val);
                    });
                    renderAltTitles(filtered, altListEl);
                });
            }
        }

        if (btnEp) {
            const type = String(movie.type || "").toLowerCase();
            const isSeries = type === "tvseries" || type === "tvminiseries";
            btnEp.style.display = isSeries ? "" : "none";
            if (!isSeries) btnEp.classList.add("hidden");
        }

        if (ratingsEl) {
            const avg = movie.average_rating;
            const votes = movie.num_votes;
            if (avg !== null && avg !== undefined) {
                ratingsEl.innerHTML = `
                    <div class="rating-display-big">
                        <span class="rating-star-icon">★</span>
                        <span class="rating-value">${escapeHtml(avg)}</span>
                        <span class="rating-max">/10</span>
                    </div>
                    <div class="rating-votes">${votes ? votes.toLocaleString() : 0} votes</div>
                `;
            } else {
                ratingsEl.innerHTML = "<p class='text-muted'>Not rated yet.</p>";
            }
        }

        await loadComments(id);

        if (starsBox) initUserRatingStars(starsBox, hintEl, id);

    } catch (err) {
        console.error("Movie load error:", err);
        if (titleEl) titleEl.textContent = "Content Not Found";
        if (overviewEl) overviewEl.textContent = "Could not load details.";
    }

    if (btnComments) btnComments.addEventListener("click", () => switchTab(btnComments, sectionComments));
    if (btnCast) btnCast.addEventListener("click", () => switchTab(btnCast, sectionCast));
    if (btnCrew) btnCrew.addEventListener("click", () => switchTab(btnCrew, sectionCrew));
    if (btnAlt) btnAlt.addEventListener("click", () => switchTab(btnAlt, sectionAlt));

    if (btnEp) {
        btnEp.addEventListener("click", async () => {
            if (!sectionEp || !epListEl) return;
            switchTab(btnEp, sectionEp);
            if (sectionEp.dataset.loaded === "true") return;

            epListEl.innerHTML = "<p style='color:#888'>Loading episodes...</p>";
            try {
                const episodes = await apiGetMovieEpisodes(id);
                renderEpisodesTab(episodes, epListEl, seasonTabsEl);
                sectionEp.dataset.loaded = "true";
            } catch (err) {
                epListEl.innerHTML = "<p style='color:red'>Failed to load episodes.</p>";
            }
        });
    }

    if (btnAwards) {
        btnAwards.addEventListener("click", async () => {
            if (!sectionAwards || !awardsListEl) return;
            switchTab(btnAwards, sectionAwards);
            if (sectionAwards.dataset.loaded === "true") return;

            awardsListEl.innerHTML = "<p style='color:#888'>Loading awards...</p>";
            try {
                const awards = await apiGetMovieAwards(id);
                renderMovieAwards(awards, awardsListEl);
                sectionAwards.dataset.loaded = "true";
            } catch (err) {
                awardsListEl.innerHTML = "<p style='color:red'>Failed to load awards.</p>";
            }
        });
    }

    async function loadComments(movieId) {
        if (!commentsListEl) return;
        commentsListEl.innerHTML = "<p style='color:#666'>Loading comments...</p>";
        try {
            const comments = await apiRequest(`/movies/${movieId}/comments`);
            renderComments(comments, commentsListEl);
        } catch (e) {
            commentsListEl.innerHTML = "<p>No comments yet.</p>";
        }
    }

    function renderComments(list, container) {
        container.innerHTML = "";
        if (!list || !list.length) {
            container.innerHTML = "<p style='color:#666; font-style:italic;'>Be the first to comment!</p>";
            return;
        }
        list.forEach(c => container.appendChild(createCommentItem(c)));
    }

    function createCommentItem(c) {
        const item = document.createElement("div");
        item.className = "comment-item";

        const avatarUrl = safeImgSrc(c.avatar_url) || "https://via.placeholder.com/48";
        const dateStr = new Date(c.created_at).toLocaleDateString();

        const likeCount = c.like_count || 0;
        const isLikedClass = c.is_liked ? "liked" : "";
        const likeText = c.is_liked ? "Liked" : "Like";

        let contentHtml = escapeHtml(c.body);
        contentHtml = contentHtml.replace(
            /\[SPOILER\](.*?)\[\/SPOILER\]/gs,
            `<div class="spoiler-wrapper">
                <div class="spoiler-cover">Spoiler content area. Click to reveal.</div>
                <div class="spoiler-content" style="display:none;">$1 <br><small style="color:#666; font-size:0.7em;">(Click to hide)</small></div>
            </div>`
        );

        const usernameSafe = escapeHtml(c.username || "User");

        item.innerHTML = `
            <div class="comment-avatar" style="background-image: url('${avatarUrl}')"></div>
            <div class="comment-body">
                <div class="comment-header">
                    <span class="comment-user">${usernameSafe}</span>
                    <span class="comment-date">${escapeHtml(dateStr)}</span>
                </div>
                <div class="comment-content">${contentHtml}</div>
                <div class="comment-footer">
                    <button class="btn-reply" data-id="${c.comment_id}">↩ Answer</button>
                    <button class="btn-like ${isLikedClass}" data-id="${c.comment_id}">
                        👍 <span class="like-label">${likeText}</span> <span class="like-count">${likeCount}</span>
                    </button>
                </div>
                <div class="replies-container" id="replies-${c.comment_id}"></div>
                <div class="reply-input-container" id="reply-input-${c.comment_id}" style="display:none; margin-top:10px;">
                    <textarea class="reply-textarea" style="width:100%; background:#111; color:#fff; border:1px solid #333; min-height:60px;"></textarea>
                    <div style="margin-top:5px; display:flex; gap:10px;">
                        <button class="btn-submit sub-reply-btn" style="font-size:0.8rem;">Send</button>
                        <button class="btn-like cancel-reply-btn" style="font-size:0.8rem;">Cancel</button>
                    </div>
                </div>
            </div>
        `;

        const wrappers = item.querySelectorAll(".spoiler-wrapper");
        wrappers.forEach(wrap => {
            const cover = wrap.querySelector(".spoiler-cover");
            const content = wrap.querySelector(".spoiler-content");
            if (!cover || !content) return;

            cover.addEventListener("click", () => {
                cover.style.display = "none";
                content.style.display = "block";
            });

            content.addEventListener("click", () => {
                content.style.display = "none";
                cover.style.display = "block";
            });
        });

        const likeBtn = item.querySelector(".btn-like");
        if (likeBtn) {
            likeBtn.addEventListener("click", async () => {
                const user = getUser();
                if (!user) {
                    alert("Please login to like comments.");
                    return;
                }

                const label = likeBtn.querySelector(".like-label");
                const countSpan = likeBtn.querySelector(".like-count");
                const prevLiked = likeBtn.classList.contains("liked");
                const prevCount = parseInt(countSpan?.textContent || "0", 10) || 0;

                if (prevLiked) {
                    likeBtn.classList.remove("liked");
                    if (label) label.textContent = "Like";
                    if (countSpan) countSpan.textContent = String(Math.max(0, prevCount - 1));
                } else {
                    likeBtn.classList.add("liked");
                    if (label) label.textContent = "Liked";
                    if (countSpan) countSpan.textContent = String(prevCount + 1);
                }

                try {
                    const res = await apiRequest(`/comments/${c.comment_id}/like`, {
                        method: "POST",
                        body: JSON.stringify({ user_id: user.user_id })
                    });
                    if (res && res.success && countSpan) {
                        countSpan.textContent = String(res.new_count);
                    } else {
                        throw new Error("like_failed");
                    }
                } catch (err) {
                    if (prevLiked) likeBtn.classList.add("liked");
                    else likeBtn.classList.remove("liked");
                    if (label) label.textContent = prevLiked ? "Liked" : "Like";
                    if (countSpan) countSpan.textContent = String(prevCount);
                }
            });
        }

        const replyBtn = item.querySelector(".btn-reply");
        const replyBox = item.querySelector(`#reply-input-${c.comment_id}`);
        const subSendBtn = item.querySelector(".sub-reply-btn");
        const cancelBtn = item.querySelector(".cancel-reply-btn");
        const subText = item.querySelector(".reply-textarea");

        if (replyBtn && replyBox) replyBtn.addEventListener("click", () => { replyBox.style.display = "block"; });
        if (cancelBtn && replyBox) cancelBtn.addEventListener("click", () => { replyBox.style.display = "none"; });

        if (subSendBtn) {
            subSendBtn.addEventListener("click", () => {
                submitComment(subText ? subText.value : "", c.comment_id).then(() => {
                    if (replyBox) replyBox.style.display = "none";
                    if (subText) subText.value = "";
                    loadComments(id);
                });
            });
        }

        const repliesContainer = item.querySelector(`#replies-${c.comment_id}`);
        if (repliesContainer && c.replies && c.replies.length > 0) {
            c.replies.forEach(r => repliesContainer.appendChild(createCommentItem(r)));
        }

        return item;
    }

    async function submitComment(text, parentId = null) {
        if (!String(text || "").trim()) return;
        const user = getUser();
        if (!user) {
            alert("Please login first.");
            return;
        }
        try {
            await apiRequest(`/movies/${id}/comments`, {
                method: "POST",
                body: JSON.stringify({
                    user_id: user.user_id,
                    body: text,
                    parent_id: parentId
                })
            });
            if (!parentId) {
                if (commentInput) commentInput.value = "";
                loadComments(id);
            }
        } catch (e) {
            alert("Failed to post comment");
        }
    }

    if (btnSubmitComment) btnSubmitComment.addEventListener("click", () => submitComment(commentInput ? commentInput.value : ""));

    if (btnSpoilerToggle && spoilerModal && spoilerInput) {
        btnSpoilerToggle.addEventListener("click", () => {
            spoilerModal.classList.remove("hidden");
            spoilerInput.value = "";
            spoilerInput.focus();
        });
    }

    if (btnSpoilerCancel && spoilerModal) btnSpoilerCancel.addEventListener("click", () => spoilerModal.classList.add("hidden"));

    if (btnSpoilerConfirm && spoilerModal && spoilerInput && commentInput) {
        btnSpoilerConfirm.addEventListener("click", () => {
            const secret = spoilerInput.value.trim();
            if (secret) {
                const tag = `[SPOILER]${secret}[/SPOILER]`;
                commentInput.value += (commentInput.value ? "\n" : "") + tag;
            }
            spoilerModal.classList.add("hidden");
        });
    }
});

function createPersonCard(person, type) {
    const div = document.createElement("div");
    div.className = "person-card";

    const nameRaw = person.name || person.primary_name || "Unknown";
    const name = String(nameRaw);
    const initials = name.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase();

    let subText = "";
    if (type === "actor") {
        subText = person.characters || "Actor";
    } else {
        subText = person.job || person.category || "Crew";
    }

    div.innerHTML = `
        <div class="person-avatar-small">${escapeHtml(initials)}</div>
        <div class="person-info">
            <div class="person-name">${escapeHtml(name)}</div>
            <div class="person-role">${escapeHtml(subText)}</div>
        </div>
    `;

    div.addEventListener("click", () => {
        if (person.person_id) {
            window.location.href = `person.html?id=${encodeURIComponent(person.person_id)}`;
        }
    });

    return div;
}

function renderAltTitles(list, container) {
    container.innerHTML = "";
    if (!list || list.length === 0) {
        container.innerHTML = "<tr><td colspan='3' style='padding:15px; text-align:center;'>No alternative titles found.</td></tr>";
        return;
    }

    list.forEach(item => {
        const row = document.createElement("tr");
        row.style.borderBottom = "1px solid #333";
        const region = item.region_name || "-";
        const lang = item.language_name || "-";
        const title = item.localized_title || "";
        const isOriginal = item.is_original_title ? " (Original)" : "";

        row.innerHTML = `
            <td style="padding: 10px;">${escapeHtml(region)}</td>
            <td style="padding: 10px;">${escapeHtml(lang)}</td>
            <td style="padding: 10px; color: #fff;">${escapeHtml(title)}<span style="color:#666; font-size:0.8rem">${escapeHtml(isOriginal)}</span></td>
        `;
        container.appendChild(row);
    });
}

function renderEpisodesTab(episodes, listContainer, tabsContainer) {
    listContainer.innerHTML = "";
    if (tabsContainer) tabsContainer.innerHTML = "";

    if (!episodes || episodes.length === 0) {
        listContainer.innerHTML = "<p>No episodes found.</p>";
        return;
    }

    const seasons = {};
    episodes.forEach(ep => {
        const sNum = ep.season_number || 0;
        if (!seasons[sNum]) seasons[sNum] = [];
        seasons[sNum].push(ep);
    });

    const sortedSeasons = Object.keys(seasons).sort((a, b) => Number(a) - Number(b));

    if (!tabsContainer) {
        const first = sortedSeasons[0];
        renderEpisodeListSimple(seasons[first], listContainer);
        return;
    }

    sortedSeasons.forEach((sNum, index) => {
        const btn = document.createElement("button");
        btn.className = "season-tab-btn";
        btn.textContent = sNum === "0" ? "Extras" : `Season ${sNum}`;
        btn.style.padding = "8px 16px";
        btn.style.background = "transparent";
        btn.style.border = "1px solid #444";
        btn.style.color = "#ccc";
        btn.style.borderRadius = "20px";
        btn.style.cursor = "pointer";

        if (index === 0) {
            btn.style.background = "var(--accent-color)";
            btn.style.color = "#000";
            btn.style.fontWeight = "bold";
            renderEpisodeListSimple(seasons[sNum], listContainer);
        }

        btn.addEventListener("click", () => {
            Array.from(tabsContainer.children).forEach(b => {
                b.style.background = "transparent";
                b.style.color = "#ccc";
                b.style.fontWeight = "normal";
            });
            btn.style.background = "var(--accent-color)";
            btn.style.color = "#000";
            btn.style.fontWeight = "bold";
            renderEpisodeListSimple(seasons[sNum], listContainer);
        });

        tabsContainer.appendChild(btn);
    });
}

function renderEpisodeListSimple(list, container) {
    container.innerHTML = "";
    if (!list) return;

    list.forEach(ep => {
        const div = document.createElement("div");
        div.style.padding = "12px";
        div.style.borderBottom = "1px solid #333";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.gap = "15px";
        div.style.cursor = "pointer";
        div.style.transition = "background 0.2s";

        div.onmouseover = () => div.style.background = "#252525";
        div.onmouseout = () => div.style.background = "transparent";

        const epNum = escapeHtml(ep.episode_number);
        const epTitle = escapeHtml(ep.primary_title || "Episode");
        const epRating = ep.average_rating !== null && ep.average_rating !== undefined ? escapeHtml(ep.average_rating) : "";

        const num = `<span style="color:var(--accent-color); font-weight:bold; min-width:40px;">E${epNum}</span>`;
        const title = `<span style="color:#fff; font-weight:600;">${epTitle}</span>`;
        const rating = epRating ? `<span style="color:#888; font-size:0.9rem;">★ ${epRating}</span>` : "";

        div.innerHTML = `${num} <div style="display:flex; flex-direction:column;">${title} ${rating}</div>`;

        div.addEventListener("click", () => {
            if (ep.production_id) goTo(`movie.html?id=${encodeURIComponent(ep.production_id)}`);
        });

        container.appendChild(div);
    });
}

function renderMovieAwards(awards, container) {
    container.innerHTML = "";
    if (!awards || awards.length === 0) {
        container.innerHTML = "<p class='text-muted' style='grid-column:1/-1;'>No awards found for this title.</p>";
        return;
    }

    awards.forEach(award => {
        const div = document.createElement("div");
        div.className = "award-card";
        div.style.cursor = "default";

        const year = escapeHtml(award.ceremony_year);
        const cat = escapeHtml(award.category_name);
        const status = award.winner ? "🏆 WINNER" : "Nominee";
        const detail = award.detail ? `<div class="award-detail" style="color:#888; font-size:0.9rem;">${escapeHtml(award.detail)}</div>` : "";

        div.innerHTML = `
            <div class="award-info" style="width:100%">
                <div class="award-category" style="color:var(--accent-color); font-weight:bold;">${year} ${cat}</div>
                <div class="award-movie-title" style="margin:5px 0; color:#fff;">${status}</div>
                ${detail}
            </div>
        `;
        container.appendChild(div);
    });
}

function initUserRatingStars(container, hintEl, movieId) {
    container.innerHTML = "";
    for (let i = 1; i <= 10; i++) {
        const span = document.createElement("span");
        span.className = "rating-star-ui";
        span.innerHTML = "★";

        span.addEventListener("mouseenter", () => {
            updateStarsUI(container, i);
            if (hintEl) hintEl.textContent = `Rate: ${i}/10`;
        });

        span.addEventListener("mouseleave", () => {
            updateStarsUI(container, 0);
            if (hintEl) hintEl.textContent = "";
        });

        span.addEventListener("click", async () => {
            const user = getUser();
            if (!user) {
                alert("Please login to rate movies.");
                return;
            }

            try {
                const res = await apiRequest(`/movies/${movieId}/rate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: user.user_id, rating: i })
                });

                if (res && res.success === false) throw new Error(res.message || "Rate failed");
                alert(`You rated this movie ${i}/10!`);
            } catch (err) {
                console.error("RATE_FAIL:", err);
                alert(err?.message || "Error saving rating.");
            }
            });
        container.appendChild(span);
    }
}

function updateStarsUI(container, value) {
    const stars = Array.from(container.querySelectorAll(".rating-star-ui"));
    stars.forEach((star, idx) => {
        if (idx < value) star.classList.add("active");
        else star.classList.remove("active");
    });
}