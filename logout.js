import { supabase } from "./supabase.js";

async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error("Logout failed:", error.message);
        return;
    }

    window.location.href = "index.html";
}

document.getElementById("logout-Button").addEventListener("click", logout);