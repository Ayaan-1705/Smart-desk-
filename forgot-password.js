import { supabase } from "./supabase.js";

const forgotForm = document.getElementById("forgotPasswordForm");

forgotForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const message = document.getElementById("message");
    const button = document.getElementById("resetBtn");

    button.disabled = true;
    button.textContent = "Sending...";

    try {

        const { error } = await supabase.auth.resetPasswordForEmail(email, {

            redirectTo: window.location.origin + "/update-password.html"

        });

        if (error) {
            throw error;
        }

        message.textContent = "If an account exists for this email, a password reset link will be sent.";
        message.style.color = "green";

    } catch (error) {

        message.textContent = error.message;
        message.style.color = "red";

    } finally {

        button.disabled = false;
        button.textContent = "Send Reset Link";

    }

});