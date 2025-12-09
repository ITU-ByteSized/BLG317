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
        msgBox: document.getElementById("settings-message"),
        usernameWarn: document.getElementById("username-warn")
    };

    let uploadedAvatarUrl = null;

    try {
        const res = await fetch(`${API_URL}/profile/me?email=${encodeURIComponent(localUser.email)}&current_user=${encodeURIComponent(localUser.email)}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();

        if (data && !data.error) {
            els.username.value = data.username || "";
            els.email.value = data.email || "";
            els.bio.value = data.bio || "";
            els.gender.value = data.gender || "";
            els.birthdate.value = data.birth_date || "";
            els.public.checked = data.profile_is_public;
            
            if (data.avatar_url) els.avatarImg.src = data.avatar_url;

            if (data.is_username_changed) {
                els.username.disabled = true;
                if(els.usernameWarn) els.usernameWarn.style.display = "block";
            }
            if (data.birth_date) {
                els.birthdate.disabled = true;
            }
        }
    } catch (e) {
        console.error(e);
    }

    els.avatarInput.addEventListener("change", async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            els.msgBox.textContent = "Uploading image...";
            const res = await fetch(`${API_URL}/upload/avatar`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` }, // Content-Type ekleme!
                body: formData
            });
            const data = await res.json();
            
            if (data.url) {
                uploadedAvatarUrl = data.url;
                els.avatarImg.src = data.url;
                els.msgBox.textContent = "Image uploaded. Click 'Save All Changes' to apply.";
                els.msgBox.className = "message-box success";
            } else {
                els.msgBox.textContent = "Upload failed.";
                els.msgBox.className = "message-box error";
            }
        } catch (err) {
            console.error(err);
            els.msgBox.textContent = "Upload error.";
            els.msgBox.className = "message-box error";
        }
    });
    
    document.getElementById("settings-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        els.msgBox.textContent = "Saving...";
        els.msgBox.className = "message-box";

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
                els.msgBox.textContent = "Changes saved successfully!";
                els.msgBox.classList.add("success");
                
                if (payload.username || payload.email) {
                    const updatedUser = { ...localUser, ...payload };
                    setUser(updatedUser);
                }
                
                setTimeout(() => location.reload(), 1000);
            } else {
                els.msgBox.textContent = result.error || "Update failed.";
                els.msgBox.classList.add("error");
            }
        } catch (err) {
            els.msgBox.textContent = "Connection error.";
            els.msgBox.classList.add("error");
        }
    });
});