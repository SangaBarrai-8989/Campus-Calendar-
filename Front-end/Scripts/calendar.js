document.addEventListener("DOMContentLoaded", () => {
    const calendarGrid = document.getElementById("calendarGrid");
    const currentMonthLabel = document.getElementById("currentMonth");
    const selectedDateLabel = document.getElementById("selectedDateLabel");
    const selectedDateEvents = document.getElementById("selectedDateEvents");
    const upcomingEventsContainer = document.getElementById("upcomingEvents");
    const eventSearch = document.getElementById("eventSearch");
    const categoryFilter = document.getElementById("categoryFilter");

    const prevMonthButton = document.getElementById("prevMonth");
    const nextMonthButton = document.getElementById("nextMonth");
    const todayButton = document.getElementById("todayButton");

    const eventModal = document.getElementById("eventModal");
    const modalClose = document.getElementById("modalClose");
    const saveEventButton = document.getElementById("saveEventButton");

    const sidebar = document.getElementById("sidebar");
    const menuToggle = document.getElementById("menuToggle");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentYear = today.getFullYear();
    let currentMonth = today.getMonth();
    let selectedDate = new Date(today);
    let activeEvent = null;
    let searchTerm = "";
    let selectedCategory = "all";

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

    let savedEventIds = [];

    try {
        const stored = JSON.parse(localStorage.getItem("techspaceSavedEvents") || "[]");

        if (Array.isArray(stored)) {
            savedEventIds = stored;
        }
    } catch {
        savedEventIds = [];
    }

    const categoryNames = {
        academic: "Academic",
        workshop: "Workshop",
        social: "Social",
        sports: "Sports",
        career: "Career"
    };

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

    function getFilteredEvents() {
        return events.filter(event => {
            const matchesCategory =
                selectedCategory === "all" ||
                event.category === selectedCategory;

            const searchableText = [
                event.title,
                event.location,
                event.organizer,
                event.description,
                categoryNames[event.category]
            ].join(" ").toLowerCase();

            const matchesSearch = searchableText.includes(searchTerm);

            return matchesCategory && matchesSearch;
        });
    }

    function getEventsForDate(dateString) {
        return getFilteredEvents().filter(event => event.date === dateString);
    }

    function renderCalendar() {
        calendarGrid.innerHTML = "";

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);

        currentMonthLabel.textContent = firstDay.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

        const startingDay = firstDay.getDay();
        const daysInMonth = lastDay.getDate();

        const previousMonthLastDay = new Date(
            currentYear,
            currentMonth,
            0
        ).getDate();

        const totalCells = Math.ceil((startingDay + daysInMonth) / 7) * 7;

        for (let index = 0; index < totalCells; index++) {
            let dayNumber;
            let date;
            let isOtherMonth = false;

            if (index < startingDay) {
                dayNumber = previousMonthLastDay - startingDay + index + 1;

                date = new Date(
                    currentYear,
                    currentMonth - 1,
                    dayNumber
                );

                isOtherMonth = true;
            } else if (index >= startingDay + daysInMonth) {
                dayNumber = index - startingDay - daysInMonth + 1;

                date = new Date(
                    currentYear,
                    currentMonth + 1,
                    dayNumber
                );

                isOtherMonth = true;
            } else {
                dayNumber = index - startingDay + 1;

                date = new Date(
                    currentYear,
                    currentMonth,
                    dayNumber
                );
            }

            const dateString = dateToISO(date);
            const dayEvents = getEventsForDate(dateString);

            const dayCell = document.createElement("button");

            dayCell.type = "button";
            dayCell.className = "calendar-day";

            if (isOtherMonth) {
                dayCell.classList.add("other-month");
            }

            if (dateString === dateToISO(today)) {
                dayCell.classList.add("today");
            }

            if (dateString === dateToISO(selectedDate)) {
                dayCell.classList.add("selected");
            }

            dayCell.setAttribute("aria-label", formatDate(dateString));

            const numberElement = document.createElement("span");
            numberElement.className = "day-number";
            numberElement.textContent = dayNumber;

            const eventContainer = document.createElement("div");
            eventContainer.className = "day-events";

            dayEvents.slice(0, 2).forEach(event => {
                const eventElement = document.createElement("span");

                eventElement.className = `day-event ${event.category}`;
                eventElement.textContent = event.title;
                eventElement.title = event.title;

                eventContainer.appendChild(eventElement);
            });

            if (dayEvents.length > 2) {
                const moreElement = document.createElement("span");

                moreElement.className = "more-events";
                moreElement.textContent = `+${dayEvents.length - 2} more`;

                eventContainer.appendChild(moreElement);
            }

            dayCell.append(numberElement, eventContainer);

            dayCell.addEventListener("click", () => {
                selectedDate = new Date(date);

                if (
                    date.getMonth() !== currentMonth ||
                    date.getFullYear() !== currentYear
                ) {
                    currentMonth = date.getMonth();
                    currentYear = date.getFullYear();
                }

                renderCalendar();
                renderSelectedDateEvents();
            });

            calendarGrid.appendChild(dayCell);
        }

        renderUpcomingEvents();
    }

    function createEventListItem(event, showDate = false) {
        const item = document.createElement("div");
        item.className = "event-list-item";

        const dateBox = document.createElement("div");
        dateBox.className = "event-date-box";

        const eventDate = parseLocalDate(event.date);

        const day = document.createElement("strong");
        day.textContent = eventDate.getDate();

        const month = document.createElement("span");
        month.textContent = eventDate.toLocaleDateString("en-US", {
            month: "short"
        });

        dateBox.append(day, month);

        const info = document.createElement("div");
        info.className = "event-list-info";

        const title = document.createElement("h4");
        title.textContent = event.title;

        const time = document.createElement("p");
        time.innerHTML = '<i class="fa-regular fa-clock"></i>';

        const timeText = document.createElement("span");
        timeText.textContent = event.time;

        time.appendChild(timeText);

        const location = document.createElement("p");
        location.innerHTML = '<i class="fa-solid fa-location-dot"></i>';

        const locationText = document.createElement("span");
        locationText.textContent = event.location;

        location.appendChild(locationText);

        const category = document.createElement("span");
        category.className = `event-category-label ${event.category}`;
        category.textContent = categoryNames[event.category];

        info.append(title);

        if (showDate) {
            const dateText = document.createElement("p");

            dateText.innerHTML = '<i class="fa-regular fa-calendar"></i>';

            const formattedDate = document.createElement("span");
            formattedDate.textContent = formatDate(event.date, {
                month: "short",
                day: "numeric"
            });

            dateText.appendChild(formattedDate);
            info.appendChild(dateText);
        }

        info.append(time, location, category);
        item.append(dateBox, info);

        item.tabIndex = 0;
        item.setAttribute("role", "button");
        item.setAttribute("aria-label", `View ${event.title}`);

        item.addEventListener("click", () => openEventModal(event));

        item.addEventListener("keydown", eventKey => {
            if (eventKey.key === "Enter" || eventKey.key === " ") {
                eventKey.preventDefault();
                openEventModal(event);
            }
        });

        return item;
    }

    function renderSelectedDateEvents() {
        const dateString = dateToISO(selectedDate);

        selectedDateLabel.textContent = formatDate(dateString);

        selectedDateEvents.innerHTML = "";

        const dayEvents = getEventsForDate(dateString);

        if (dayEvents.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";

            const icon = document.createElement("i");
            icon.className = "fa-regular fa-calendar";

            const message = document.createElement("p");
            message.textContent = searchTerm || selectedCategory !== "all"
                ? "No matching events on this date."
                : "No events scheduled for this date.";

            empty.append(icon, message);
            selectedDateEvents.appendChild(empty);

            return;
        }

        dayEvents.forEach(event => {
            selectedDateEvents.appendChild(
                createEventListItem(event)
            );
        });
    }

    function renderUpcomingEvents() {
        upcomingEventsContainer.innerHTML = "";

        const upcoming = getFilteredEvents()
            .filter(event => event.date >= dateToISO(today))
            .sort((a, b) => a.date.localeCompare(b.date))
            .slice(0, 4);

        if (upcoming.length === 0) {
            const empty = document.createElement("div");
            empty.className = "empty-state";

            const icon = document.createElement("i");
            icon.className = "fa-regular fa-calendar";

            const message = document.createElement("p");
            message.textContent = "No upcoming events found.";

            empty.append(icon, message);
            upcomingEventsContainer.appendChild(empty);

            return;
        }

        upcoming.forEach(event => {
            upcomingEventsContainer.appendChild(
                createEventListItem(event, true)
            );
        });
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

        updateSaveButton();

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

    function updateSaveButton() {
        if (!activeEvent) {
            return;
        }

        const isSaved = savedEventIds.includes(activeEvent.id);

        saveEventButton.innerHTML = isSaved
            ? '<i class="fa-solid fa-bookmark"></i> Saved'
            : '<i class="fa-regular fa-bookmark"></i> Save Event';

        saveEventButton.style.background = isSaved
            ? "#169b74"
            : "";
    }

    function saveActiveEvent() {
        if (!activeEvent) {
            return;
        }

        const isSaved = savedEventIds.includes(activeEvent.id);

        if (isSaved) {
            savedEventIds = savedEventIds.filter(
                id => id !== activeEvent.id
            );
        } else {
            savedEventIds.push(activeEvent.id);
        }

        try {
            localStorage.setItem(
                "techspaceSavedEvents",
                JSON.stringify(savedEventIds)
            );
        } catch {
            alert("Unable to save this event in your browser.");
            return;
        }

        updateSaveButton();
    }

    function changeMonth(amount) {
        currentMonth += amount;

        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        } else if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        renderCalendar();
    }

    function applyFilters() {
        searchTerm = eventSearch.value.trim().toLowerCase();
        selectedCategory = categoryFilter.value;

        renderCalendar();
        renderSelectedDateEvents();
    }

    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
        document.body.style.overflow = "";
    }

    prevMonthButton.addEventListener("click", () => {
        changeMonth(-1);
    });

    nextMonthButton.addEventListener("click", () => {
        changeMonth(1);
    });

    todayButton.addEventListener("click", () => {
        currentYear = today.getFullYear();
        currentMonth = today.getMonth();
        selectedDate = new Date(today);

        renderCalendar();
        renderSelectedDateEvents();
    });

    eventSearch.addEventListener("input", applyFilters);
    categoryFilter.addEventListener("change", applyFilters);

    modalClose.addEventListener("click", closeEventModal);

    eventModal.addEventListener("click", event => {
        if (event.target === eventModal) {
            closeEventModal();
        }
    });

    saveEventButton.addEventListener("click", saveActiveEvent);

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

    renderCalendar();
    renderSelectedDateEvents();
});