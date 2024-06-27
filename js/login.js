const eyeCon = document.querySelector(".password__icon");
const loginForm = document.getElementsByTagName("form")[0];
const usernameOrEmail = loginForm.elements["usernameOrEmail"];
const password = loginForm.elements["password"];

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

// focusing on fields removes the errors
usernameOrEmail.addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[0].textContent = "";
});
password.addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[1].textContent = "";
});

// form validation and submission
loginForm.addEventListener("submit", (e) => {
  // usernameOrEmail validation
  function usernameOrEmailValid(usernameOrEmail) {
    const usernamePattern = /^[A-Za-z]{4,}$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return (
      usernamePattern.test(usernameOrEmail) ||
      emailPattern.test(usernameOrEmail)
    );
  }

  e.preventDefault();

  let formValid = true;

  const errors = document.querySelectorAll(".error");

  if (!usernameOrEmailValid(usernameOrEmail.value)) {
    errors[0].textContent =
      "Username must be at least 4 characters and contain only letters, email must be a vaild email address";
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
    console.log(
      formValid,
      JSON.stringify({
        usernameOrEmail: usernameOrEmail.value,
        password: password.value,
      })
    );

    fetch("http://localhost:8000/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: usernameOrEmail.value,
        password: password.value,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("success", result);
        window.history.replaceState(null, null, "http://localhost:5173/");
        window.location.href = "http://localhost:5173/";
      })
      .catch((error) => console.error("error", error));
  }
});
