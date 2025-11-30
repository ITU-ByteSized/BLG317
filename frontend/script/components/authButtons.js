import { isLoggedIn, logout, getUser } from "../utils/storage.js";
import { goTo } from "../utils/router.js";

function getPathPrefix() {
    const path = window.location.pathname;
    if (path.includes("/pages/")) return "";
    return "pages/";
}

export function initAuthButtons() {
    const container = document.querySelector(".auth-btns");
    if (!container) return;

    const prefix = getPathPrefix();
    const logged = isLoggedIn();
    container.innerHTML = "";

    if (!logged) {
        const loginBtn = document.createElement("button");
        loginBtn.className = "btn btn-login";
        loginBtn.textContent = "Login";
        loginBtn.addEventListener("click", () => {
            goTo(`${prefix}login.html`);
        });

        const signupBtn = document.createElement("button");
        signupBtn.className = "btn btn-signup";
        signupBtn.textContent = "Sign Up";
        signupBtn.addEventListener("click", () => {
            goTo(`${prefix}signup.html`);
        });

        container.appendChild(loginBtn);
        container.appendChild(signupBtn);
    } else {
        const user = getUser();

        const profileBtn = document.createElement("button");
        profileBtn.className = "btn btn-login";
        profileBtn.textContent = user?.username || "My Profile";
        profileBtn.addEventListener("click", () => {
            goTo(`${prefix}profile.html`);
        });

        const logoutBtn = document.createElement("button");
        logoutBtn.className = "btn btn-signup";
        logoutBtn.textContent = "Logout";
        logoutBtn.addEventListener("click", () => {
            logout();
            goTo(`${prefix}index.html`);
        });

        container.appendChild(profileBtn);
        container.appendChild(logoutBtn);
    }
}