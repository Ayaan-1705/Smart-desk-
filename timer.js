// ========================================
// POMODORO SETTINGS
// ========================================

// Focus duration = 25 minutes
let focusDuration = 25 * 60;

// Break duration = 5 minutes
let breakDuration = 5 * 60;


// ========================================
// TIMER VARIABLES
// ========================================

// Start with focus time
let timeLeft = focusDuration;

// Store the interval
let timerInterval = null;

// Is the timer currently running?
let isRunning = false;

// Current mode
let currentMode = "focus";

// Number of completed Pomodoros
let completedPomodoros = 0;

// Total number of Pomodoros
let totalPomodoros = 0;

let totalDuration = 0;

// ========================================
// GET HTML ELEMENTS
// ========================================

const timerDisplay = document.getElementById("pomodoroTimer");

const modeDisplay = document.getElementById("pomodoroMode");

const startButton = document.getElementById("startButton");

const pauseButton = document.getElementById("pauseButton");

const resetButton = document.getElementById("resetButton");

const completedCount =
    document.getElementById("completedCount");

const dailycc = 
        document.getElementById("daily-count");

const focusTime = document.getElementById("focus-time");

const focusInput =
    document.getElementById("focusInput");

const breakInput =
    document.getElementById("breakInput");
    
    // input focus and break timer

    function updateSettings() {

    const focusMinutes =
        Number(focusInput.value);

    const breakMinutes =
        Number(breakInput.value);


    if (focusMinutes < 1 || breakMinutes < 1) {

        alert("Duration must be at least 1 minute.");

        return false;
    }


    focusDuration = focusMinutes * 60;

    breakDuration = breakMinutes * 60;

    return true;
}

// ========================================
// FORMAT TIME
// ========================================

function formatTime(seconds) {

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = seconds % 60;

    const formattedSeconds =
        remainingSeconds < 10
            ? "0" + remainingSeconds
            : remainingSeconds;

    return minutes + ":" + formattedSeconds;
}


// ========================================
// UPDATE TIMER DISPLAY
// ========================================

function updateTimerDisplay() {

    timerDisplay.textContent = formatTime(timeLeft);

}


// ========================================
// START TIMER
// ========================================

function startTimer() {

    // Don't create another timer
    // if one is already running
    if (isRunning) {
        return;
    }

    isRunning = true;

    timerInterval = setInterval(function () {

        timeLeft--;

        totalDuration++;

        updateTimerDisplay();


        // ========================================
        // TIMER FINISHED
        // ========================================

        if (timeLeft <= 0) {

            clearInterval(timerInterval);

            timerInterval = null;

            isRunning = false;


            // ========================================
            // FOCUS FINISHED
            // ========================================

            if (currentMode === "focus") {

                completedPomodoros++;

                completedCount.textContent =completedPomodoros;

                totalPomodoros++;
                
                dailycc.textContent = totalPomodoros;

                alert("Focus session completed! ☕ Time for a break.");
                 const min = Math.floor(totalDuration / 60);
        const sec = totalDuration % 60;

    focusTime.textContent = `${min} min ${sec} sec`;
                startBreak();

            }


            // ========================================
            // BREAK FINISHED
            // ========================================

            else {

                alert("Break finished! 🍅 Time to focus.");

                startFocus();

            }

        }

    }, 1000);
}


// ========================================
// START BREAK
// ========================================

function startBreak() {

    currentMode = "break";

    modeDisplay.textContent = "Break Time ☕";

    timeLeft = breakDuration;

    updateTimerDisplay();

    // Automatically start break
    startTimer();

}


// ========================================
// START FOCUS
// ========================================

function startFocus() {

    currentMode = "focus";

    modeDisplay.textContent = "Focus Time 🎯";

    timeLeft = focusDuration;

    updateTimerDisplay();

    // Automatically start focus
    startTimer();

}


// ========================================
// PAUSE TIMER
// ========================================

function pauseTimer() {

    if (!isRunning) {
        return;
    }

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

}


// ========================================
// RESET TIMER
// ========================================

function resetTimer() {

    clearInterval(timerInterval);

    timerInterval = null;

    isRunning = false;

    currentMode = "focus";

    modeDisplay.textContent = "Focus Time 🎯";


    // Read the new settings

    const settingsValid = updateSettings();

    if (!settingsValid) {
        return;
    }


    timeLeft = focusDuration;

    updateTimerDisplay();


    completedPomodoros = 0;

    completedCount.textContent =
        completedPomodoros;

         const min = Math.floor(totalDuration / 60);
        const sec = totalDuration % 60;

    focusTime.textContent = `${min} min ${sec} sec`;
}

// ========================================
// BUTTON EVENTS
// ========================================


// START BUTTON

startButton.addEventListener("click", function () {

    if (!isRunning && currentMode === "focus") {

        updateSettings();

    }

    startTimer();

});

// PAUSE BUTTON

pauseButton.addEventListener("click", function () {

    pauseTimer();

});


// RESET BUTTON

resetButton.addEventListener("click", function () {

    resetTimer();

});


// ========================================
// INITIAL DISPLAY
// ========================================

updateTimerDisplay();