document.addEventListener("DOMContentLoaded", function () {
    const totalEventsElement = document.getElementById("totalEvents");
    const upcomingEventsElement = document.getElementById("upcomingEvents");
    const savedEventsElement = document.getElementById("savedEvents");
    const todayEventsElement = document.getElementById("todayEvents");
    const eventsTableBody = document.getElementById("eventsTableBody");

    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");
    const logoutBtn = document.getElementById("logoutBtn");

    // Display current date
    const currentDateElement = document.getElementById("currentDate");

    currentDateElement.textContent = new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    // Read data safely from localStorage
    function readStorage(key) {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch (error) {
            console.error("Unable to read " + key, error);
            return [];
        }
    }

    // Read created events and saved events
    const createdEvents = readStorage("techSpaceCreatedEvents");
    const savedEvents = readStorage("techSpaceSavedEvents");

    // Use created events as the admin event list
    const events = createdEvents;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    function getEventDate(event) {
        const dateValue = event.date || event.eventDate || "";
        if (!dateValue) return null;

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return null;
        }

        date.setHours(0, 0, 0, 0);
        return date;
    }

    function formatDate(event) {
        const date = getEventDate(event);

        if (!date) {
            return "Not specified";
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function getEventName(event) {
        return event.title || event.name || event.eventName || "Untitled Event";
    }

    function getEventLocation(event) {
        return event.location || event.venue || "Not specified";
    }

    function getStatus(event) {
        const date = getEventDate(event);

        if (!date) {
            return {
                label: "Unscheduled",
                className: "past"
            };
        }

        if (date.getTime() === today.getTime()) {
            return {
                label: "Today",
                className: "today"
            };
        }

        if (date > today) {
            return {
                label: "Upcoming",
                className: "upcoming"
            };
        }

        return {
            label: "Past",
            className: "past"
        };
    }

    // Update statistics
    const upcomingEvents = events.filter(function (event) {
        const date = getEventDate(event);
        return date && date >= today;
    });

    const todayEvents = events.filter(function (event) {
        const date = getEventDate(event);
        return date && date.getTime() === today.getTime();
    });

    totalEventsElement.textContent = events.length;
    upcomingEventsElement.textContent = upcomingEvents.length;
    savedEventsElement.textContent = savedEvents.length;
    todayEventsElement.textContent = todayEvents.length;

    // Render event table
    function renderEvents() {
        eventsTableBody.innerHTML = "";

        if (events.length === 0) {
            eventsTableBody.innerHTML = `
                <tr>
                    <td colspan="4" class="empty-state">
                        <i class="fa-regular fa-calendar-xmark"></i>
                        <p>No events found.</p>
                        <a href="create-event.html">Create your first event</a>
                    </td>
                </tr>
            `;
            return;
        }

        const sortedEvents = [...events].sort(function (a, b) {
            const dateA = getEventDate(a);
            const dateB = getEventDate(b);

            if (!dateA) return 1;
            if (!dateB) return -1;

            return dateA - dateB;
        });

        sortedEvents.slice(0, 8).forEach(function (event) {
            const status = getStatus(event);
            const row = document.createElement("tr");

            const nameCell = document.createElement("td");
            nameCell.className = "event-name";
            nameCell.textContent = getEventName(event);

            const dateCell = document.createElement("td");
            dateCell.textContent = formatDate(event);

            const locationCell = document.createElement("td");
            locationCell.textContent = getEventLocation(event);

            const statusCell = document.createElement("td");
            const statusBadge = document.createElement("span");

            statusBadge.className = "status " + status.className;
            statusBadge.textContent = status.label;

            statusCell.appendChild(statusBadge);

            row.appendChild(nameCell);
            row.appendChild(dateCell);
            row.appendChild(locationCell);
            row.appendChild(statusCell);

            eventsTableBody.appendChild(row);
        });
    }

    renderEvents();

    // Mobile sidebar
    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");
    }

    menuToggle.addEventListener("click", function () {
        sidebar.classList.toggle("open");
        sidebarOverlay.classList.toggle("show");
    });

    sidebarOverlay.addEventListener("click", closeSidebar);

    // Demo logout: navigate to login page
    logoutBtn.addEventListener("click", function (event) {
        const confirmLogout = window.confirm("Do you want to leave the admin dashboard?");

        if (!confirmLogout) {
            event.preventDefault();
        }
    });
});