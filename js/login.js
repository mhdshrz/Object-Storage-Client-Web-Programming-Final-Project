const eyeCon = document.querySelector(".password__icon");
const password = document.querySelector(".password");

// clicking on the eye icon
eyeCon.addEventListener("click", () => {
  if (password.getAttribute("type") === "password") {
    password.setAttribute("type", "text");
    eyeCon.classList.replace("ri-eye-line", "ri-eye-off-line");
  } else {
    password.setAttribute("type", "password");
    eyeCon.classList.replace("ri-eye-off-line", "ri-eye-line");
  }
});

// password field being empty results in the eye icon being hidden
password.addEventListener("input", () => {
  if (password.value !== "") eyeCon.classList.remove("dnone");
  else {
    eyeCon.classList.add("dnone");
    eyeCon.classList.replace("ri-eye-off-line", "ri-eye-line");
    password.setAttribute("type", "password");
  }
});

const loginForm = document.getElementsByTagName("form")[0];

// focusing on fields removes the errors
loginForm.elements["usernameOrEmail"].addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[0].textContent = "";
});
loginForm.elements["password"].addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[1].textContent = "";
});

// form validation and submission
loginForm.addEventListener("submit", (e) => {
  // username validation
  function usernameOrEmailValid(usernameOrEmail) {
    const usernamePattern = /^[A-Za-z0-9_]{4,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      usernamePattern.test(usernameOrEmail) ||
      emailPattern.test(usernameOrEmail)
    );
  }

  e.preventDefault();

  let formValid = true;

  const usernameOrEmail = loginForm.elements["usernameOrEmail"];
  const password = loginForm.elements["password"];
  const errors = document.querySelectorAll(".error");

  if (!usernameOrEmailValid(usernameOrEmail.value)) {
    errors[0].textContent =
      "Username must be at least 4 characters and contain only letters or numbers or '_' and email must be a vaild email address";
    usernameOrEmail.classList.add("field__error");
    formValid = false;
  } else {
    errors[0].textContent = "";
  }

  if (password.value.length < 6) {
    errors[1].textContent = "Must be at least 6 characters";
    password.classList.add("field__error");
    formValid = false;
  } else if (!/[a-z]/.test(password.value)) {
    errors[1].textContent = "Must contain at least one lowercase letter";
    password.classList.add("field__error");
    formValid = false;
  } else if (!/[A-Z]/.test(password.value)) {
    errors[1].textContent = "Must contain at least one uppercase letter";
    password.classList.add("field__error");
    formValid = false;
  } else if (!/\d/.test(password.value)) {
    errors[1].textContent = "Must contain at least one number";
    password.classList.add("field__error");
    formValid = false;
  } else if (!/[!@#$%&]/.test(password.value)) {
    errors[1].textContent =
      "Must contain at least one special character ({!@#$%&})";
    password.classList.add("field__error");
    formValid = false;
  } else errors[1].textContent = "";

  if (formValid) {
    usernameOrEmail.value = usernameOrEmail.value.toLowerCase();
    const formData = new FormData(loginForm);
    for (let data of formData) console.log(`${data[0]}: ${data[1]}`);
    console.log(formValid);
  }
});
