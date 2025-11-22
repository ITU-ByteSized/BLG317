import { initNavbar } from "../components/navbar.js";
import { signup } from "../api/auth.api.js";
import { goTo } from "../utils/router.js";

document.addEventListener("DOMContentLoaded", () => {
    initNavbar();

    const form = document.getElementById("signup-form");
    const usernameInput = document.getElementById("signup-username");
    const emailInput = document.getElementById("signup-email");
    const passwordInput = document.getElementById("signup-password");
    const statusBox = document.getElementById("signup-status");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (statusBox) statusBox.textContent = "";

        const username = usernameInput ? usernameInput.value.trim() : "";
        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (!username || !email || !password) {
            if (statusBox) statusBox.textContent = "All fields are required.";
            return;
        }

        try {
            await signup(username, email, password);
            if (statusBox) statusBox.textContent = "Account created. Redirecting...";
            setTimeout(() => {
                goTo("index.html");
            }, 800);
        } catch (err) {
            if (statusBox) {
                statusBox.textContent = err.message || "Sign up failed.";
            }
        }
    });
});
