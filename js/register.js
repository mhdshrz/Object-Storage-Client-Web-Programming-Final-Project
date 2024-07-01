const domain = localStorage.getItem("domain");

const eyeCons = document.querySelectorAll(".password__icon");
const signupForm = document.getElementsByTagName("form")[0];
const username = signupForm.elements["username"];
const email = signupForm.elements["email"];
const password = signupForm.elements["password"];
const confirmPassword = signupForm.elements["confirm-password"];

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

// focusing on fields removes the errors
username.addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[0].textContent = "";
});
email.addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[1].textContent = "";
});
password.addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[2].textContent = "";
});
confirmPassword.addEventListener("focus", (e) => {
  e.target.classList.remove("field__error");
  document.querySelectorAll(".error")[3].textContent = "";
});

// form validation and submission
signupForm.addEventListener("submit", (e) => {
  // username validation
  function usernameValid(username) {
    const regEx = /^[a-zA-Z]{4,}$/;
    return regEx.test(username);
  }
  // email validation
  function emailValid(email) {
    const regEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regEx.test(email);
  }

  e.preventDefault();

  let formValid = true;

  const errors = document.querySelectorAll(".error");

  if (!usernameValid(username.value)) {
    errors[0].textContent =
      "Must be at least 4 characters and contain only letters";
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
    console.log(
      formValid,
      JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      })
    );

    fetch(`${domain}register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    })
      .then((response) => {
        if (!response.ok)
          throw new Error("network response was not ok", response.status);
        if (response.status === 201) {
          document.querySelector(
            ".emailcheck"
          ).children[2].innerHTML = `We've sent an email to <span class='bold'>${email.value}</span> to verify your accont.`;
          document.querySelector(".board").style.display = "none";
          document.querySelector(".emailcheck").style.display = "grid";
        }
        // else if (response.status === 400) {

        // }
        else if (response.status === 409) {
          alert("email or username already exists!");
        }
        return response.json();
      })
      .then((result) =>
        console.log(
          "account created, waiting for email to be confirmed",
          result
        )
      )
      .catch((error) => console.error("error", error));
  }
});

// login button in the prompt for email verification
document
  .querySelector(".emailcheck")
  .children[3].addEventListener("click", (e) => {
    fetch(`${domain}login/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    })
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("username", username.value);
          window.history.replaceState(null, null, "http://localhost:5173/");
          window.location.href = "http://localhost:5173/";
        } else if (response.status === 404)
          alert("username or email not found");
        else if (response.status === 403) alert("email not verified!");
      })
      .catch((error) => console.error("error", error));
  });
