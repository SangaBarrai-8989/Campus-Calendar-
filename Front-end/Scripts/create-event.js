document.addEventListener("DOMContentLoaded", function () {
    "use strict";

    const STORAGE_KEY = "techSpaceCreatedEvents";

    const form = document.getElementById("createEventForm");
    const resetButton = document.getElementById("resetButton");
    const formMessage = document.getElementById("formMessage");
    const toast = document.getElementById("toast");

    const titleInput = document.getElementById("eventTitle");
    const categoryInput = document.getElementById("eventCategory");
    const organizerInput = document.getElementById("eventOrganizer");
    const descriptionInput = document.getElementById("eventDescription");
    const dateInput = document.getElementById("eventDate");
    const startTimeInput = document.getElementById("eventStartTime");
    const endTimeInput = document.getElementById("eventEndTime");
    const locationInput = document.getElementById("eventMeetingLink");
    const capacityInput = document.getElementById("eventCapacity");
    const contactInput = document.getElementById("eventContact");

    const descriptionCount = document.getElementById("descriptionCount");

    const previewTitle = document.getElementById("previewTitle");
    const previewCategory = document.getElementById("previewCategory");
    const previewDescription = document.getElementById("previewDescription");
    const previewDate = document.getElementById("previewDate");
    const previewTime = document.getElementById("previewTime");
    const previewLocation = document.getElementById("previewLocation");

    let toastTimer;

    /* Set minimum date to today */

    function getTodayString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    dateInput.min = getTodayString();

    /* Read stored events */

    function getCreatedEvents() {
        try {
            const data = JSON.parse(
                localStorage.getItem(STORAGE_KEY) || "[]"
            );

            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Unable to read saved events:", error);
            return [];
        }
    }

    function saveCreatedEvents(events) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
            return true;
        } catch (error) {
            console.error("Unable to save event:", error);
            showToast("Unable to save this event in your browser.");
            return false;
        }
    }

    /* Escape text before displaying it in HTML */

    function escapeHTML(value) {
        return String(value).replace(/[&<>"']/g, function (character) {
            const entities = {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            };

            return entities[character];
        });
    }

    /* Feedback messages */

    function showToast(message) {
        if (!toast) return;

        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3000);
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = "form-message show " + type;
    }

    function clearFormMessage() {
        formMessage.textContent = "";
        formMessage.className = "form-message";
    }

    /* Field validation helpers */

    function setError(input, errorId, message) {
        const errorElement = document.getElementById(errorId);

        if (errorElement) {
            errorElement.textContent = message;
        }

        input.classList.toggle("invalid", Boolean(message));
        input.setAttribute("aria-invalid", String(Boolean(message)));

        return !message;
    }

    function clearFieldError(input, errorId) {
        setError(input, errorId, "");
    }

    function validateEmail() {
        const email = contactInput.value.trim();

        if (!email) {
            return setError(contactInput, "contactError", "");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            return setError(
                contactInput,
                "contactError",
                "Please enter a valid email address."
            );
        }

        return setError(contactInput, "contactError", "");
    }

    function validateDate() {
        if (!dateInput.value) {
            return setError(
                dateInput,
                "dateError",
                "Please select an event date."
            );
        }

        if (dateInput.value < getTodayString()) {
            return setError(
                dateInput,
                "dateError",
                "The event date cannot be in the past."
            );
        }

        return setError(dateInput, "dateError", "");
    }

    function validateStartTime() {
        if (!startTimeInput.value) {
            return setError(
                startTimeInput,
                "startTimeError",
                "Please select a start time."
            );
        }

        return setError(startTimeInput, "startTimeError", "");
    }

    function validateEndTime() {
        if (!endTimeInput.value) {
            return setError(
                endTimeInput,
                "endTimeError",
                "Please select an end time."
            );
        }

        if (
            startTimeInput.value &&
            endTimeInput.value <= startTimeInput.value
        ) {
            return setError(
                endTimeInput,
                "endTimeError",
                "End time must be later than start time."
            );
        }

        return setError(endTimeInput, "endTimeError", "");
    }

    function validateCapacity() {
        const value = capacityInput.value.trim();

        if (!value) {
            return setError(capacityInput, "capacityError", "");
        }

        const capacity = Number(value);

        if (
            !Number.isInteger(capacity) ||
            capacity < 1 ||
            capacity > 100000
        ) {
            return setError(
                capacityInput,
                "capacityError",
                "Enter a whole number between 1 and 100000."
            );
        }

        return setError(capacityInput, "capacityError", "");
    }

    function validateForm() {
        let valid = true;

        const validations = [
            setError(
                titleInput,
                "titleError",
                titleInput.value.trim()
                    ? ""
                    : "Please enter an event title."
            ),

            setError(
                categoryInput,
                "categoryError",
                categoryInput.value
                    ? ""
                    : "Please select an event category."
            ),

            setError(
                organizerInput,
                "organizerError",
                organizerInput.value.trim()
                    ? ""
                    : "Please enter the organizer's name."
            ),

            setError(
                descriptionInput,
                "descriptionError",
                descriptionInput.value.trim()
                    ? ""
                    : "Please enter an event description."
            ),

            validateDate(),
            validateStartTime(),
            validateEndTime(),

            setError(
                locationInput,
                "meetingLinkError",
                !locationInput.value.trim()
                    ? "Please enter the Google Meet link."
                    : (isValidMeetLink(locationInput.value.trim())
                        ? ""
                        : "Enter a valid Google Meet link, such as https://meet.google.com/abc-defg-hij.")
            ),

            validateCapacity(),
            validateEmail()
        ];

        validations.forEach(function (result) {
            if (!result) valid = false;
        });

        return valid;
    }

    function isValidMeetLink(value) {
        try {
            const url = new URL(value);
            return url.protocol === "https:" &&
                (url.hostname === "meet.google.com" || url.hostname.endsWith(".meet.google.com"));
        } catch (error) {
            return false;
        }
    }

    /* Date formatting */

    function formatDate(dateString) {
        if (!dateString) return "Select a date";

        const parts = dateString.split("-").map(Number);
        const date = new Date(parts[0], parts[1] - 1, parts[2]);

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function formatTime(timeString) {
        if (!timeString) return "";

        const parts = timeString.split(":");
        const hours = Number(parts[0]);
        const minutes = parts[1];

        const suffix = hours >= 12 ? "PM" : "AM";
        const displayHour = hours % 12 || 12;

        return `${displayHour}:${minutes} ${suffix}`;
    }

    /* Live preview */

    function updatePreview() {
        previewTitle.textContent =
            titleInput.value.trim() || "Your event title";

        previewCategory.textContent =
            categoryInput.value || "Event Category";

        previewDescription.textContent =
            descriptionInput.value.trim() ||
            "Your event description will appear here.";

        previewDate.textContent = formatDate(dateInput.value);

        const start = formatTime(startTimeInput.value);
        const end = formatTime(endTimeInput.value);

        if (start && end) {
            previewTime.textContent = `${start} - ${end}`;
        } else if (start) {
            previewTime.textContent = `Starts at ${start}`;
        } else {
            previewTime.textContent = "Select event time";
        }

        previewLocation.textContent =
            locationInput.value.trim() || "Google Meet link";

        descriptionCount.textContent =
            `${descriptionInput.value.length} / 1000`;
    }

    [
        titleInput,
        categoryInput,
        descriptionInput,
        dateInput,
        startTimeInput,
        endTimeInput,
        locationInput
    ].forEach(function (input) {
        input.addEventListener("input", updatePreview);
        input.addEventListener("change", updatePreview);
    });

    /* Validate fields as the user edits them */

    titleInput.addEventListener("input", function () {
        clearFieldError(titleInput, "titleError");
        clearFormMessage();
    });

    categoryInput.addEventListener("change", function () {
        clearFieldError(categoryInput, "categoryError");
        clearFormMessage();
    });

    organizerInput.addEventListener("input", function () {
        clearFieldError(organizerInput, "organizerError");
        clearFormMessage();
    });

    descriptionInput.addEventListener("input", function () {
        clearFieldError(descriptionInput, "descriptionError");
        clearFormMessage();
    });

    dateInput.addEventListener("change", function () {
        validateDate();
        validateEndTime();
        clearFormMessage();
    });

    startTimeInput.addEventListener("change", function () {
        validateStartTime();
        validateEndTime();
        clearFormMessage();
    });

    endTimeInput.addEventListener("change", function () {
        validateEndTime();
        clearFormMessage();
    });

    locationInput.addEventListener("input", function () {
        clearFieldError(locationInput, "meetingLinkError");
        clearFormMessage();
    });

    capacityInput.addEventListener("input", function () {
        validateCapacity();
        clearFormMessage();
    });

    contactInput.addEventListener("input", function () {
        validateEmail();
        clearFormMessage();
    });

    /* Submit event form */

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        clearFormMessage();

        if (!validateForm()) {
            showFormMessage(
                "Please check the highlighted fields and correct the errors.",
                "error"
            );

            const firstInvalid = form.querySelector(".invalid");

            if (firstInvalid) {
                firstInvalid.focus();
                firstInvalid.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                });
            }

            return;
        }

        const createdEvent = {
            id: "custom-" + Date.now(),
            title: titleInput.value.trim(),
            category: categoryInput.value,
            organizer: organizerInput.value.trim(),
            description: descriptionInput.value.trim(),
            date: dateInput.value,
            startTime: startTimeInput.value,
            endTime: endTimeInput.value,
            time:
                formatTime(startTimeInput.value) +
                " - " +
                formatTime(endTimeInput.value),
            meetingLink: locationInput.value.trim(),
            capacity: capacityInput.value
                ? Number(capacityInput.value)
                : null,
            contactEmail: contactInput.value.trim(),
            attendees: 0,
            createdAt: new Date().toISOString()
        };

        const savedEvents = getCreatedEvents();

        savedEvents.push(createdEvent);

        if (!saveCreatedEvents(savedEvents)) {
            showFormMessage(
                "The event could not be saved. Please try again.",
                "error"
            );

            return;
        }

        showFormMessage(
            "Event created successfully in this browser! " +
            "It is stored locally and has not been published to a server.",
            "success"
        );

        showToast("Your event has been saved!");

        form.reset();

        form.querySelectorAll(".invalid").forEach(function (input) {
            input.classList.remove("invalid");
            input.setAttribute("aria-invalid", "false");
        });

        form.querySelectorAll(".field-error").forEach(function (error) {
            error.textContent = "";
        });

        dateInput.min = getTodayString();

        updatePreview();

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    /* Reset form */

    resetButton.addEventListener("click", function () {
        const hasData = Array.from(form.elements).some(function (element) {
            return (
                element.name &&
                element.type !== "button" &&
                element.type !== "submit" &&
                element.value.trim() !== ""
            );
        });

        if (
            hasData &&
            !window.confirm("Are you sure you want to clear the form?")
        ) {
            return;
        }

        form.reset();

        form.querySelectorAll(".invalid").forEach(function (input) {
            input.classList.remove("invalid");
            input.setAttribute("aria-invalid", "false");
        });

        form.querySelectorAll(".field-error").forEach(function (error) {
            error.textContent = "";
        });

        clearFormMessage();
        updatePreview();

        showToast("Form cleared.");
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

    /* Initial state */

    updatePreview();
});