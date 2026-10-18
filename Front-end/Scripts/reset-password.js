"use strict";

const resetPasswordForm = document.getElementById("resetPasswordForm");

const newPasswordInput = document.getElementById("newPassword");

const confirmPasswordInput = document.getElementById("confirmPassword");

const newPasswordError = document.getElementById("newPasswordError");

const confirmPasswordError = document.getElementById("confirmPasswordError");

const formMessage = document.getElementById("formMessage");

const submitButton = document.getElementById("submitButton");

const strengthBar = document.getElementById("strengthBar");

const strengthText = document.getElementById("strengthText");


document.querySelectorAll(".password-toggle").forEach((button) => {
    button.addEventListener("click", () => {
        const input = document.getElementById(button.dataset.target);

        if (!input) return;

        const showPassword = input.type === "password";

        input.type = showPassword ? "text" : "password";

        button.setAttribute(
            "aria-label",
            showPassword ? "Hide password" : "Show password"
        );

        button.setAttribute("aria-pressed", String(showPassword));
    });
});


function showError(input, element, message) {
    element.textContent = message;
    input.classList.add("invalid");
    input.setAttribute("aria-invalid", "true");
}


function clearError(input, element) {
    element.textContent = "";
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


function getPasswordStrength(password) {
    let score = 0;

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    return score;
}


function updatePasswordStrength() {
    const password = newPasswordInput.value;
    const score = getPasswordStrength(password);

    const levels = [
        { width: "0%", text: "", color: "#dc3545" },
        { width: "20%", text: "Very weak", color: "#dc3545" },
        { width: "40%", text: "Weak", color: "#fd7e14" },
        { width: "60%", text: "Fair", color: "#e0a800" },
        { width: "80%", text: "Good", color: "#198754" },
        { width: "100%", text: "Strong", color: "#16834a" }
    ];

    const level = levels[password.length === 0 ? 0 : score];

    strengthBar.style.width = level.width;
    strengthBar.style.backgroundColor = level.color;
    strengthText.textContent = level.text;
}


function validateNewPassword() {
    const password = newPasswordInput.value;

    if (!password) {
        showError(
            newPasswordInput,
            newPasswordError,
            "Please enter a new password."
        );
        return false;
    }

    if (password.length < 8) {
        showError(
            newPasswordInput,
            newPasswordError,
            "Password must contain at least 8 characters."
        );
        return false;
    }

    if (!/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/[0-9]/.test(password)) {
        showError(
            newPasswordInput,
            newPasswordError,
            "Include uppercase, lowercase, and at least one number."
        );
        return false;
    }

    clearError(newPasswordInput, newPasswordError);

    return true;
}


function validateConfirmPassword() {
    const password = newPasswordInput.value;
    const confirmation = confirmPasswordInput.value;

    if (!confirmation) {
        showError(
            confirmPasswordInput,
            confirmPasswordError,
            "Please confirm your new password."
        );
        return false;
    }

    if (password !== confirmation) {
        showError(
            confirmPasswordInput,
            confirmPasswordError,
            "Passwords do not match."
        );
        return false;
    }

    clearError(confirmPasswordInput, confirmPasswordError);

    return true;
}


newPasswordInput.addEventListener("input", () => {
    clearMessage();
    updatePasswordStrength();

    if (newPasswordInput.classList.contains("invalid")) {
        validateNewPassword();
    }

    if (confirmPasswordInput.value) {
        validateConfirmPassword();
    }
});


confirmPasswordInput.addEventListener("input", () => {
    clearMessage();

    if (confirmPasswordInput.classList.contains("invalid") ||
        confirmPasswordInput.value) {
        validateConfirmPassword();
    }
});


newPasswordInput.addEventListener("blur", validateNewPassword);

confirmPasswordInput.addEventListener("blur", () => {
    if (confirmPasswordInput.value) {
        validateConfirmPassword();
    }
});


resetPasswordForm.addEventListener("submit", (event) => {
    event.preventDefault();

    clearMessage();

    const passwordIsValid = validateNewPassword();
    const confirmationIsValid = validateConfirmPassword();

    if (!passwordIsValid || !confirmationIsValid) {
        showMessage(
            "Please correct the errors and try again.",
            "error"
        );

        const firstInvalid = resetPasswordForm.querySelector(".invalid");

        if (firstInvalid) firstInvalid.focus();

        return;
    }

    showMessage(
        "Password validation successful. Connect the backend to save your new password.",
        "success"
    );

    /*
     * Frontend only.
     * A secure backend must validate the reset token and update the password.
     * Never save passwords in localStorage or sessionStorage.
     */
});