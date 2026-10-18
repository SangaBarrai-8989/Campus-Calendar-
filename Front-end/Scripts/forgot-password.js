"use strict";


// ======================================
// Elements
// ======================================

const forgotPasswordForm =
    document.getElementById("forgotPasswordForm");

const emailInput =
    document.getElementById("email");

const emailError =
    document.getElementById("emailError");

const formMessage =
    document.getElementById("formMessage");


// ======================================
// Helpers
// ======================================

function showError(message) {

    emailError.textContent = message;

    emailInput.classList.add("invalid");

    emailInput.setAttribute("aria-invalid", "true");

}


function clearError() {

    emailError.textContent = "";

    emailInput.classList.remove("invalid");

    emailInput.removeAttribute("aria-invalid");

}


function showMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message " + type;

}


function clearMessage() {

    formMessage.textContent = "";

    formMessage.className = "form-message";

}


// ======================================
// Validate Email
// ======================================

function validateEmail() {

    const email = emailInput.value.trim();

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!email) {

        showError("Please enter your email address.");

        return false;

    }


    if (!emailPattern.test(email)) {

        showError("Please enter a valid email address.");

        return false;

    }


    clearError();

    return true;

}


// ======================================
// Live Validation
// ======================================

emailInput.addEventListener("blur", validateEmail);


emailInput.addEventListener("input", () => {

    clearMessage();

    if (emailInput.classList.contains("invalid")) {
        validateEmail();
    }

});


// ======================================
// Form Submission
// ======================================

forgotPasswordForm.addEventListener(
    "submit",
    (event) => {

        event.preventDefault();

        clearMessage();


        if (!validateEmail()) {

            emailInput.focus();

            showMessage(
                "Please correct your email address.",
                "error"
            );

            return;

        }


        /*
         * Frontend only.
         *
         * No email is sent at this stage.
         * The password-reset API will be connected
         * after the frontend pages are completed.
         */


        showMessage(
            "The email is valid. Password recovery will be available after backend integration.",
            "success"
        );

    }
);