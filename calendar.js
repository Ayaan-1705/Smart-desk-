document.addEventListener("DOMContentLoaded", function () {

    const monthYear = document.getElementById("month-year");
    const calendarDays = document.getElementById("calendar-days");
    const prevMonthBtn = document.getElementById("prev-month");
    const nextMonthBtn = document.getElementById("next-month");

    const selectedDateLabel = document.getElementById("selected-date");
    const eventList = document.getElementById("event-list");
    const eventForm = document.getElementById("event-form");
    const eventInput = document.getElementById("event-input");
    const status = document.getElementById("calendar-status");

    const today = new Date();

    let currentMonth = today.getMonth();
    let currentYear = today.getFullYear();

    let selectedDate = getDateKey(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const STORAGE_KEY = "myWebsiteCalendarEvents";

    let events = {};

    // Load saved events
    try {
        const savedEvents = localStorage.getItem(STORAGE_KEY);

        if (savedEvents) {
            const parsed = JSON.parse(savedEvents);

            if (
                parsed &&
                typeof parsed === "object" &&
                !Array.isArray(parsed)
            ) {
                events = parsed;
            }
        }
    } catch (error) {
        status.textContent =
            "Browser storage is unavailable.";
    }

    // Format date as YYYY-MM-DD
    function getDateKey(year, month, day) {
        return [
            year,
            String(month + 1).padStart(2, "0"),
            String(day).padStart(2, "0")
        ].join("-");
    }

    // Save events to browser storage
    function saveEvents() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(events)
            );

            status.textContent =
                "Events saved in this browser.";

        } catch (error) {
            status.textContent =
                "Unable to save events in browser storage.";
        }
    }

    // Generate calendar
    function renderCalendar() {
        calendarDays.replaceChildren();

        const firstDay = new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();

        const daysInMonth = new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();

        monthYear.textContent = new Date(
            currentYear,
            currentMonth,
            1
        ).toLocaleDateString("en-US", {
            month: "long",
            year: "numeric"
        });

        // Empty cells before the first day
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement("div");

            emptyCell.className = "calendar-day empty";
            emptyCell.setAttribute("aria-hidden", "true");

            calendarDays.appendChild(emptyCell);
        }

        // Create date buttons
        for (let day = 1; day <= daysInMonth; day++) {

            const dateKey = getDateKey(
                currentYear,
                currentMonth,
                day
            );

            const button = document.createElement("button");

            button.type = "button";
            button.className = "calendar-day";
            button.textContent = day;

            button.setAttribute(
                "aria-label",
                new Date(
                    currentYear,
                    currentMonth,
                    day
                ).toLocaleDateString("en-US", {
                    dateStyle: "full"
                })
            );

            // Highlight today
            if (
                currentYear === today.getFullYear() &&
                currentMonth === today.getMonth() &&
                day === today.getDate()
            ) {
                button.classList.add("today");
            }

            // Highlight selected date
            if (dateKey === selectedDate) {
                button.classList.add("selected");
                button.setAttribute("aria-pressed", "true");
            } else {
                button.setAttribute("aria-pressed", "false");
            }

            // Mark dates containing events
            if (
                Array.isArray(events[dateKey]) &&
                events[dateKey].length > 0
            ) {
                button.classList.add("has-event");
            }

            // Select date
            button.addEventListener("click", function () {
                selectedDate = dateKey;

                renderCalendar();
                renderEvents();
            });

            calendarDays.appendChild(button);
        }
    }

    // Display events for the selected date
    function renderEvents() {

        const parts = selectedDate.split("-").map(Number);

        selectedDateLabel.textContent = new Date(
            parts[0],
            parts[1] - 1,
            parts[2]
        ).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        });

        eventList.replaceChildren();

        const dayEvents = Array.isArray(events[selectedDate])
            ? events[selectedDate]
            : [];

        if (dayEvents.length === 0) {
            const item = document.createElement("li");

            item.textContent = "No events for this date.";

            eventList.appendChild(item);
            return;
        }

        dayEvents.forEach(function (eventName, index) {

            const item = document.createElement("li");
            const text = document.createElement("span");
            const deleteButton = document.createElement("button");

            text.textContent = eventName;

            deleteButton.type = "button";
            deleteButton.textContent = "Delete";

            deleteButton.setAttribute(
                "aria-label",
                "Delete event: " + eventName
            );

            // Delete event
            deleteButton.addEventListener("click", function () {

                events[selectedDate].splice(index, 1);

                if (events[selectedDate].length === 0) {
                    delete events[selectedDate];
                }

                saveEvents();
                renderCalendar();
                renderEvents();
            });

            item.appendChild(text);
            item.appendChild(deleteButton);

            eventList.appendChild(item);
        });
    }

    // Previous month
    prevMonthBtn.addEventListener("click", function () {

        currentMonth--;

        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }

        renderCalendar();
    });

    // Next month
    nextMonthBtn.addEventListener("click", function () {

        currentMonth++;

        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }

        renderCalendar();
    });

    // Add an event
    eventForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const eventName = eventInput.value.trim();

        if (!eventName) {
            return;
        }

        if (!Array.isArray(events[selectedDate])) {
            events[selectedDate] = [];
        }

        events[selectedDate].push(eventName);

        saveEvents();

        eventInput.value = "";

        renderCalendar();
        renderEvents();
    });

    // Initial rendering
    renderCalendar();
    renderEvents();

});