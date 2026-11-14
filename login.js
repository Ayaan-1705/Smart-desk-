import { supabase } from "./supabase.js";


// GENERATE STARS

const starsContainer = document.getElementById("stars");

for (let i = 0; i < 100; i++) {

    const star = document.createElement("div");

    star.classList.add("star");

    star.style.left = Math.random() * 100 + "%";

    star.style.top = Math.random() * 100 + "%";

    const size = Math.random() * 2 + 1;

    star.style.width = size + "px";

    star.style.height = size + "px";

    star.style.animationDelay = Math.random() * 3 + "s";

    starsContainer.appendChild(star);

}


// SHOW / HIDE PASSWORD

const password = document.getElementById("password");

const togglePassword = document.getElementById("toggle-password");

togglePassword.addEventListener("click", function () {

    if (password.type === "password") {

        password.type = "text";

        togglePassword.textContent = "🙈";

    } else {

        password.type = "password";

        togglePassword.textContent = "👁";

    }

});


// LOGIN

const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    const passwordValue = password.value;

    const message = document.getElementById("login-message");

    const button = loginForm.querySelector(".login-btn");


    message.textContent = "";

    button.disabled = true;

    button.textContent = "Logging in...";


    try {

        const { data, error } = await supabase.auth.signInWithPassword({

            email: email,

            password: passwordValue

        });


        if (error) throw error;


        message.textContent = "Login successful!";

        message.style.color = "#a9d6b5";


        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    }

    catch (error) {

        message.textContent = error.message;

        message.style.color = "#ff9999";

    }

    finally {

        button.disabled = false;

        button.innerHTML = 'Login <span>→</span>';

    }

});