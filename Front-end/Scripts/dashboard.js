"use strict";

const sidebar = document.getElementById("sidebar");
const menuButton = document.getElementById("menuButton");
const sidebarOverlay = document.getElementById("sidebarOverlay");

const previousMonthButton = document.getElementById("previousMonth");
const nextMonthButton = document.getElementById("nextMonth");
const calendarDays = document.getElementById("calendarDays");

const notificationButton = document.getElementById("notificationButton");

const eventDates = [20, 22, 24, 27, 29];

let displayedYear = 2026;
let displayedMonth = 9;

const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

function openSidebar() {
    sidebar.classList.add("open");
    sidebarOverlay.classList.add("visible");
    menuButton.setAttribute("aria-expanded", "true");
}

function closeSidebar() {
    sidebar.classList.remove("open");
    sidebarOverlay.classList.remove("visible");
    menuButton.setAttribute("aria-expanded", "false");
}

menuButton.addEventListener("click", () => {
    if (sidebar.classList.contains("open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
});

sidebarOverlay.addEventListener("click", closeSidebar);

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeSidebar();
    }
});

sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeSidebar);
});

function renderCalendar() {
    calendarDays.innerHTML = "";

    const firstDay = new Date(
        displayedYear,
        displayedMonth,
        1
    ).getDay();

    const daysInMonth = new Date(
        displayedYear,
        displayedMonth + 1,
        0
    ).getDate();

    const today = new Date();

    const isCurrentMonth =
        today.getFullYear() === displayedYear &&
        today.getMonth() === displayedMonth;

    const heading = document.querySelector(".calendar-card .section-header h2");

    heading.textContent =
        `${monthNames[displayedMonth]} ${displayedYear}`;

    for (let i = 0; i < firstDay; i++) {
        const empty = document.createElement("span");
        empty.className = "calendar-day empty";
        calendarDays.appendChild(empty);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const button = document.createElement("button");

        button.type = "button";
        button.className = "calendar-day";
        button.textContent = day;
        button.setAttribute(
            "aria-label",
            `${monthNames[displayedMonth]} ${day}, ${displayedYear}`
        );

        if (isCurrentMonth && day === today.getDate()) {
            button.classList.add("today");
        }

        if (
            displayedYear === 2026 &&
            displayedMonth === 9 &&
            eventDates.includes(day)
        ) {
            button.classList.add("has-event");
        }

        button.addEventListener("click", () => {
            calendarDays.querySelectorAll(".selected").forEach((item) => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            const oldMessage = document.getElementById("selectedDateMessage");

            if (oldMessage) {
                oldMessage.remove();
            }

            const message = document.createElement("p");
            message.id = "selectedDateMessage";
            message.textContent =
                `Selected: ${monthNames[displayedMonth]} ${day}, ${displayedYear}`;
            message.style.cssText =
                "margin-top:12px;text-align:center;font-size:11px;color:#087fe7;";

            calendarDays.parentElement.appendChild(message);
        });

        calendarDays.appendChild(button);
    }
}

previousMonthButton.addEventListener("click", () => {
    displayedMonth--;

    if (displayedMonth < 0) {
        displayedMonth = 11;
        displayedYear--;
    }

    renderCalendar();
});

nextMonthButton.addEventListener("click", () => {
    displayedMonth++;

    if (displayedMonth > 11) {
        displayedMonth = 0;
        displayedYear++;
    }

    renderCalendar();
});

document.querySelectorAll(".save-event").forEach((button) => {
    button.addEventListener("click", () => {
        const isSaved = button.classList.toggle("saved");

        button.textContent = isSaved ? "★" : "☆";
        button.setAttribute("aria-pressed", String(isSaved));

        const savedCount = document.getElementById("savedEvents");
        const savedButtons = document.querySelectorAll(".save-event.saved");

        savedCount.textContent = 3 + savedButtons.length;
    });
});

notificationButton.addEventListener("click", () => {
    window.location.href = "notifications.html";
});

renderCalendar();