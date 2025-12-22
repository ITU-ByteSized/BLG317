import { initNavbar } from "../components/navbar.js";
import { getToken, getUser } from "../utils/storage.js";
import { API_URL } from "../config.js";
import { 
    apiGetUserRatings,
    apiGetUserComments
} from "../api/profile.api.js";

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
        ratingsContainer: document.getElementById("profile-ratings"),
        dynamicContent: document.getElementById("profile-dynamic-content")
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
        els.dynamicContent = document.getElementById("profile-dynamic-content");
    }

    let profileData = null;
    let currentUserEmail = "";
    
    try {
        const localUser = getUser();
        if(localUser && localUser.email) {
            currentUserEmail = localUser.email;
            const query = `?email=${encodeURIComponent(currentUserEmail)}&current_user=${encodeURIComponent(currentUserEmail)}`;
            
            const resMe = await fetch(`${API_URL}/profile/me${query}`, { headers: { "Authorization": `Bearer ${token}` } });
            const user = await resMe.json();

            if (user && !user.error) {
                renderHeader(user, els);

                if (user.is_private) {
                    els.dynamicContent.innerHTML = `<p class="error-text">${user.message || "Private profile"}</p>`;
                    return; 
                }

                const resDetails = await fetch(`${API_URL}/profile/details${query}`, { headers: { "Authorization": `Bearer ${token}` } });
                profileData = await resDetails.json();

                if (profileData && profileData.watching) {
                    renderMovieList(profileData.watching, true); 
                } else {
                     els.dynamicContent.innerHTML = `<p class="empty-msg">List is empty.</p>`;
                }
            }
        }
    } catch (e) {
        console.error("Profile load error", e);
        if(els.dynamicContent)
            els.dynamicContent.innerHTML = `<p class="error-text">Failed to load profile.</p>`;
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
                
                if (profileData) renderMovieList(profileData.watching, true);

            } else if (mainKey === "plan_to_watch") {
                subWrapper.style.display = "none";
                if (profileData) renderMovieList(profileData.plan_to_watch, true);

            } else if (mainKey === "ratings") {
                subWrapper.style.display = "none";
                renderRatings(currentUserEmail);

            } else if (mainKey === "comments") {
                subWrapper.style.display = "none";
                renderComments(currentUserEmail);
            }
        });
    });

    subBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            subBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const subKey = btn.dataset.sub;
            
            if (profileData && profileData[subKey]) {
                renderMovieList(profileData[subKey], subKey === 'watching');
            }
        });
    });
});

function renderMovieList(items, showActions) {
    const container = document.getElementById("profile-dynamic-content");
    if (!container) return;
    
    container.innerHTML = "";
    container.style.display = "grid";
    container.style.flexDirection = "unset";
    container.style.gap = "20px";
    container.className = "content-grid-area";

    if (!items || items.length === 0) {
        container.style.display = "block";
        container.innerHTML = `<p class="empty-msg">No items found in this list.</p>`;
        return;
    }

    items.forEach(item => {
        const div = document.createElement("div");
        div.className = "p-movie-card";
        
        let buttonsHtml = "";
        if (showActions) {
            buttonsHtml = `
                <div class="card-overlay">
                    <button class="card-action-btn complete-btn" onclick="window.updateStatus('${item.production_id}', 'completed')" title="Mark as Completed">✓</button>
                    <button class="card-action-btn drop-btn" onclick="window.updateStatus('${item.production_id}', 'dropped')" title="Drop">✕</button>
                </div>
            `;
        }

        div.innerHTML = `
            <div class="p-poster-wrapper">
                <img src="${item.poster_url || '../assets/poster-placeholder.png'}" alt="${item.primary_title}" loading="lazy">
                ${buttonsHtml}
            </div>
            <div class="p-card-info">
                <h4>${item.primary_title}</h4>
                <span>${item.start_year || ''}</span>
            </div>
            <a href="movie.html?id=${item.production_id}" class="p-card-link"></a>
        `;
        container.appendChild(div);
    });
}

async function renderRatings(email) {
    const container = document.getElementById("profile-dynamic-content");
    if (!container) return;

    container.innerHTML = '<p style="color:#666;">Loading ratings...</p>';
    container.style.display = "grid"; 

    try {
        const ratings = await apiGetUserRatings(email);
        
        if (!ratings || ratings.length === 0) {
            container.style.display = "block";
            container.innerHTML = '<p class="empty-msg">No ratings yet.</p>';
            return;
        }
        
        container.innerHTML = ratings.map(movie => `
            <div class="p-movie-card" onclick="window.location.href='movie.html?id=${movie.production_id}'">
                <div class="p-poster-wrapper">
                    <img src="${movie.poster_url || '../assets/poster-placeholder.png'}" alt="${movie.primary_title}">
                    <div class="p-rating-badge">★ ${movie.user_rating}</div>
                </div>
                <div class="p-card-info">
                    <h4>${movie.primary_title}</h4>
                    <span>${movie.start_year || ''}</span>
                </div>
            </div>
        `).join('');

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p class="error-text">Failed to load ratings.</p>';
    }
}

async function renderComments(email) {
    const container = document.getElementById("profile-dynamic-content");
    if (!container) return;

    container.innerHTML = '<p style="color:#666;">Loading comments...</p>';
    
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "15px";

    try {
        const comments = await apiGetUserComments(email);
        
        if (!comments || comments.length === 0) {
            container.innerHTML = '<p class="empty-msg">No comments yet.</p>';
            return;
        }

        container.innerHTML = comments.map(c => `
            <div class="p-comment-row" style="cursor:pointer;" onclick="window.location.href='movie.html?id=${c.production_id}'">
                <div style="display:flex; align-items:center; gap:15px; margin-bottom:10px;">
                    <img src="${c.poster_url || '../assets/poster-placeholder.png'}" 
                            style="width:40px; height:60px; object-fit:cover; border-radius:4px;">
                    <div>
                        <h4 style="margin:0; color:var(--accent-color); font-size:1rem;">${c.primary_title}</h4>
                        <small style="color:#666;">${new Date(c.created_at).toLocaleDateString()}</small>
                    </div>
                </div>
                <p style="margin:0; color:#ccc; line-height:1.4;">"${c.content}"</p>
            </div>
        `).join('');

    } catch (err) {
        console.error(err);
        container.innerHTML = '<p class="error-text">Failed to load comments.</p>';
    }
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
        const token = getToken();
        const user = getUser();
        if (!token || !user) return;

        const res = await fetch(`${API_URL}/profile/list/update`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify({ email: user.email, production_id: prodId, status: status })
        });
        if (res.ok) window.location.reload();
    } catch (e) { console.error(e); }
};