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
    console.log('P: ' + password.value);
    if (password.value.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,30}$/
    )) {
        passwordValid.style.display = "block";
        passwordInvalid.style.display = "none";
        return true
    }
    else {
        passwordInvalid.style.display = "block";
        passwordValid.style.display = "none";
        return false
    }
}

const validateUsername = () => {
    console.log("U: " + username.value);
    if (username.value.match(/^[a-zA-Z0-9]{4,30}$/)) {
      usernameValid.style.display = "block";
      usernameInvalid.style.display = "none";
      return true;
    } else {
      usernameInvalid.style.display = "block";
      usernameValid.style.display = "none";
      return false;
    }
};

const validateEmail = () => {
  console.log("E: " + email.value);
    if (email.value.match(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-z]{2,7}$/)) {
        console.log('matchsdcdc')
    emailValid.style.display = "block";
    emailInvalid.style.display = "none";
    return true;
  } else {
    emailInvalid.style.display = "block";
    emailValid.style.display = "none";
    return false;
  }
};