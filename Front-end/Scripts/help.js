document.addEventListener("DOMContentLoaded", function () {
    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");

    const faqSearch = document.getElementById("faqSearch");
    const clearSearch = document.getElementById("clearSearch");
    const faqItems = Array.from(document.querySelectorAll(".faq-item"));
    const noResults = document.getElementById("noResults");

    const contactForm = document.getElementById("contactForm");
    const toast = document.getElementById("toast");

    let toastTimer;

    // Toast notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 3500);
    }

    // Sidebar on mobile
    if (menuToggle && sidebar) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("open");
        });

        document.addEventListener("click", function (event) {
            if (
                window.innerWidth <= 950 &&
                sidebar.classList.contains("open") &&
                !sidebar.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                sidebar.classList.remove("open");
            }
        });

        sidebar.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                sidebar.classList.remove("open");
            });
        });
    }

    // Load saved profile name
    try {
        const savedProfile = JSON.parse(
            localStorage.getItem("techSpaceUserProfile") || "{}"
        );

        const name = (savedProfile.fullName || "").trim() || "Student";
        const initial = name.charAt(0).toUpperCase();

        document.getElementById("profileName").textContent = name;
        document.getElementById("profileAvatar").textContent = initial;
    } catch (error) {
        document.getElementById("profileName").textContent = "Student";
        document.getElementById("profileAvatar").textContent = "S";
    }

    // FAQ accordion
    faqItems.forEach(function (item) {
        const question = item.querySelector(".faq-question");

        question.addEventListener("click", function () {
            const isOpen = item.classList.contains("open");

            item.classList.toggle("open", !isOpen);
            question.setAttribute("aria-expanded", String(!isOpen));
        });
    });

    // Search FAQs
    function filterFAQs() {
        const query = faqSearch.value.trim().toLowerCase();
        let visibleCount = 0;

        faqItems.forEach(function (item) {
            const question = item.querySelector(".faq-question").textContent;
            const answer = item.querySelector(".faq-answer").textContent;
            const keywords = item.dataset.keywords || "";

            const searchableText =
                (question + " " + answer + " " + keywords).toLowerCase();

            const matches = searchableText.includes(query);

            item.style.display = matches ? "" : "none";

            if (matches) {
                visibleCount++;
            } else {
                item.classList.remove("open");
                item.querySelector(".faq-question").setAttribute(
                    "aria-expanded",
                    "false"
                );
            }
        });

        noResults.classList.toggle("show", visibleCount === 0);
        clearSearch.classList.toggle("visible", query.length > 0);
    }

    faqSearch.addEventListener("input", filterFAQs);

    clearSearch.addEventListener("click", function () {
        faqSearch.value = "";
        filterFAQs();
        faqSearch.focus();
    });

    // Contact form
    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!contactForm.checkValidity()) {
            contactForm.reportValidity();
            return;
        }

        const message = {
            name: document.getElementById("contactName").value.trim(),
            email: document.getElementById("contactEmail").value.trim(),
            subject: document.getElementById("contactSubject").value,
            message: document.getElementById("contactMessage").value.trim(),
            createdAt: new Date().toISOString(),
            status: "pending"
        };

        if (message.message.length < 10) {
            showToast("Please enter a message with at least 10 characters.");
            return;
        }

        /*
         * This is a frontend-only form.
         * The message is saved locally as a draft.
         * It is not emailed or sent to a support team until a backend is connected.
         */

        try {
            const savedMessages = JSON.parse(
                localStorage.getItem("techSpaceSupportMessages") || "[]"
            );

            savedMessages.push(message);

            localStorage.setItem(
                "techSpaceSupportMessages",
                JSON.stringify(savedMessages)
            );

            contactForm.reset();

            showToast(
                "Message saved as a local draft. Support delivery is not connected yet."
            );
        } catch (error) {
            showToast(
                "Unable to save the message. Please check your browser storage."
            );
        }
    });

    // Frontend logout placeholder
    document.getElementById("logoutBtn").addEventListener("click", function (event) {
        event.preventDefault();

        const confirmed = window.confirm("Are you sure you want to log out?");

        if (confirmed) {
            // Authentication and session logout will be connected to the backend later.
            window.location.href = "login.html";
        }
    });
});