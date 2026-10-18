

"use strict";




const registerForm = document.getElementById("registerForm");

const emailInput = document.getElementById("email");

const organizationEmailInput =
    document.getElementById("organizationEmail");

const passwordInput = document.getElementById("password");

const confirmPasswordInput =
    document.getElementById("confirmPassword");

const submitButton = document.getElementById("submitButton");

const formMessage = document.getElementById("formMessage");




const emailError = document.getElementById("emailError");

const organizationEmailError =
    document.getElementById("organizationEmailError");

const passwordError = document.getElementById("passwordError");

const confirmPasswordError =
    document.getElementById("confirmPasswordError");




const passwordToggleButtons =
    document.querySelectorAll(".password-toggle");


passwordToggleButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const targetId = button.dataset.target;

        const input = document.getElementById(targetId);

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

    input.classList.remove("valid");

    input.setAttribute("aria-invalid", "true");

}


function clearError(input, errorElement) {

    errorElement.textContent = "";

    input.classList.remove("invalid");

    input.removeAttribute("aria-invalid");

}


function markValid(input, errorElement) {

    clearError(input, errorElement);

    input.classList.add("valid");

}


function showFormMessage(message, type) {

    formMessage.textContent = message;

    formMessage.className = "form-message " + type;

}


function clearFormMessage() {

    formMessage.textContent = "";

    formMessage.className = "form-message";

}




function isValidEmail(value) {

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(value);

}


function validateEmail() {

    const email = emailInput.value.trim();

    if (!email) {

        showError(
            emailInput,
            emailError,
            "Email is required."
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


    markValid(emailInput, emailError);

    return true;

}




function validateOrganizationEmail() {

    const organizationEmail =
        organizationEmailInput.value.trim();


    if (!organizationEmail) {

        showError(
            organizationEmailInput,
            organizationEmailError,
            "Organization email is required."
        );

        return false;

    }


    if (!isValidEmail(organizationEmail)) {

        showError(
            organizationEmailInput,
            organizationEmailError,
            "Please enter a valid organization email."
        );

        return false;

    }


    markValid(
        organizationEmailInput,
        organizationEmailError
    );

    return true;

}




function validatePassword() {

    const password = passwordInput.value;


    if (!password) {

        showError(
            passwordInput,
            passwordError,
            "Password is required."
        );

        return false;

    }


    if (password.length < 8) {

        showError(
            passwordInput,
            passwordError,
            "Password must contain at least 8 characters."
        );

        return false;

    }


    markValid(passwordInput, passwordError);

    return true;

}




function validateConfirmPassword() {

    const password = passwordInput.value;

    const confirmPassword = confirmPasswordInput.value;


    if (!confirmPassword) {

        showError(
            confirmPasswordInput,
            confirmPasswordError,
            "Please confirm your password."
        );

        return false;

    }


    if (password !== confirmPassword) {

        showError(
            confirmPasswordInput,
            confirmPasswordError,
            "Passwords do not match."
        );

        return false;

    }


    markValid(
        confirmPasswordInput,
        confirmPasswordError
    );

    return true;

}



emailInput.addEventListener("blur", validateEmail);

organizationEmailInput.addEventListener(
    "blur",
    validateOrganizationEmail
);

passwordInput.addEventListener("blur", validatePassword);

confirmPasswordInput.addEventListener(
    "blur",
    validateConfirmPassword
);


emailInput.addEventListener("input", () => {

    if (emailInput.classList.contains("invalid")) {
        validateEmail();
    }

});


organizationEmailInput.addEventListener("input", () => {

    if (
        organizationEmailInput.classList.contains("invalid")
    ) {
        validateOrganizationEmail();
    }

});


passwordInput.addEventListener("input", () => {

    if (passwordInput.classList.contains("invalid")) {
        validatePassword();
    }


    if (confirmPasswordInput.value.length > 0) {
        validateConfirmPassword();
    }

});


confirmPasswordInput.addEventListener("input", () => {

    if (confirmPasswordInput.classList.contains("invalid")) {
        validateConfirmPassword();
    }

});



registerForm.addEventListener("submit", (event) => {

    event.preventDefault();

    clearFormMessage();


    const emailIsValid = validateEmail();

    const organizationEmailIsValid =
        validateOrganizationEmail();

    const passwordIsValid = validatePassword();

    const confirmPasswordIsValid =
        validateConfirmPassword();


    const formIsValid =
        emailIsValid &&
        organizationEmailIsValid &&
        passwordIsValid &&
        confirmPasswordIsValid;


    if (!formIsValid) {

        showFormMessage(
            "Please correct the errors and try again.",
            "error"
        );


        const firstInvalidField =
            registerForm.querySelector(".invalid");


        if (firstInvalidField) {
            firstInvalidField.focus();
        }

        return;

    }


    /*
     * Frontend only:
     * The form is validated, but no account is created yet.
     *
     * Backend authentication will be connected later.
     */


    showFormMessage(
        "Validation successful! Backend registration will be connected in the next stage.",
        "success"
    );

});