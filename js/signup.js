const eyeCons = document.querySelectorAll(".password__icon");
const passwords = document.querySelectorAll(".password");

// clicking on the eye icon
eyeCons.forEach((eyeCon, index) => {
  eyeCon.addEventListener("click", () => {
    if (passwords[index].getAttribute("type") === "password") {
      passwords[index].setAttribute("type", "text");
      eyeCon.classList.replace("ri-eye-line", "ri-eye-off-line");
    } else {
      passwords[index].setAttribute("type", "password");
      eyeCon.classList.replace("ri-eye-off-line", "ri-eye-line");
    }
  });
});

// password fields being empty results in the eye icon being hidden
passwords.forEach((password, index) => {
  password.addEventListener("input", () => {
    if (password.value !== "") eyeCons[index].classList.remove("dnone");
    else {
      eyeCons[index].classList.add("dnone");
      eyeCons[index].classList.replace("ri-eye-off-line", "ri-eye-line");
      password.setAttribute("type", "password");
    }
  });
});

const signupForm = document.getElementsByTagName("form")[0];

// focusing on fields removes the errors
signupForm.elements["username"].addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[0].textContent = "";
});
signupForm.elements["email"].addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[1].textContent = "";
});
signupForm.elements["password"].addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[2].textContent = "";
});
signupForm.elements["confirm-password"].addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[3].textContent = "";
});

// form validation and submission
signupForm.addEventListener("submit", (e) => {
  // function to delete an extra entry from formData obj
  function deleteFormDataEntry(formData, entry) {
    const newFormData = new FormData();
    for (let [key, value] of formData.entries()) {
      if (key !== entry) {
        newFormData.append(key, value);
      }
    }
    return newFormData;
  }

  // username validation
  function usernameValid(username) {
    const regEx = /^\w+$/;
    return regEx.test(username);
  }
  // email validation
  function emailValid(email) {
    const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regEx.test(email);
  }

  e.preventDefault();

  let formValid = true;

  const username = signupForm.elements["username"];
  const email = signupForm.elements["email"];
  const password = signupForm.elements["password"];
  const confirmPassword = signupForm.elements["confirm-password"];
  const errors = document.querySelectorAll(".error");

  if (!usernameValid(username.value)) {
    errors[0].textContent =
      "Must be at least 4 characters and contain only letters or numbers or '_'";
    username.classList.add("field__error");
    formValid = false;
  } else {
    errors[0].textContent = "";
  }

  if (!emailValid(email.value)) {
    errors[1].textContent = "Must be a valid email address";
    email.classList.add("field__error");
    formValid = false;
  } else {
    errors[1].textContent = "";
  }

  if (password.value.length < 6) {
    errors[2].textContent = "Must be at least 6 characters";
    password.classList.add("field__error");
    formValid = false;
  } else if (!/[a-z]/.test(password.value)) {
    errors[2].textContent = "Must contain at least one lowercase letter";
    password.classList.add("field__error");
    formValid = false;
  } else if (!/[A-Z]/.test(password.value)) {
    errors[2].textContent = "Must contain at least one uppercase letter";
    password.classList.add("field__error");
    formValid = false;
  } else if (!/\d/.test(password.value)) {
    errors[2].textContent = "Must contain at least one number";
    password.classList.add("field__error");
    formValid = false;
  } else if (!/[!@#$%&]/.test(password.value)) {
    errors[2].textContent =
      "Must contain at least one special character ({!@#$%&})";
    password.classList.add("field__error");
    formValid = false;
  } else errors[2].textContent = "";

  if (password.value && confirmPassword.value !== password.value) {
    errors[3].textContent = "Must be the same as the entered password";
    confirmPassword.classList.add("field__error");
    formValid = false;
  } else {
    errors[3].textContent = "";
    confirmPassword.classList.remove("field__error");
  }

  if (formValid) {
    username.value = username.value.toLowerCase();
    const allFormData = new FormData(signupForm);
    const formData = deleteFormDataEntry(allFormData, "confirm-password");
    for (let data of formData) console.log(`'${data[0]}': '${data[1]}'`);
    console.log(formValid);

    document.querySelector(".board").style.display = "none";
    document.querySelector(".emailcheck").style.display = "grid";
  }
});
