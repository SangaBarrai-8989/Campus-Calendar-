document.addEventListener("DOMContentLoaded", function () {
    const userNameElement = document.getElementById("userName");

    try {
        const savedProfile = localStorage.getItem("techSpaceUserProfile");

        if (savedProfile) {
            const profile = JSON.parse(savedProfile);

            if (profile.fullName && profile.fullName.trim()) {
                userNameElement.textContent = profile.fullName.trim();
            }
        }
    } catch (error) {
        console.error("Could not load the user profile:", error);
    }
});