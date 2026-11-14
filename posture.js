// ========================================
// POSTURE CORRECTION
// ========================================
import {
    PoseLandmarker,
    FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

// ========================================
// HTML ELEMENTS
// ========================================

const camera =
    document.getElementById("camera");

const cameraButton =
    document.getElementById("cameraButton");

const postureStatus =
    document.getElementById("postureStatus");

const poseCanvas =
    document.getElementById("poseCanvas");

const canvasContext =
    poseCanvas.getContext("2d");

// ========================================
// VARIABLES
// ========================================

let cameraStream = null;

let poseLandmarker = null;

let lastVideoTime = -1;

let poseDetectionRunning = false;

// ========================================
// POSTURE WARNING SOUND
// ========================================

let warningAudio = null;

let lastWarningTime = 0;

const WARNING_COOLDOWN = 5000; // 5 seconds

// ========================================
// CREATE MEDIAPIPE POSE LANDMARKER
// ========================================

async function createPoseLandmarker() {

    try {

        // Load MediaPipe vision tasks

const vision =
    await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
    );

        // Create Pose Landmarker

        poseLandmarker =
            await PoseLandmarker.createFromOptions(

                vision,

                {

                    baseOptions: {

                        modelAssetPath:
                            "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",

                        delegate: "GPU"

                    },


                    runningMode: "VIDEO",


                    numPoses: 1

                }

            );


        console.log(
            "Pose Landmarker loaded!"
        );


        postureStatus.textContent =
            "Ready to start camera";


    }

    catch (error) {

        console.error(
            "Could not load Pose Landmarker:",
            error
        );


        postureStatus.textContent =
            "Pose detector could not load.";

    }

}


// ========================================
// START CAMERA
// ========================================

async function startCamera() {

    try {

        cameraStream =
            await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
            });


        camera.srcObject =
            cameraStream;


        // Prepare warning sound

        warningAudio =
            new Audio("posewarning/audio1.mp3");

        warningAudio.preload = "auto";


        postureStatus.textContent =
            "Camera running";


        cameraButton.textContent =
            "Stop Camera";


        poseDetectionRunning = true;

        detectPose();

    }

    catch (error) {

        console.error(
            "Camera error:",
            error
        );

    }

}

// ========================================
// STOP CAMERA
// ========================================

function stopCamera() {

    // Stop pose detection loop

    poseDetectionRunning =
        false;


    // Stop camera tracks

    if (cameraStream) {

        cameraStream
            .getTracks()
            .forEach(function(track) {

                track.stop();

            });


        cameraStream = null;

    }


    // Remove video stream

    camera.srcObject = null;


    // Clear canvas

    canvasContext.clearRect(

        0,

        0,

        poseCanvas.width,

        poseCanvas.height

    );


    // Update UI

    postureStatus.textContent =
        "Camera stopped";


    cameraButton.textContent =
        "Start Camera";


    lastVideoTime = -1;

}


// ========================================
// START / STOP BUTTON
// ========================================

cameraButton.addEventListener(
    "click",

    function() {

        if (cameraStream) {

            stopCamera();

        }

        else {

            startCamera();

        }

    }

);


// ========================================
// DETECT POSE
// ========================================

function detectPose() {

    console.log("detectPose is running");

    // Make sure MediaPipe is ready

    if (!poseLandmarker) {

        return;

    }


    // Make sure camera is running

    if (!cameraStream) {

        return;

    }


    // Wait until video has enough data

    if (camera.readyState < 2) {

        if (poseDetectionRunning) {

            requestAnimationFrame(
                detectPose
            );

        }

        return;

    }


    // Detect only when a new frame
    // is available

    if (
        camera.currentTime !==
        lastVideoTime
    ) {


        const startTimeMs =
            performance.now();


        // Run pose detection

        const results =
            poseLandmarker.detectForVideo(

                camera,

                startTimeMs

            );


        // Draw landmarks

        drawPose(results);


        lastVideoTime =
            camera.currentTime;

    }


    // Continue detection

    if (poseDetectionRunning) {

        requestAnimationFrame(
            detectPose
        );

    }

}


// ========================================
// DRAW POSE LANDMARKS
// ========================================

// ========================================
// DRAW POSE + ANALYZE POSTURE
// ========================================

