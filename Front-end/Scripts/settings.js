document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const toast = document.getElementById("toast");

    const profileForm = document.getElementById("profileForm");

    const fullNameInput = document.getElementById("fullName");
    const emailInput = document.getElementById("email");
    const studentIdInput = document.getElementById("studentId");
    const departmentInput = document.getElementById("department");
    const bioInput = document.getElementById("bio");

    const profileName = document.getElementById("profileName");
    const profileAvatar = document.getElementById("profileAvatar");
    const largeAvatar = document.getElementById("largeAvatar");

    let toastTimer;

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    function getInitial(name) {
        const trimmedName = (name || "").trim();
        return trimmedName ? trimmedName.charAt(0).toUpperCase() : "S";
    }

    function updateProfileDisplay(name) {
        const displayName = (name || "").trim() || "Student";
        const initial = getInitial(displayName);

        profileName.textContent = displayName;
        profileAvatar.textContent = initial;
        largeAvatar.textContent = initial;
    }

    function readJSON(key, fallback) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function saveJSON(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            showToast("Unable to save settings in this browser.");
            return false;
        }
    }

    // Sidebar menu for smaller screens
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });

        document.addEventListener("click", function (event) {
            if (
                window.innerWidth <= 900 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                sidebar.classList.remove("open");
            }
        });
    }

    // Switch between settings sections
    const settingsTabs = document.querySelectorAll(".settings-tab");
    const settingsSections = document.querySelectorAll(".settings-section");

    settingsTabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            const sectionName = tab.dataset.section;

            settingsTabs.forEach(function (item) {
                item.classList.remove("active");
            });

            settingsSections.forEach(function (section) {
                section.classList.remove("active");
            });

            tab.classList.add("active");

            const targetSection = document.getElementById(
                sectionName + "-section"
            );

            if (targetSection) {
                targetSection.classList.add("active");
            }
        });
    });

    // Load saved profile information
    const savedProfile = readJSON("techSpaceUserProfile", {});

    fullNameInput.value = savedProfile.fullName || "";
    emailInput.value = savedProfile.email || "";
    studentIdInput.value = savedProfile.studentId || "";
    departmentInput.value = savedProfile.department || "";
    bioInput.value = savedProfile.bio || "";

    updateProfileDisplay(savedProfile.fullName || "Student");

    // Save profile information
    profileForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!profileForm.checkValidity()) {
            profileForm.reportValidity();
            return;
        }

        const profile = {
            fullName: fullNameInput.value.trim(),
            email: emailInput.value.trim(),
            studentId: studentIdInput.value.trim(),
            department: departmentInput.value.trim(),
            bio: bioInput.value.trim()
        };

        if (saveJSON("techSpaceUserProfile", profile)) {
            updateProfileDisplay(profile.fullName);
            showToast("Profile information saved successfully.");
        }
    });

    // Cancel resets the form to the last saved profile
    profileForm.addEventListener("reset", function () {
        setTimeout(function () {
            const profile = readJSON("techSpaceUserProfile", {});

            fullNameInput.value = profile.fullName || "";
            emailInput.value = profile.email || "";
            studentIdInput.value = profile.studentId || "";
            departmentInput.value = profile.department || "";
            bioInput.value = profile.bio || "";

            updateProfileDisplay(profile.fullName || "Student");
        }, 0);
    });

    // Notification preferences
    const notificationInputs = {
        eventReminders: document.getElementById("eventReminders"),
        newEvents: document.getElementById("newEvents"),
        eventUpdates: document.getElementById("eventUpdates"),
        emailNotifications: document.getElementById("emailNotifications")
    };

    const savedNotifications = readJSON("techSpaceNotificationPreferences", null);

    if (savedNotifications) {
        Object.keys(notificationInputs).forEach(function (key) {
            if (typeof savedNotifications[key] === "boolean") {
                notificationInputs[key].checked = savedNotifications[key];
            }
        });
    }

    document.getElementById("saveNotifications").addEventListener("click", function () {
        const preferences = {};

        Object.keys(notificationInputs).forEach(function (key) {
            preferences[key] = notificationInputs[key].checked;
        });

        if (saveJSON("techSpaceNotificationPreferences", preferences)) {
            showToast("Notification preferences saved.");
        }
    });

    // Appearance preferences
    const darkModeInput = document.getElementById("darkMode");
    const compactLayoutInput = document.getElementById("compactLayout");

    const savedAppearance = readJSON("techSpaceAppearancePreferences", {
        darkMode: false,
        compactLayout: false
    });

    darkModeInput.checked = Boolean(savedAppearance.darkMode);
    compactLayoutInput.checked = Boolean(savedAppearance.compactLayout);

    function applyAppearance() {
        document.body.classList.toggle(
            "dark-mode",
            darkModeInput.checked
        );

        document.body.classList.toggle(
            "compact-layout",
            compactLayoutInput.checked
        );
    }

    applyAppearance();

    document.getElementById("saveAppearance").addEventListener("click", function () {
        const appearance = {
            darkMode: darkModeInput.checked,
            compactLayout: compactLayoutInput.checked
        };

        if (saveJSON("techSpaceAppearancePreferences", appearance)) {
            applyAppearance();
            showToast("Appearance preferences saved.");
        }
    });

    // Keep the selected appearance preview in sync with the switches
    darkModeInput.addEventListener("change", applyAppearance);
    compactLayoutInput.addEventListener("change", applyAppearance);

    // Frontend logout placeholder
    function handleLogout() {
        const confirmed = window.confirm("Are you sure you want to log out?");

        if (confirmed) {
            // Actual session logout will be connected to the backend later.
            window.location.href = "login.html";
        }
    }

    document.getElementById("logoutBtn").addEventListener("click", function (event) {
        event.preventDefault();
        handleLogout();
    });

    document.getElementById("securityLogout").addEventListener("click", function () {
        handleLogout();
    });
});