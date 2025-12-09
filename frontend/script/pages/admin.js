import { initNavbar } from "../components/navbar.js";
import { getToken, getUser } from "../utils/storage.js";
import { goTo } from "../utils/router.js";
import { API_URL } from "../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();
    
    const token = getToken();
    const user = getUser();

    if (!token || !user || user.urole !== 'admin') {
        alert("Access Denied");
        goTo("index.html");
        return;
    }

    document.getElementById("admin-user-display").textContent = `Logged in as: ${user.username}`;

    try {
        const res = await fetch(`${API_URL}/admin/stats`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (data && !data.error) {
            document.getElementById("stat-users").textContent = data.total_users || 0;
            document.getElementById("stat-movies").textContent = data.total_movies || 0;
            document.getElementById("stat-ratings").textContent = data.total_ratings || 0;
        }
    } catch (e) {
        console.error("Admin stats failed", e);
    }
});