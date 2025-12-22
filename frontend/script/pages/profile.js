import { initNavbar } from "../components/navbar.js";
import { getToken, getUser } from "../utils/storage.js";
import { API_URL } from "../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const token = getToken();
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    const els = {
        username: document.getElementById("profile-username"),
        initial: document.getElementById("profile-initial"),
        bio: document.getElementById("profile-bio"),
        location: document.getElementById("profile-location"),
        btnAdmin: document.getElementById("btn-admin-panel"),
        avatar: document.querySelector(".profile-avatar-large"),
        statCount: document.getElementById("stat-count"),
        statYear: document.getElementById("stat-year"),
        detailsContainer: document.querySelector(".profile-details"),
        movieSection: document.querySelector(".movie-section"),
        ratingsContainer: document.getElementById("profile-ratings")
    };

    if (els.ratingsContainer) {
        const prevEl = els.ratingsContainer.previousElementSibling;
        if (prevEl && /^H[1-6]$/.test(prevEl.tagName)) {
            prevEl.style.display = 'none';
        }

        els.ratingsContainer.innerHTML = `
            <div class="custom-profile-tabs">
                <div class="main-tabs">
                    <button class="p-tab-btn active" data-main="watching">Watching</button>
                    <button class="p-tab-btn" data-main="plan_to_watch">Plan to Watch</button>
                    <button class="p-tab-btn" data-main="ratings">Ratings</button>
                    <button class="p-tab-btn" data-main="comments">Comments</button>
                </div>

                <div class="sub-tabs-container" id="sub-tabs-wrapper">
                    <div class="sub-tabs active" id="sub-watching">
                        <button class="p-sub-btn active" data-sub="watching">Continue</button>
                        <button class="p-sub-btn" data-sub="completed">Completed</button>
                        <button class="p-sub-btn" data-sub="dropped">Dropped</button>
                    </div>
                </div>

                <div id="profile-dynamic-content" class="content-grid-area">
                    <p style="color:#666; padding:20px;">Loading...</p>
                </div>
            </div>
        `;
    }

    let profileData = null;
    try {
        const localUser = getUser();
        let query = "";
        if(localUser && localUser.email) {
            query = `?email=${encodeURIComponent(localUser.email)}&current_user=${encodeURIComponent(localUser.email)}`;
        }
        
        const resMe = await fetch(`${API_URL}/profile/me${query}`, { headers: { "Authorization": `Bearer ${token}` } });
        const user = await resMe.json();

        if (user && !user.error) {
            renderHeader(user, els);

            if (user.is_private) {
                document.getElementById("profile-dynamic-content").innerHTML = `<p class="error-text">${user.message || "Private profile"}</p>`;
                return; 
            }

            const resDetails = await fetch(`${API_URL}/profile/details${query}`, { headers: { "Authorization": `Bearer ${token}` } });
            profileData = await resDetails.json();

            if (profileData) {
                renderContent("watching", profileData.watching, true); 
            }
        }
    } catch (e) {
        console.error("Profile load error", e);
        if(document.getElementById("profile-dynamic-content"))
            document.getElementById("profile-dynamic-content").innerHTML = `<p class="error-text">Failed to load profile.</p>`;
    }

    const mainBtns = document.querySelectorAll(".p-tab-btn");
    const subBtns = document.querySelectorAll(".p-sub-btn");
    const subWrapper = document.getElementById("sub-tabs-wrapper");
    
    mainBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            mainBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const mainKey = btn.dataset.main;

            if (mainKey === "watching") {
                subWrapper.style.display = "block";
                document.querySelectorAll(".p-sub-btn").forEach(b => b.classList.remove("active"));
                document.querySelector('[data-sub="watching"]').classList.add("active");
                
                if (profileData) renderContent("watching", profileData.watching, true);

            } else {
                subWrapper.style.display = "none";
                
                if (profileData) {
                    if (mainKey === "comments") {
                        renderComments(profileData.comments);
                    } else if (mainKey === "ratings") {
                        renderContent("ratings", profileData.ratings, false);
                    } else {
                        renderContent(mainKey, profileData[mainKey], true);
                    }
                }
            }
        });
    });

    subBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            subBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const subKey = btn.dataset.sub;
            
            if (profileData) {
                renderContent(subKey, profileData[subKey], subKey === 'watching');
            }
        });
    });
});

