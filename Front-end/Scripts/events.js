document.addEventListener("DOMContentLoaded", () => {
    const eventsContainer = document.getElementById("eventsContainer");
    const eventSearch = document.getElementById("eventSearch");
    const categoryFilter = document.getElementById("categoryFilter");
    const dateFilter = document.getElementById("dateFilter");
    const sortFilter = document.getElementById("sortFilter");
    const categoryTabs = document.getElementById("categoryTabs");
    const resultsCount = document.getElementById("resultsCount");
    const emptyState = document.getElementById("emptyState");
    const pagination = document.getElementById("pagination");

    const totalEventsElement = document.getElementById("totalEvents");
    const upcomingCountElement = document.getElementById("upcomingCount");
    const savedCountElement = document.getElementById("savedCount");

    const gridViewButton = document.getElementById("gridViewButton");
    const listViewButton = document.getElementById("listViewButton");

    const eventModal = document.getElementById("eventModal");
    const modalClose = document.getElementById("modalClose");
    const modalCloseButton = document.getElementById("modalCloseButton");
    const modalSaveButton = document.getElementById("modalSaveButton");

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayISO = dateToISO(today);

    const categoryNames = {
        academic: "Academic",
        workshop: "Workshop",
        social: "Social",
        sports: "Sports",
        career: "Career"
    };

    const categoryIcons = {
        academic: "fa-solid fa-graduation-cap",
        workshop: "fa-solid fa-laptop-code",
        social: "fa-solid fa-users",
        sports: "fa-solid fa-futbol",
        career: "fa-solid fa-briefcase"
    };

    const events = [
        {
            id: 1,
            title: "Web Development Workshop",
            date: "2026-10-20",
            time: "10:00 AM",
            location: "Computer Lab A",
            category: "workshop",
            organizer: "TechSpace Team",
            description: "Learn modern web development techniques, including HTML, CSS, JavaScript, and responsive design."
        },
        {
            id: 2,
            title: "Campus Football Tournament",
            date: "2026-10-22",
            time: "02:00 PM",
            location: "University Sports Ground",
            category: "sports",
            organizer: "Sports Club",
            description: "Join fellow students for an exciting campus football tournament. All skill levels are welcome."
        },
        {
            id: 3,
            title: "Career Development Seminar",
            date: "2026-10-24",
            time: "11:00 AM",
            location: "Main Auditorium",
            category: "career",
            organizer: "Career Center",
            description: "Explore career opportunities, improve your CV, and learn how to prepare for job interviews."
        },
        {
            id: 4,
            title: "Student Networking Meetup",
            date: "2026-10-26",
            time: "04:00 PM",
            location: "Student Center",
            category: "social",
            organizer: "Student Association",
            description: "Meet new students, exchange ideas, and build meaningful connections across campus."
        },
        {
            id: 5,
            title: "Research Presentation Day",
            date: "2026-10-28",
            time: "09:30 AM",
            location: "Lecture Hall 2",
            category: "academic",
            organizer: "Academic Affairs",
            description: "Students present their research projects and receive feedback from faculty members."
        },
        {
            id: 6,
            title: "UI/UX Design Workshop",
            date: "2026-10-30",
            time: "01:00 PM",
            location: "Innovation Lab",
            category: "workshop",
            organizer: "Design Club",
            description: "Discover user-centered design principles and practice creating intuitive digital experiences."
        },
        {
            id: 7,
            title: "Academic Planning Session",
            date: "2026-11-03",
            time: "10:00 AM",
            location: "Library Meeting Room",
            category: "academic",
            organizer: "Academic Affairs",
            description: "Plan your semester, review academic goals, and learn effective study strategies."
        },
        {
            id: 8,
            title: "Technology Innovation Fair",
            date: "2026-11-06",
            time: "09:00 AM",
            location: "Campus Exhibition Hall",
            category: "career",
            organizer: "TechSpace Team",
            description: "Explore student technology projects, meet innovators, and discover emerging technologies."
        },
        {
            id: 9,
            title: "Campus Cultural Day",
            date: "2026-11-10",
            time: "12:00 PM",
            location: "Main Campus Garden",
            category: "social",
            organizer: "Student Association",
            description: "Celebrate campus diversity through cultural activities, student performances, and community engagement."
        },
        {
            id: 10,
            title: "JavaScript Study Group",
            date: "2026-11-12",
            time: "03:00 PM",
            location: "Computer Lab B",
            category: "workshop",
            organizer: "Programming Club",
            description: "Practice JavaScript together, solve programming challenges, and learn from other students."
        },
        {
            id: 11,
            title: "Basketball Championship",
            date: "2026-11-15",
            time: "02:30 PM",
            location: "Indoor Sports Hall",
            category: "sports",
            organizer: "Sports Club",
            description: "Watch campus teams compete in the student basketball championship."
        },
        {
            id: 12,
            title: "Final Exam Preparation",
            date: "2026-11-18",
            time: "10:30 AM",
            location: "Central Library",
            category: "academic",
            organizer: "Academic Affairs",
            description: "Prepare for final examinations with practical study techniques and peer discussions."
        }
    ];

    let savedEventIds = loadSavedEvents();
    let activeCategory = "all";
    let activeEvent = null;
    let currentPage = 1;
    let viewMode = "grid";

    const eventsPerPage = 6;

    function dateToISO(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    function parseLocalDate(dateString) {
        const [year, month, day] = dateString.split("-").map(Number);

        return new Date(year, month - 1, day);
    }

    function formatDate(dateString, options = {}) {
        return parseLocalDate(dateString).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            ...options
        });
    }

    function loadSavedEvents() {
        try {
            const saved = JSON.parse(
                localStorage.getItem("techspaceSavedEvents") || "[]"
            );

            return Array.isArray(saved) ? saved : [];
        } catch {
            return [];
        }
    }

    function persistSavedEvents() {
        try {
            localStorage.setItem(
                "techspaceSavedEvents",
                JSON.stringify(savedEventIds)
            );

            return true;
        } catch {
            alert("Unable to save changes in your browser.");
            return false;
        }
    }

    function updateStats() {
        totalEventsElement.textContent = events.length;

        upcomingCountElement.textContent = events.filter(
            event => event.date >= todayISO
        ).length;

        savedCountElement.textContent = savedEventIds.length;
    }

    function getFilteredEvents() {
        const searchTerm = eventSearch.value.trim().toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedDateRange = dateFilter.value;

        let filtered = events.filter(event => {
            const matchesCategory =
                selectedCategory === "all" ||
                event.category === selectedCategory;

            const matchesTab =
                activeCategory === "all" ||
                event.category === activeCategory;

            const searchableText = [
                event.title,
                event.location,
                event.organizer,
                event.description,
                categoryNames[event.category]
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);

            const eventDate = parseLocalDate(event.date);
            const daysDifference = Math.floor(
                (eventDate.getTime() - today.getTime()) / 86400000
            );

            let matchesDate = true;

            switch (selectedDateRange) {
                case "upcoming":
                    matchesDate = event.date >= todayISO;
                    break;

                case "today":
                    matchesDate = event.date === todayISO;
                    break;

                case "week":
                    matchesDate =
                        event.date >= todayISO &&
                        daysDifference <= 7;
                    break;

                case "past":
                    matchesDate = event.date < todayISO;
                    break;
            }

            return matchesCategory &&
                matchesTab &&
                matchesSearch &&
                matchesDate;
        });

        switch (sortFilter.value) {
            case "date-desc":
                filtered.sort((a, b) => b.date.localeCompare(a.date));
                break;

            case "title":
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;

            default:
                filtered.sort((a, b) => a.date.localeCompare(b.date));
        }

        return filtered;
    }

    function createEventCard(event) {
        const card = document.createElement("article");
        card.className = "event-card";

        const cover = document.createElement("div");
        cover.className = `event-cover ${event.category}`;

        const coverIcon = document.createElement("i");
        coverIcon.className = categoryIcons[event.category];

        const category = document.createElement("span");
        category.className = "event-category";
        category.textContent = categoryNames[event.category];

        const saveButton = document.createElement("button");
        const isSaved = savedEventIds.includes(event.id);

        saveButton.type = "button";
        saveButton.className = `save-button ${isSaved ? "saved" : ""}`;
        saveButton.setAttribute(
            "aria-label",
            isSaved ? "Remove saved event" : "Save event"
        );
        saveButton.title = isSaved ? "Remove saved event" : "Save event";

        saveButton.innerHTML = isSaved
            ? '<i class="fa-solid fa-bookmark"></i>'
            : '<i class="fa-regular fa-bookmark"></i>';

        saveButton.addEventListener("click", () => {
            toggleSavedEvent(event.id);
        });

        cover.append(coverIcon, category, saveButton);

        const body = document.createElement("div");
        body.className = "event-card-body";

        const date = document.createElement("div");
        date.className = "event-date";
        date.innerHTML = '<i class="fa-regular fa-calendar"></i>';

        const dateText = document.createElement("span");
        dateText.textContent = formatDate(event.date, {
            month: "short",
            day: "numeric",
            year: "numeric"
        });

        date.appendChild(dateText);

        const title = document.createElement("h3");
        title.textContent = event.title;

        const description = document.createElement("p");
        description.className = "event-card-description";
        description.textContent = event.description;

        const meta = document.createElement("div");
        meta.className = "event-meta";

        const time = document.createElement("span");
        time.innerHTML = '<i class="fa-regular fa-clock"></i>';

        const timeText = document.createElement("span");
        timeText.textContent = event.time;

        time.appendChild(timeText);

        const location = document.createElement("span");
        location.innerHTML = '<i class="fa-solid fa-location-dot"></i>';

        const locationText = document.createElement("span");
        locationText.textContent = event.location;

        location.appendChild(locationText);

        meta.append(time, location);

        const footer = document.createElement("div");
        footer.className = "event-card-footer";

        const organizer = document.createElement("span");
        organizer.className = "organizer";
        organizer.textContent = event.organizer;

        const detailsButton = document.createElement("button");
        detailsButton.className = "details-button";
        detailsButton.type = "button";
        detailsButton.textContent = "View Details →";

        detailsButton.addEventListener("click", () => {
            openEventModal(event);
        });

        footer.append(organizer, detailsButton);

        body.append(date, title, description, meta, footer);
        card.append(cover, body);

        return card;
    }

    function renderPagination(totalPages) {
        pagination.innerHTML = "";

        if (totalPages <= 1) {
            return;
        }

        const previousButton = document.createElement("button");
        previousButton.type = "button";
        previousButton.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        previousButton.disabled = currentPage === 1;

        previousButton.addEventListener("click", () => {
            currentPage--;
            renderEvents();
            scrollToEvents();
        });

        pagination.appendChild(previousButton);

        for (let page = 1; page <= totalPages; page++) {
            const pageButton = document.createElement("button");

            pageButton.type = "button";
            pageButton.textContent = page;

            if (page === currentPage) {
                pageButton.classList.add("active");
                pageButton.setAttribute("aria-current", "page");
            }

            pageButton.addEventListener("click", () => {
                currentPage = page;
                renderEvents();
                scrollToEvents();
            });

            pagination.appendChild(pageButton);
        }

        const nextButton = document.createElement("button");
        nextButton.type = "button";
        nextButton.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
        nextButton.disabled = currentPage === totalPages;

        nextButton.addEventListener("click", () => {
            currentPage++;
            renderEvents();
            scrollToEvents();
        });

        pagination.appendChild(nextButton);
    }

    function renderEvents() {
        const filteredEvents = getFilteredEvents();

        const totalPages = Math.ceil(
            filteredEvents.length / eventsPerPage
        );

        if (totalPages > 0 && currentPage > totalPages) {
            currentPage = totalPages;
        }

        if (currentPage < 1) {
            currentPage = 1;
        }

        const startIndex = (currentPage - 1) * eventsPerPage;

        const visibleEvents = filteredEvents.slice(
            startIndex,
            startIndex + eventsPerPage
        );

        eventsContainer.innerHTML = "";
        eventsContainer.className = viewMode === "list"
            ? "events-grid list-view"
            : "events-grid";

        resultsCount.textContent = filteredEvents.length === 0
            ? "No events found"
            : `Showing ${startIndex + 1}–${Math.min(
                startIndex + eventsPerPage,
                filteredEvents.length
            )} of ${filteredEvents.length} events`;

        emptyState.hidden = filteredEvents.length !== 0;
        eventsContainer.hidden = filteredEvents.length === 0;

        visibleEvents.forEach(event => {
            eventsContainer.appendChild(createEventCard(event));
        });

        renderPagination(totalPages);
        updateStats();
    }

    function updateCategoryTabs(category) {
        categoryTabs.querySelectorAll(".category-tab").forEach(tab => {
            tab.classList.toggle(
                "active",
                tab.dataset.category === category
            );
        });
    }

    function setCategory(category) {
        activeCategory = category;
        categoryFilter.value = category;
        currentPage = 1;

        updateCategoryTabs(category);
        renderEvents();
    }

    function toggleSavedEvent(eventId) {
        const isSaved = savedEventIds.includes(eventId);
        const previousSavedIds = [...savedEventIds];

        if (isSaved) {
            savedEventIds = savedEventIds.filter(id => id !== eventId);
        } else {
            savedEventIds.push(eventId);
        }

        if (!persistSavedEvents()) {
            savedEventIds = previousSavedIds;
            return;
        }

        renderEvents();

        if (activeEvent && activeEvent.id === eventId) {
            updateModalSaveButton();
        }
    }

    function openEventModal(event) {
        activeEvent = event;

        document.getElementById("modalTitle").textContent = event.title;
        document.getElementById("modalDescription").textContent = event.description;
        document.getElementById("modalDate").textContent = formatDate(event.date);
        document.getElementById("modalTime").textContent = event.time;
        document.getElementById("modalLocation").textContent = event.location;
        document.getElementById("modalOrganizer").textContent = event.organizer;

        const categoryElement = document.getElementById("modalCategory");
        categoryElement.textContent = categoryNames[event.category];
        categoryElement.className = `modal-category ${event.category}`;

        updateModalSaveButton();

        eventModal.classList.add("show");
        eventModal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        modalClose.focus();
    }

    function closeEventModal() {
        eventModal.classList.remove("show");
        eventModal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        activeEvent = null;
    }

    function updateModalSaveButton() {
        if (!activeEvent) {
            return;
        }

        const isSaved = savedEventIds.includes(activeEvent.id);

        modalSaveButton.innerHTML = isSaved
            ? '<i class="fa-solid fa-bookmark"></i> Saved'
            : '<i class="fa-regular fa-bookmark"></i> Save Event';

        modalSaveButton.style.background = isSaved ? "#169b74" : "";
        modalSaveButton.style.borderColor = isSaved ? "#169b74" : "";
        modalSaveButton.style.color = "#ffffff";
    }

    function scrollToEvents() {
        document.querySelector(".section-heading").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    eventSearch.addEventListener("input", () => {
        currentPage = 1;
        renderEvents();
    });

    categoryFilter.addEventListener("change", () => {
        setCategory(categoryFilter.value);
    });

    dateFilter.addEventListener("change", () => {
        currentPage = 1;
        renderEvents();
    });

    sortFilter.addEventListener("change", () => {
        currentPage = 1;
        renderEvents();
    });

    categoryTabs.addEventListener("click", event => {
        const tab = event.target.closest(".category-tab");

        if (!tab) {
            return;
        }

        setCategory(tab.dataset.category);
    });

    gridViewButton.addEventListener("click", () => {
        viewMode = "grid";

        gridViewButton.classList.add("active");
        listViewButton.classList.remove("active");

        renderEvents();
    });

    listViewButton.addEventListener("click", () => {
        viewMode = "list";

        listViewButton.classList.add("active");
        gridViewButton.classList.remove("active");

        renderEvents();
    });

    document.getElementById("resetFilters").addEventListener("click", () => {
        eventSearch.value = "";
        categoryFilter.value = "all";
        dateFilter.value = "all";
        sortFilter.value = "date-asc";

        activeCategory = "all";
        currentPage = 1;

        updateCategoryTabs("all");
        renderEvents();
    });

    modalClose.addEventListener("click", closeEventModal);
    modalCloseButton.addEventListener("click", closeEventModal);

    eventModal.addEventListener("click", event => {
        if (event.target === eventModal) {
            closeEventModal();
        }
    });

    modalSaveButton.addEventListener("click", () => {
        if (activeEvent) {
            toggleSavedEvent(activeEvent.id);
        }
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeEventModal();
            closeSidebar();
        }
    });

    menuToggle.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        sidebarOverlay.classList.toggle("show");

        document.body.style.overflow = sidebar.classList.contains("open")
            ? "hidden"
            : "";
    });

    sidebarOverlay.addEventListener("click", closeSidebar);

    sidebar.querySelectorAll(".nav-link").forEach(link => {
        link.addEventListener("click", closeSidebar);
    });

    renderEvents();
});