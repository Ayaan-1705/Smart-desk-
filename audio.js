// ========================================
// FOCUS MODE AUDIO
// ========================================

const audioSelect =
    document.getElementById("audioSelect");

const audioButton =
    document.getElementById("audioButton");


// Create audio object

let focusAudio = new Audio();

let audioPlaying = false;


// ========================================
// SELECT SOUND
// ========================================

audioSelect.addEventListener("change", function () {

    const selectedSound = audioSelect.value;


    // Stop current audio

    focusAudio.pause();

    focusAudio.currentTime = 0;

    audioPlaying = false;

    audioButton.textContent = "▶ Play Sound";


    // No sound

    if (selectedSound === "none") {

        focusAudio.src = "";

        return;
    }


    // Rain

    if (selectedSound === "rain") {

        focusAudio.src = "audio/rain.mp3";

    }


    // Forest

    else if (selectedSound === "forest") {

        focusAudio.src = "audio/forest.mp3";

    }


    // Lo-fi

    else if (selectedSound === "lofi") {

        focusAudio.src = "audio/lofi.mp3";

    }

    // Theeta
    else if (selectedSound === "Theeta") {

        focusAudio.src = "audio/Theeta.mp3";

    }

});


// ========================================
// PLAY / PAUSE
// ========================================

audioButton.addEventListener("click", function () {

    if (!focusAudio.src) {

        alert("Please select a sound first.");

        return;
    }


    if (audioPlaying) {

        focusAudio.pause();

        audioPlaying = false;

        audioButton.textContent = "▶ Play Sound";

    }

    else {

        focusAudio.loop = true;

        focusAudio.play();

        audioPlaying = true;

        audioButton.textContent = "⏸ Pause Sound";

    }

});