function renderContent(type, items, showActions) {
    const container = document.getElementById("profile-dynamic-content");
    if (!container) return;
    container.innerHTML = "";
    container.className = "content-grid-area";

    if (!items || items.length === 0) {
        container.innerHTML = `<p class="empty-msg">No items found in this list.</p>`;
        container.style.display = "block";
        return;
    }
    
    container.style.display = "grid";

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "p-movie-card";
        
        let buttonsHtml = "";
        if (showActions && type === 'watching') {
            buttonsHtml = `
                <div class="card-overlay">
                    <button class="card-action-btn complete-btn" onclick="window.updateStatus('${item.production_id}', 'completed')" title="Mark as Completed">✓</button>
                    <button class="card-action-btn drop-btn" onclick="window.updateStatus('${item.production_id}', 'dropped')" title="Drop">✕</button>
                </div>
            `;
        }

        let ratingBadge = "";
        if (type === 'ratings' && item.average_rating) {
            ratingBadge = `<div class="p-rating-badge">★ ${item.average_rating}</div>`;
        }

        div.innerHTML = `
            <div class="p-poster-wrapper">
                <img src="${item.poster_url || '../assets/poster_placeholder.png'}" alt="${item.primary_title}" loading="lazy">
                ${ratingBadge}
                ${buttonsHtml}
            </div>
            <div class="p-card-info">
                <h4>${item.primary_title}</h4>
                <span>${item.start_year || ''}</span>
            </div>
            <a href="movie.html?id=${item.production_id || item.rating_id}" class="p-card-link"></a>
        `;
        container.appendChild(div);
    });
}

function renderComments(items) {
    const container = document.getElementById("profile-dynamic-content");
    if (!container) return;
    container.innerHTML = "";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "15px";

    if (!items || items.length === 0) {
        container.innerHTML = "<p class='empty-msg'>No comments yet.</p>";
        return;
    }

    items.forEach(c => {
        const div = document.createElement("div");
        div.className = "p-comment-row";
        div.innerHTML = `
            <div class="p-comment-header">
                <strong><a href="movie.html?id=${c.production_id}">${c.primary_title}</a></strong>
                <small>${new Date(c.created_at).toLocaleDateString()}</small>
            </div>
            <p>${c.content}</p>
        `;
        container.appendChild(div);
    });
}

function renderHeader(user, els) {
    if (els.username) els.username.textContent = user.username || "User";
    if (els.avatar) {
        if (user.avatar_url) {
            els.avatar.style.backgroundImage = `url('${user.avatar_url}?t=${new Date().getTime()}')`;
            els.avatar.style.backgroundSize = "cover";
            els.avatar.style.backgroundPosition = "center";
            els.avatar.innerHTML = "";
        } else {
            els.avatar.style.backgroundImage = "none";
            if (els.initial && user.username) els.initial.textContent = user.username.charAt(0).toUpperCase();
        }
    }
    if (els.bio) els.bio.textContent = user.bio || "No biography.";
    if (els.location) els.location.textContent = user.location ? `📍 ${user.location}` : "";
    if (els.statYear && user.member_since) els.statYear.textContent = new Date(user.member_since).getFullYear();
    if (els.statCount && user.stats) els.statCount.textContent = user.stats.total_ratings || 0;
    if (user.urole === 'admin' && els.btnAdmin) els.btnAdmin.classList.remove('hidden');
}

window.updateStatus = async (prodId, status) => {
    if(!confirm(`Move to ${status}?`)) return;
    try {
        const res = await fetch(`${API_URL}/profile/list/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${getToken()}` },
            body: JSON.stringify({ email: getUser().email, production_id: prodId, status: status })
        });
        if (res.ok) window.location.reload();
    } catch (e) { console.error(e); }
};