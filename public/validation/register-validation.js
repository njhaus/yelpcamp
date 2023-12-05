const form = document.getElementById('reg-form');
const formBtn = document.getElementById("reg-form-btn");
// password
const password = document.getElementById('reg-password');
const passwordValid = document.getElementById("valid-password");
const passwordInvalid = document.getElementById("invalid-password");

// username
const username = document.getElementById("reg-username");
const usernameValid = document.getElementById("valid-username");
const usernameInvalid = document.getElementById("invalid-username");

// email
const email = document.getElementById("reg-email");
const emailValid = document.getElementById("valid-email");
const emailInvalid = document.getElementById("invalid-email");

import { sanitizeHtml } from "./valid.js";


// click register
// check form
// sanitize HTML
// Add event listenders for onchange

formBtn.addEventListener('click', () => validateRegistration())

const validateRegistration = () => {
    if (
        validateEmail() === true &&
        validateUsername() === true &&
        validatePassword() === true &&
        sanitizeHtml() === true
    ) form.submit();
    else {
        password.addEventListener('keyup', () => validatePassword());
        username.addEventListener("keyup", () => validateUsername());
        email.addEventListener("keyup", () => validateEmail());
        }
}

const validatePassword = () => {
    if (password.value.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/
    )) {
        passwordValid.classList.remove('hidden');
        passwordInvalid.classList.add('hidden');
        return true
    }
    else {
        passwordInvalid.classList.remove('hidden');
        passwordValid.classList.add('hidden');
        return false
    }
}

const validateUsername = () => {
    if (username.value.match(/^[a-zA-Z0-9]{4,30}$/)) {
      usernameValid.classList.remove('hidden');
      usernameInvalid.classList.add('hidden');
      return true;
    } else {
      usernameInvalid.classList.remove('hidden');
      usernameValid.classList.add('hidden');
      return false;
    }
};

const validateEmail = () => {
    if (email.value.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-z]{2,7}$/)) {
    emailValid.classList.remove('hidden');
    emailInvalid.classList.add('hidden');
    return true;
  } else {
    emailInvalid.classList.remove('hidden');
    emailValid.classList.add('hidden');
    return false;
  }
};