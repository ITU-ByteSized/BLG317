import { initNavbar } from "../components/navbar.js";
import { getToken, getUser, setUser } from "../utils/storage.js";
import { goTo } from "../utils/router.js";
import { API_URL } from "../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const token = getToken();
    const localUser = getUser();

    if (!token || !localUser) {
        goTo("login.html");
        return;
    }

    const els = {
        username: document.getElementById("set-username"),
        email: document.getElementById("set-email"),
        gender: document.getElementById("set-gender"),
        birthdate: document.getElementById("set-birthdate"),
        bio: document.getElementById("set-bio"),
        public: document.getElementById("set-public"),
        currPass: document.getElementById("current-password"),
        newPass: document.getElementById("new-password"),
        avatarImg: document.getElementById("current-avatar"),
        avatarInput: document.getElementById("avatar-input"),
        uploadTrigger: document.getElementById("btn-upload-trigger"),
        msgBox: document.getElementById("settings-message"),
        usernameWarn: document.getElementById("username-warn"),
        form: document.getElementById("settings-form")
    };

    let uploadedAvatarUrl = null;

    if (els.uploadTrigger) {
        els.uploadTrigger.addEventListener("click", () => els.avatarInput.click());
    }

    try {
        const res = await fetch(`${API_URL}/profile/me?email=${encodeURIComponent(localUser.email)}&current_user=${encodeURIComponent(localUser.email)}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (data && !data.error) {
            if(els.username) els.username.value = data.username || "";
            if(els.email) els.email.value = data.email || "";
            if(els.bio) els.bio.value = data.bio || "";
            if(els.gender) els.gender.value = data.gender || "";
            if(els.birthdate) els.birthdate.value = data.birth_date || "";
            if(els.public) els.public.checked = data.profile_is_public;
            
            // Avatar varsa göster
            if (data.avatar_url && els.avatarImg) {
                els.avatarImg.src = data.avatar_url;
            }

            if (data.is_username_changed && els.username) {
                els.username.disabled = true;
                if(els.usernameWarn) els.usernameWarn.classList.remove("hidden");
            }
            if (data.birth_date && els.birthdate) {
                els.birthdate.disabled = true;
            }
        }
    } catch (e) {
        console.error(e);
    }

    if (els.avatarInput) {
        els.avatarInput.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

            els.msgBox.className = "message-box";
            els.msgBox.textContent = "Uploading image...";
            els.msgBox.style.display = "block";

            try {
                const res = await fetch(`${API_URL}/upload/avatar`, {
                    method: "POST",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formData
                });
                const result = await res.json();
                
                if (result.url) {
                    uploadedAvatarUrl = result.url;
                    els.avatarImg.src = result.url;
                    els.msgBox.textContent = "Image uploaded! Click 'Save All Changes' to apply.";
                    els.msgBox.className = "message-box success";
                } else {
                    throw new Error(result.error || "Upload failed");
                }
            } catch (err) {
                els.msgBox.textContent = "Upload failed: " + err.message;
                els.msgBox.className = "message-box error";
            }
        });
    }

    if (els.form) {
        els.form.addEventListener("submit", async (e) => {
            e.preventDefault();
            
            els.msgBox.textContent = "Saving...";
            els.msgBox.className = "message-box";
            els.msgBox.style.display = "block";

            const payload = {
                email_identifier: localUser.email,
                email: els.email.value,
                username: els.username.disabled ? undefined : els.username.value,
                gender: els.gender.value,
                birth_date: els.birthdate.disabled ? undefined : els.birthdate.value,
                bio: els.bio.value,
                profile_is_public: els.public.checked
            };

            if (uploadedAvatarUrl) {
                payload.avatar_url = uploadedAvatarUrl;
            }

            if (els.newPass.value) {
                payload.current_password = els.currPass.value;
                payload.new_password = els.newPass.value;
            }

            try {
                const res = await fetch(`${API_URL}/profile/update`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });

                const result = await res.json();

                if (res.ok) {
                    els.msgBox.textContent = "Saved successfully!";
                    els.msgBox.className = "message-box success";
                    
                    if (payload.username || payload.email) {
                        const updatedUser = { ...localUser, ...payload };
                        setUser(updatedUser);
                    }
                    setTimeout(() => location.reload(), 1000);
                } else {
                    throw new Error(result.error || "Update failed");
                }
            } catch (err) {
                els.msgBox.textContent = err.message;
                els.msgBox.className = "message-box error";
            }
        });
    }
});