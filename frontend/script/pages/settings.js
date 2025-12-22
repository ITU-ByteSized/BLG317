import { initNavbar } from "../components/navbar.js";
import { getToken, getUser, setUser } from "../utils/storage.js";
import { API_URL } from "../config.js";

document.addEventListener("DOMContentLoaded", async () => {
    initNavbar();

    const token = getToken();
    const localUser = getUser();

    if (!token || !localUser) {
        window.location.href = "login.html";
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
        form: document.getElementById("settings-form"),
        cropModal: document.getElementById("crop-modal"),
        imgToCrop: document.getElementById("image-to-crop"),
        btnCloseModal: document.getElementById("close-crop-modal"),
        btnCancelCrop: document.getElementById("btn-cancel-crop"),
        btnCropSave: document.getElementById("btn-crop-save")
    };

    let uploadedAvatarUrl = null;
    let cropper = null;

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
            
            if (data.avatar_url && els.avatarImg) {
                els.avatarImg.src = `${data.avatar_url}?t=${new Date().getTime()}`;
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

    if (els.uploadTrigger) {
        els.uploadTrigger.addEventListener("click", () => els.avatarInput.click());
    }

    if (els.avatarInput) {
        els.avatarInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                els.imgToCrop.src = evt.target.result;
                els.cropModal.classList.remove("hidden");
                
                if (cropper) cropper.destroy();
                cropper = new Cropper(els.imgToCrop, {
                    aspectRatio: 1,
                    viewMode: 2,
                    autoCropArea: 1
                });
            };
            reader.readAsDataURL(file);
            els.avatarInput.value = "";
        });
    }

    const closeCrop = () => {
        els.cropModal.classList.add("hidden");
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
    };

    if (els.btnCloseModal) els.btnCloseModal.addEventListener("click", closeCrop);
    if (els.btnCancelCrop) els.btnCancelCrop.addEventListener("click", closeCrop);

    if (els.btnCropSave) {
        els.btnCropSave.addEventListener("click", () => {
            if (!cropper) return;
            
            cropper.getCroppedCanvas({ width: 300, height: 300 }).toBlob(async (blob) => {
                if (!blob) return;

                const formData = new FormData();
                formData.append("file", blob, "avatar.png");

                els.cropModal.classList.add("hidden");
                els.msgBox.className = "message-box";
                els.msgBox.textContent = "Uploading avatar...";
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
                        const cacheBustUrl = `${result.url}?t=${new Date().getTime()}`;
                        
                        els.avatarImg.src = cacheBustUrl;
                        
                        const updateRes = await fetch(`${API_URL}/profile/update`, {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                email_identifier: localUser.email,
                                avatar_url: result.url
                            })
                        });

                        if (updateRes.ok) {
                            els.msgBox.textContent = "Profile photo updated successfully!";
                            els.msgBox.className = "message-box success";
                            
                            const currentUser = getUser();
                            if (currentUser) {
                                currentUser.avatar_url = result.url;
                                setUser(currentUser);
                            }
                        } else {
                            throw new Error("File uploaded but profile not updated.");
                        }

                    } else {
                        throw new Error(result.error || "Upload failed");
                    }
                } catch (err) {
                    els.msgBox.textContent = "Error: " + err.message;
                    els.msgBox.className = "message-box error";
                }
            }, 'image/png');
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
                    
                    const updatedUser = { ...localUser, ...payload };
                    if (uploadedAvatarUrl) updatedUser.avatar_url = uploadedAvatarUrl;
                    setUser(updatedUser);

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