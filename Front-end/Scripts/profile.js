document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const PROFILE_KEY = "techSpaceUserProfile";
    const SAVED_EVENTS_KEY = "techSpaceSavedEvents";
    const CREATED_EVENTS_KEY = "techSpaceCreatedEvents";

    const form = document.getElementById("profileForm");
    const editButton = document.getElementById("editProfileButton");
    const cancelButton = document.getElementById("cancelButton");
    const formMessage = document.getElementById("formMessage");

    const fields = {
        fullName: document.getElementById("fullName"),
        email: document.getElementById("email"),
        studentId: document.getElementById("studentId"),
        department: document.getElementById("department"),
        year: document.getElementById("year"),
        phone: document.getElementById("phone"),
        bio: document.getElementById("bio")
    };

    let originalProfile = {};
    let messageTimer;

    function readJSON(key, fallback) {
        try {
            const value = JSON.parse(localStorage.getItem(key));

            return value === null ? fallback : value;
        } catch (error) {
            return fallback;
        }
    }

    function getProfile() {
        const stored = readJSON(PROFILE_KEY, {});

        if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
            return {};
        }

        return stored;
    }

    function saveProfile(profile) {
        try {
            localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
            return true;
        } catch (error) {
            showMessage(
                "Unable to save your profile in this browser.",
                "error"
            );

            return false;
        }
    }

    function showMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = "form-message show " + type;

        clearTimeout(messageTimer);

        messageTimer = setTimeout(function () {
            formMessage.className = "form-message";
            formMessage.textContent = "";
        }, 5000);
    }

    function clearMessage() {
        clearTimeout(messageTimer);
        formMessage.className = "form-message";
        formMessage.textContent = "";
    }

    function setError(id, message) {
        const errorElement = document.getElementById(id);

        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    function clearErrors() {
        setError("nameError", "");
        setError("emailError", "");

        fields.fullName.classList.remove("invalid");
        fields.email.classList.remove("invalid");

        fields.fullName.setAttribute("aria-invalid", "false");
        fields.email.setAttribute("aria-invalid", "false");
    }

    function validateProfile() {
        let valid = true;

        const name = fields.fullName.value.trim();
        const email = fields.email.value.trim();

        if (!name) {
            setError("nameError", "Please enter your full name.");
            fields.fullName.classList.add("invalid");
            fields.fullName.setAttribute("aria-invalid", "true");
            valid = false;
        } else {
            setError("nameError", "");
            fields.fullName.classList.remove("invalid");
            fields.fullName.setAttribute("aria-invalid", "false");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setError("emailError", "Please enter your email address.");
            fields.email.classList.add("invalid");
            fields.email.setAttribute("aria-invalid", "true");
            valid = false;
        } else if (!emailPattern.test(email)) {
            setError("emailError", "Please enter a valid email address.");
            fields.email.classList.add("invalid");
            fields.email.setAttribute("aria-invalid", "true");
            valid = false;
        } else {
            setError("emailError", "");
            fields.email.classList.remove("invalid");
            fields.email.setAttribute("aria-invalid", "false");
        }

        return valid;
    }

    function getInitials(name) {
        const words = String(name || "").trim().split(/\s+/).filter(Boolean);

        if (!words.length) return "S";

        if (words.length === 1) {
            return words[0].charAt(0).toUpperCase();
        }

        return (
            words[0].charAt(0) + words[words.length - 1].charAt(0)
        ).toUpperCase();
    }

    function setText(id, value, fallback) {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = value || fallback;
        }
    }

    function updateProfileDisplay(profile) {
        const name = profile.fullName || "Student Name";
        const initials = getInitials(profile.fullName);

        setText("heroName", name, "Student Name");
        setText("heroDepartment", profile.department, "Department not set");

        setText("topUserName", profile.fullName, "Student");

        setText("overviewEmail", profile.email, "Not provided");
        setText("overviewDepartment", profile.department, "Not set");
        setText("overviewYear", profile.year, "Not set");
        setText("overviewPhone", profile.phone, "Not provided");

        document.getElementById("profileAvatar").textContent = initials;
        document.getElementById("topAvatar").textContent =
            getInitials(profile.fullName || "Student");

        const profileFields = [
            profile.fullName,
            profile.email,
            profile.studentId,
            profile.department,
            profile.year,
            profile.phone,
            profile.bio
        ];

        const completed = profileFields.filter(function (value) {
            return String(value || "").trim() !== "";
        }).length;

        const percentage = Math.round(
            (completed / profileFields.length) * 100
        );

        setText("completionPercentage", percentage + "%", "0%");

        document.getElementById("completionBar").style.width =
            percentage + "%";

        if (percentage === 100) {
            setText(
                "completionText",
                "Great job! Your profile is complete.",
                ""
            );

            setText("profileStatus", "Profile complete", "");
        } else {
            setText(
                "completionText",
                "Add your details to complete your profile.",
                ""
            );

            setText("profileStatus", "Profile in progress", "");
        }

        updateEventCounts();
    }

    function updateEventCounts() {
        const savedEvents = readJSON(SAVED_EVENTS_KEY, []);
        const createdEvents = readJSON(CREATED_EVENTS_KEY, []);

        const savedCount = Array.isArray(savedEvents)
            ? savedEvents.length
            : 0;

        const createdCount = Array.isArray(createdEvents)
            ? createdEvents.length
            : 0;

        setText("savedEventsCount", savedCount, "0");

        setText(
            "myEventsCount",
            savedCount + createdCount,
            "0"
        );
    }

    function loadForm(profile) {
        fields.fullName.value = profile.fullName || "";
        fields.email.value = profile.email || "";
        fields.studentId.value = profile.studentId || "";
        fields.department.value = profile.department || "";
        fields.year.value = profile.year || "";
        fields.phone.value = profile.phone || "";
        fields.bio.value = profile.bio || "";

        updateBioCount();
        updateProfileDisplay(profile);
    }

    function getFormData() {
        return {
            fullName: fields.fullName.value.trim(),
            email: fields.email.value.trim(),
            studentId: fields.studentId.value.trim(),
            department: fields.department.value,
            year: fields.year.value,
            phone: fields.phone.value.trim(),
            bio: fields.bio.value.trim()
        };
    }

    function updateBioCount() {
        const count = fields.bio.value.length;

        setText("bioCount", count + " / 500", "0 / 500");
    }

    function focusFirstField() {
        fields.fullName.focus();

        fields.fullName.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    /* Load profile */

    originalProfile = getProfile();
    loadForm(originalProfile);

    /* Edit button */

    editButton.addEventListener("click", function () {
        focusFirstField();
    });

    /* Clear validation errors while editing */

    fields.fullName.addEventListener("input", function () {
        setError("nameError", "");
        fields.fullName.classList.remove("invalid");
        fields.fullName.setAttribute("aria-invalid", "false");
        clearMessage();
    });

    fields.email.addEventListener("input", function () {
        setError("emailError", "");
        fields.email.classList.remove("invalid");
        fields.email.setAttribute("aria-invalid", "false");
        clearMessage();
    });

    fields.bio.addEventListener("input", updateBioCount);

    Object.values(fields).forEach(function (field) {
        field.addEventListener("input", function () {
            clearMessage();
        });

        field.addEventListener("change", function () {
            clearMessage();
        });
    });

    /* Save profile */

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        clearMessage();

        if (!validateProfile()) {
            showMessage(
                "Please correct the highlighted fields.",
                "error"
            );

            const firstInvalid = form.querySelector(".invalid");

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;
        }

        const updatedProfile = getFormData();

        if (!saveProfile(updatedProfile)) {
            return;
        }

        originalProfile = { ...updatedProfile };

        updateProfileDisplay(updatedProfile);

        showMessage(
            "Your profile has been saved successfully in this browser.",
            "success"
        );
    });

    /* Cancel changes */

    cancelButton.addEventListener("click", function () {
        loadForm(originalProfile);
        clearErrors();
        clearMessage();
    });

    /* Mobile sidebar */

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
    }

    if (menuToggle && sidebar && sidebarOverlay) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
            sidebarOverlay.classList.toggle("show");
        });

        sidebarOverlay.addEventListener("click", closeSidebar);

        document.querySelectorAll(".sidebar .nav-link").forEach(function (link) {
            link.addEventListener("click", closeSidebar);
        });
    }
});