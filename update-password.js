import { supabase } from "./supabase.js";


const updateForm = document.getElementById("updatePasswordForm");

updateForm.addEventListener("submit", async function (e) {

    e.preventDefault();

    const password = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    const message = document.getElementById("message");
    const button = document.getElementById("updateBtn");

    if (password !== confirmPassword) {

        message.textContent = "Passwords do not match!";
        message.style.color = "red";

        return;

    }

    button.disabled = true;
    button.textContent = "Updating...";

    try {

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError || !session) {
            throw new Error("Your password reset link is invalid or expired. Please request a new one.");
        }

        const { error } = await supabase.auth.updateUser({

            password: password

        });

        if (error) {
            throw error;
        }

        message.textContent = "Password updated successfully! Redirecting to login...";
        message.style.color = "green";

        setTimeout(async function () {

            await supabase.auth.signOut();

            window.location.href = "index.html";

        }, 2000);

    } catch (error) {

        message.textContent = error.message;
        message.style.color = "red";

    } finally {

        button.disabled = false;
        button.textContent = "Update Password";

    }

});