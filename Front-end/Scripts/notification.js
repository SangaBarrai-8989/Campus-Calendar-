document.addEventListener("DOMContentLoaded", function () {
    const notificationList = document.getElementById("notificationList");
    const emptyState = document.getElementById("emptyState");
    const totalCount = document.getElementById("totalCount");
    const unreadCount = document.getElementById("unreadCount");
    const readCount = document.getElementById("readCount");
    const sidebarBadge = document.getElementById("sidebarBadge");
    const categoryFilter = document.getElementById("categoryFilter");
    const markAllReadBtn = document.getElementById("markAllRead");
    const clearReadBtn = document.getElementById("clearRead");
    const toast = document.getElementById("toast");

    let activeFilter = "all";
    let toastTimer;

    const defaultNotifications = [
        {
            id: 1,
            title: "New Workshop Available",
            message: "Registration is now open for the Web Development Workshop. Reserve your place before registration closes.",
            category: "event",
            time: "2026-10-18T08:30:00",
            read: false
        },
        {
            id: 2,
            title: "Campus Announcement",
            message: "The university library will have extended opening hours during the upcoming examination period.",
            category: "announcement",
            time: "2026-10-17T14:00:00",
            read: false
        },
        {
            id: 3,
            title: "Event Reminder",
            message: "AI and Future Technology seminar is coming up. Check your event schedule for the details.",
            category: "reminder",
            time: "2026-10-17T09:15:00",
            read: false
        },
        {
            id: 4,
            title: "Profile Updated",
            message: "Your account settings have been updated successfully.",
            category: "system",
            time: "2026-10-15T11:20:00",
            read: true
        },
        {
            id: 5,
            title: "Student Community Meeting",
            message: "The next student community meeting will take place on campus. Review the Events page for more information.",
            category: "event",
            time: "2026-10-14T10:00:00",
            read: true
        },
        {
            id: 6,
            title: "Important Campus News",
            message: "New campus activities and student programs have been added to the events calendar.",
            category: "announcement",
            time: "2026-10-12T13:45:00",
            read: true
        }
    ];

    let notifications = loadNotifications();

    function loadNotifications() {
        try {
            const stored = localStorage.getItem("techSpaceNotifications");

            if (stored !== null) {
                const parsed = JSON.parse(stored);

                if (Array.isArray(parsed)) {
                    return parsed;
                }
            }
        } catch (error) {
            console.error("Could not load notifications:", error);
        }

        return [...defaultNotifications];
    }

    function saveNotifications() {
        try {
            localStorage.setItem(
                "techSpaceNotifications",
                JSON.stringify(notifications)
            );
        } catch (error) {
            showToast("Could not save changes in your browser.");
        }
    }

    function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");

        clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            toast.classList.remove("show");
        }, 2500);
    }

    function updateCounts() {
        const unread = notifications.filter(item => !item.read).length;
        const read = notifications.length - unread;

        totalCount.textContent = notifications.length;
        unreadCount.textContent = unread;
        readCount.textContent = read;

        sidebarBadge.textContent = unread;
        sidebarBadge.style.display = unread > 0 ? "inline-block" : "none";
    }

    function getCategoryIcon(category) {
        const icons = {
            event: "fas fa-calendar-check",
            announcement: "fas fa-bullhorn",
            reminder: "fas fa-clock",
            system: "fas fa-cog"
        };

        return icons[category] || "fas fa-bell";
    }

    function formatNotificationTime(timeString) {
        const date = new Date(timeString);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        const now = new Date();
        const difference = now.getTime() - date.getTime();

        if (difference >= 0) {
            const minutes = Math.floor(difference / 60000);

            if (minutes < 1) {
                return "Just now";
            }

            if (minutes < 60) {
                return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
            }

            const hours = Math.floor(minutes / 60);

            if (hours < 24) {
                return `${hours} hour${hours === 1 ? "" : "s"} ago`;
            }

            const days = Math.floor(hours / 24);

            if (days < 7) {
                return `${days} day${days === 1 ? "" : "s"} ago`;
            }
        }

        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric"
        });
    }

    function getFilteredNotifications() {
        const selectedCategory = categoryFilter.value;

        return notifications
            .filter(notification => {
                if (activeFilter === "unread" && notification.read) {
                    return false;
                }

                if (activeFilter === "read" && !notification.read) {
                    return false;
                }

                if (
                    selectedCategory !== "all" &&
                    notification.category !== selectedCategory
                ) {
                    return false;
                }

                return true;
            })
            .sort((a, b) => {
                return new Date(b.time) - new Date(a.time);
            });
    }

    function renderNotifications() {
        notificationList.innerHTML = "";

        const filteredNotifications = getFilteredNotifications();

        if (filteredNotifications.length === 0) {
            emptyState.classList.remove("hidden");
        } else {
            emptyState.classList.add("hidden");
        }

        filteredNotifications.forEach(notification => {
            const item = document.createElement("article");

            item.className = "notification-item";

            if (!notification.read) {
                item.classList.add("unread");
            }

            const icon = document.createElement("div");
            icon.className = `notification-icon ${notification.category}`;

            const iconElement = document.createElement("i");
            iconElement.className = getCategoryIcon(notification.category);
            icon.appendChild(iconElement);

            const content = document.createElement("div");
            content.className = "notification-content";

            const titleRow = document.createElement("div");
            titleRow.className = "notification-title-row";

            const title = document.createElement("h3");
            title.textContent = notification.title;

            titleRow.appendChild(title);

            if (!notification.read) {
                const dot = document.createElement("span");
                dot.className = "unread-dot";
                dot.title = "Unread";
                titleRow.appendChild(dot);
            }

            const message = document.createElement("p");
            message.textContent = notification.message;

            const time = document.createElement("span");
            time.className = "notification-time";
            time.textContent = formatNotificationTime(notification.time);

            content.append(titleRow, message, time);

            const actions = document.createElement("div");
            actions.className = "notification-actions";

            const readButton = document.createElement("button");
            readButton.type = "button";
            readButton.className = "action-btn";
            readButton.title = notification.read
                ? "Mark as unread"
                : "Mark as read";

            readButton.setAttribute(
                "aria-label",
                notification.read ? "Mark as unread" : "Mark as read"
            );

            const readIcon = document.createElement("i");
            readIcon.className = notification.read
                ? "far fa-envelope"
                : "fas fa-envelope-open";

            readButton.appendChild(readIcon);

            readButton.addEventListener("click", function () {
                toggleRead(notification.id);
            });

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.className = "action-btn delete";
            deleteButton.title = "Delete notification";
            deleteButton.setAttribute("aria-label", "Delete notification");

            const deleteIcon = document.createElement("i");
            deleteIcon.className = "fas fa-trash-alt";

            deleteButton.appendChild(deleteIcon);

            deleteButton.addEventListener("click", function () {
                deleteNotification(notification.id);
            });

            actions.append(readButton, deleteButton);
            item.append(icon, content, actions);

            notificationList.appendChild(item);
        });

        updateCounts();
    }

    function toggleRead(id) {
        const notification = notifications.find(item => item.id === id);

        if (!notification) {
            return;
        }

        notification.read = !notification.read;

        saveNotifications();
        renderNotifications();

        showToast(
            notification.read
                ? "Notification marked as read."
                : "Notification marked as unread."
        );
    }

    function deleteNotification(id) {
        notifications = notifications.filter(item => item.id !== id);

        saveNotifications();
        renderNotifications();

        showToast("Notification deleted.");
    }

    document.querySelectorAll(".filter-tab").forEach(button => {
        button.addEventListener("click", function () {
            document.querySelectorAll(".filter-tab").forEach(tab => {
                tab.classList.remove("active");
            });

            button.classList.add("active");
            activeFilter = button.dataset.filter;

            renderNotifications();
        });
    });

    categoryFilter.addEventListener("change", renderNotifications);

    markAllReadBtn.addEventListener("click", function () {
        if (notifications.every(item => item.read)) {
            showToast("All notifications are already read.");
            return;
        }

        notifications = notifications.map(item => ({
            ...item,
            read: true
        }));

        saveNotifications();
        renderNotifications();

        showToast("All notifications marked as read.");
    });

    clearReadBtn.addEventListener("click", function () {
        const readNotifications = notifications.filter(item => item.read);

        if (readNotifications.length === 0) {
            showToast("There are no read notifications to clear.");
            return;
        }

        const confirmed = confirm(
            `Delete all ${readNotifications.length} read notifications?`
        );

        if (!confirmed) {
            return;
        }

        notifications = notifications.filter(item => !item.read);

        saveNotifications();
        renderNotifications();

        showToast("Read notifications cleared.");
    });

    const storedUser = localStorage.getItem("techSpaceUser");

    if (storedUser) {
        try {
            const user = JSON.parse(storedUser);

            document.getElementById("userName").textContent =
                user.name || user.fullName || "Student";

            const firstLetter = (
                user.name || user.fullName || "S"
            ).trim().charAt(0).toUpperCase();

            document.querySelector(".avatar").textContent = firstLetter;
        } catch (error) {
            console.warn("User information could not be loaded.");
        }
    }

    document.getElementById("logoutBtn").addEventListener("click", function (event) {
        const confirmed = confirm("Are you sure you want to log out?");

        if (!confirmed) {
            event.preventDefault();
        }
    });

    renderNotifications();
});