function drawPose(results) {

    // Match canvas to camera resolution

    poseCanvas.width =
        camera.videoWidth;

    poseCanvas.height =
        camera.videoHeight;


    // Clear previous frame

    canvasContext.clearRect(
        0,
        0,
        poseCanvas.width,
        poseCanvas.height
    );


    // Check whether a person was detected

    if (
        !results.landmarks ||
        results.landmarks.length === 0
    ) {

        postureStatus.textContent =
            "No person detected";

        return;

    }


    // Get first person

    const landmarks =
        results.landmarks[0];


    // ====================================
    // DRAW LANDMARKS
    // ====================================

    for (
        let i = 0;
        i < landmarks.length;
        i++
    ) {

        const landmark =
            landmarks[i];


        const x =
            landmark.x *
            poseCanvas.width;


        const y =
            landmark.y *
            poseCanvas.height;


        canvasContext.beginPath();


        canvasContext.arc(
            x,
            y,
            5,
            0,
            2 * Math.PI
        );


        canvasContext.fill();

    }


    // ====================================
    // ANALYZE POSTURE
    // ====================================

    analyzePosture(landmarks);

}

// ========================================
// LOAD POSE MODEL
// ========================================

createPoseLandmarker();
// ========================================
// CALCULATE ANGLE
// ========================================

function calculateAngle(pointA, pointB, pointC) {

    // Vector from B to A
    const BA = {
        x: pointA.x - pointB.x,
        y: pointA.y - pointB.y
    };


    // Vector from B to C
    const BC = {
        x: pointC.x - pointB.x,
        y: pointC.y - pointB.y
    };


    // Dot product
    const dotProduct =
        (BA.x * BC.x) +
        (BA.y * BC.y);


    // Magnitudes
    const magnitudeBA =
        Math.sqrt(
            BA.x * BA.x +
            BA.y * BA.y
        );


    const magnitudeBC =
        Math.sqrt(
            BC.x * BC.x +
            BC.y * BC.y
        );


    // Prevent division by zero
    if (
        magnitudeBA === 0 ||
        magnitudeBC === 0
    ) {

        return null;

    }


    // Calculate angle
    let cosine =
        dotProduct /
        (magnitudeBA * magnitudeBC);


    // Keep value within valid range
    cosine =
        Math.max(
            -1,
            Math.min(1, cosine)
        );


    const angle =
        Math.acos(cosine) *
        (180 / Math.PI);


    return angle;
}

// ========================================
// POSTURE LANDMARK INDICES
// ========================================

const LEFT_EAR = 7;
const RIGHT_EAR = 8;

const LEFT_SHOULDER = 11;
const RIGHT_SHOULDER = 12;

const LEFT_HIP = 23;
const RIGHT_HIP = 24;

// ========================================
// ANALYZE POSTURE
// ========================================

function analyzePosture(landmarks) {

    // Get left-side landmarks

    const leftEar =
        landmarks[LEFT_EAR];

    const leftShoulder =
        landmarks[LEFT_SHOULDER];

    const leftHip =
        landmarks[LEFT_HIP];


    // Get right-side landmarks

    const rightEar =
        landmarks[RIGHT_EAR];

    const rightShoulder =
        landmarks[RIGHT_SHOULDER];

    const rightHip =
        landmarks[RIGHT_HIP];


    // Calculate left-side angle

    const leftAngle =
        calculateAngle(
            leftEar,
            leftShoulder,
            leftHip
        );


    // Calculate right-side angle

    const rightAngle =
        calculateAngle(
            rightEar,
            rightShoulder,
            rightHip
        );


    // Print angles for testing

    console.log(
        "Left angle:",
        leftAngle
    );

    console.log(
        "Right angle:",
        rightAngle
    );


    // Choose the larger angle
    // for our initial simple test

    let postureAngle =
        Math.max(
            leftAngle ?? 0,
            rightAngle ?? 0
        );


    console.log(
        "Posture angle:",
        postureAngle
    );


    // ====================================
    // POSTURE THRESHOLD
    // ====================================

    const GOOD_POSTURE_ANGLE = 150;


    if (
        postureAngle >=
        GOOD_POSTURE_ANGLE
    ) {

        postureStatus.textContent =
            "✅ Good posture";

    }

    else {

        postureStatus.textContent =
            "⚠️ Adjust your posture";

        playPostureWarning();
         
    }

}

// ========================================
// PLAY POSTURE WARNING
// ========================================

function playPostureWarning() {

    const currentTime =
        Date.now();


    if (
        currentTime - lastWarningTime <
        WARNING_COOLDOWN
    ) {

        return;

    }


    lastWarningTime =
        currentTime;


    if (!warningAudio) {
        return;
    }


    warningAudio.currentTime = 0;


    warningAudio.play()
        .catch(function(error) {

            console.error(
                "Warning sound failed:",
                error
            );

        });

}
function unlockWarningAudio() {

    warningAudio
        .play()
        .then(function() {

            warningAudio.pause();

            warningAudio.currentTime = 0;

        })
        .catch(function() {

            console.log(
                "Audio permission not granted yet."
            );

        });

}