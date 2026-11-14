// ========================================
// AI DOUBT SOLVER
// ========================================
// ========================================
// SUPABASE CONNECTION
// ========================================

import { supabase } from "./supabase.js";


// ========================================
// AI DOUBT SOLVER
// ========================================

const chatMessages =
    document.getElementById("chatMessages");

const userQuestion =
    document.getElementById("userQuestion");

const askButton =
    document.getElementById("askButton");


// ========================================
// ASK BUTTON
// ========================================

askButton.addEventListener("click", function () {
    sendQuestion();
});


// ========================================
// ENTER KEY
// ========================================

userQuestion.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        sendQuestion();
    }
});


// ========================================
// SEND QUESTION TO GEMINI AI
// ========================================

async function sendQuestion() {

    const question = userQuestion.value.trim();

    // Don't send empty questions
    if (question === "") {
        return;
    }

    // Display user's message
    const userMessage = document.createElement("div");

    userMessage.classList.add("user-message");
    userMessage.textContent = question;

    chatMessages.appendChild(userMessage);

    // Clear input
    userQuestion.value = "";

    // Create temporary AI message
    const aiMessage = document.createElement("div");

    aiMessage.classList.add("ai-message");
    aiMessage.textContent = "Thinking...";

    chatMessages.appendChild(aiMessage);

    chatMessages.scrollTop = chatMessages.scrollHeight;


    // ========================================
    // CONNECT TO SUPABASE EDGE FUNCTION
    // ========================================

    try {

        const { data, error } = await supabase.functions.invoke(
            "ai-chat",
            {
                body: {
                    question: question
                }
            }
        );

        if (error) {
            throw error;
        }

        if (!data || !data.reply) {
            throw new Error("No AI response received.");
        }

        // Display Gemini's response
        aiMessage.textContent = data.reply;

    }

    catch (error) {

        console.error("Gemini AI Error:", error);

        aiMessage.textContent =
            "Sorry, something went wrong. Please try again.";

    }

    chatMessages.scrollTop = chatMessages.scrollHeight;

}