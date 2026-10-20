"use strict";

const loginForm = document.getElementById("loginForm");

const emailInput = document.getElementById("email");

const passwordInput = document.getElementById("password");

const rememberMeInput = document.getElementById("rememberMe");

const emailError = document.getElementById("emailError");

const passwordError = document.getElementById("passwordError");

const formMessage = document.getElementById("formMessage");

const submitButton = document.getElementById("submitButton");

document.querySelectorAll(".password-toggle").forEach((button) => {

    button.addEventListener("click", () => {

        const input = document.getElementById(button.dataset.target);

        if (!input) {
            return;
        }

        const shouldShow = input.type === "password";

        input.type = shouldShow ? "text" : "password";

        button.setAttribute(
            "aria-label",
            shouldShow ? "Hide password" : "Show password"
        );

        button.setAttribute(
            "aria-pressed",
            String(shouldShow)
        );

    });

});

function showError(input, errorElement, message) {

    errorElement.textContent = message;

    input.classList.add("invalid");

    input.setAttribute("aria-invalid", "true");

}


function clearError(input, errorElement) {

    errorElement.textContent = "";

    input.classList.remove("invalid");

    input.removeAttribute("aria-invalid");

}


function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message " + type;

}


function clearMessage() {

    formMessage.textContent = "";

    formMessage.className = "form-message";

}


function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

}

function validateEmail() {

    const email = emailInput.value.trim();

    if (!email) {

        showError(
            emailInput,
            emailError,
            "Please enter your email address."
        );

        return false;

    }


    if (!isValidEmail(email)) {

        showError(
            emailInput,
            emailError,
            "Please enter a valid email address."
        );

        return false;

    }


    clearError(emailInput, emailError);

    return true;

}

function validatePassword() {

    const password = passwordInput.value;

    if (!password) {

        showError(
            passwordInput,
            passwordError,
            "Please enter your password."
        );

        return false;

    }


    clearError(passwordInput, passwordError);

    return true;

}

emailInput.addEventListener("blur", validateEmail);

passwordInput.addEventListener("blur", validatePassword);


emailInput.addEventListener("input", () => {

    if (emailInput.classList.contains("invalid")) {
        validateEmail();
    }

});


passwordInput.addEventListener("input", () => {

    if (passwordInput.classList.contains("invalid")) {
        validatePassword();
    }

});

loginForm.addEventListener("submit", (event) => {

    event.preventDefault();

    clearMessage();


    const emailIsValid = validateEmail();

    const passwordIsValid = validatePassword();


    if (!emailIsValid || !passwordIsValid) {

        showMessage(
            "Please correct the errors and try again.",
            "error"
        );

        const firstInvalidField =
            loginForm.querySelector(".invalid");

        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return;

    }


    /*
     * Frontend only.
     *
     * Authentication will be connected to the backend later.
     * Do not store passwords in localStorage.
     */


    showMessage(
        "Your information is valid. Backend authentication is not connected yet.",
        "success"
    );


    console.log("Login form validated.");

    console.log(
        "Remember me:",
        rememberMeInput.checked
    );

});