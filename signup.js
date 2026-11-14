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

document.querySelectorAll(".toggle-password").forEach(button => {

    button.addEventListener("click", function () {

        const target = document.getElementById(
            this.dataset.target
        );

        if (target.type === "password") {

            target.type = "text";

            this.textContent = "🙈";

        } else {

            target.type = "password";

            this.textContent = "👁";

        }

    });

});


// SIGN UP

const signupForm = document.getElementById("signup-form");

signupForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    const fullname = document.getElementById("fullname").value.trim();

    const email = document.getElementById("email").value.trim();

    const password = document.getElementById("password").value;

    const confirmPassword = document.getElementById("confirm-password").value;

    const message = document.getElementById("signup-message");

    const button = signupForm.querySelector(".signup-btn");


    message.textContent = "";


    // VALIDATION

    if (password.length < 8) {

        message.textContent = "Password must contain at least 8 characters.";

        return;

    }


    if (password !== confirmPassword) {

        message.textContent = "Passwords do not match.";

        return;

    }


    if (!fullname) {

        message.textContent = "Please enter your full name.";

        return;

    }


    // LOADING STATE

    button.disabled = true;

    button.textContent = "Creating Account...";


    try {

        const { data, error } = await supabase.auth.signUp({

            email: email,

            password: password,

            options: {

                data: {

                    full_name: fullname

                },

                emailRedirectTo: window.location.origin + "/index.html"

            }

        });


        if (error) throw error;


        if (data.session) {

            message.textContent = "Account created successfully!";

            message.style.color = "#a9d6b5";

            setTimeout(() => {

                window.location.href = "index.html";

            }, 1200);

        } else {

            message.textContent =
                "Account created! Please check your email to verify your account.";

            message.style.color = "#a9d6b5";

            signupForm.reset();

        }

    }

    catch (error) {

        message.textContent = error.message;

        message.style.color = "#ff9999";

    }

    finally {

        button.disabled = false;

        button.innerHTML = 'Create Account <span>→</span>';

    }

});