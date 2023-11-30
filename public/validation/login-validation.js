const formInputs = Array.from(document.getElementsByClassName('login-input'));
const loginBtn = document.querySelector('#login-btn')
const registerBtn = document.querySelector('#reg-form-btn')

function enableSubmit(button) {
    formInputs.forEach((input) =>
      input.addEventListener("blur", () => {
        if (formInputs.every((input) => input.value)) {
          button.removeAttribute("disabled");
        } else {
          button.setAttribute("disabled", true);
        }
      })
    );
}

if (loginBtn) {
    enableSubmit(loginBtn)
}

if (registerBtn) {
    enableSubmit(registerBtn)
}