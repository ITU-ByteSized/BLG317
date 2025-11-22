import { initNavbar } from "../components/navbar.js";
import { login } from "../api/auth.api.js";
import { goTo } from "../utils/router.js";

initNavbar();
document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("login-form");
    const emailInput = document.getElementById("login-email");
    const passwordInput = document.getElementById("login-password");
    const errorBox = document.getElementById("login-error");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        if (errorBox) errorBox.textContent = "";

        const email = emailInput ? emailInput.value.trim() : "";
        const password = passwordInput ? passwordInput.value : "";

        if (!email || !password) {
            if (errorBox) errorBox.textContent = "Email and password are required.";
            return;
        }

        try {
            await login(email, password);
            goTo("index.html");
        } catch (err) {
            if (errorBox) {
                errorBox.textContent = err.message || "Login failed.";
            }
        }
    });
});
