import { objects } from "../public/resources/objects";

const domain = localStorage.getItem("domain");

document.querySelectorAll(".object").forEach((object) => {
  object.children[2].addEventListener("click", showPopupMenu);
  object.addEventListener("contextmenu", showPopupMenu);
});
document.addEventListener("click", hidePopupMenu);
document.addEventListener("contextmenu", hidePopupMenu);
document.querySelector(".objects").addEventListener("scroll", () => {
  if (document.querySelector(".options__menu")) {
    document.querySelector(".options__menu").remove();
  }
});

document.querySelectorAll(".person").forEach((person) => {
  person.addEventListener("click", (e) => {
    e.stopPropagation();
    let checkbox = person.getElementsByTagName("input")[0];
    checkbox.checked = !checkbox.checked;
    console.log("south");
  });
  let checkbox = person.getElementsByTagName("input")[0];
  checkbox.addEventListener("click", (e) => {
    e.stopPropagation();
    console.log(e.target);
  });
});

const overlayGoBack = document
  .querySelector(".addpeople")
  .getElementsByTagName("button")[0];
overlayGoBack.addEventListener("click", (e) => {
  console.log("pipi");
  e.stopPropagation();
  const overlay = document.querySelector(".overlay");
  const form = document.querySelector(".addpeople");
  form.classList.remove("active");
  setTimeout(() => {
    overlay.classList.remove("active");
  }, 500);
});

const uploadButton = document.getElementById("upload-button");
uploadButton.addEventListener("click", () => {
  const fileUpload = document.getElementById("file-upload");
  fileUpload.click();
});

const fileUpload = document.getElementById("file-upload");
fileUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  console.log("in change", file);
  if (file) {
    const formData = new FormData();
    formData.append("file", file);
    // formData.append('username', username);

    fetch(`${domain}upload_object/${localStorage.getItem("username")}/`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => console.log("success", data))
      .catch((error) => console.error("error", error));
  }
});

objects.forEach((object) => {
  function getImgPathAlt(type) {
    switch (type) {
      case "png":
      case "jpg":
      case "jpeg":
        return ["/logos/png-jpg-jpeg-logo.svg", "picture icon"];
      case "mp3":
        return ["/logos/mp3-logo.svg", "music icon"];
      case "mp4":
        return ["/logos/mp4-logo.svg", "play video icon"];
      case "pdf":
        return ["/logos/pdf-logo.svg", "pdf file icon"];
      default:
        return ["/logos/fallback-logo.svg", "unknown file icon"];
    }
  }
  const imgPathAlt = getImgPathAlt(object.type);
  const objectElement = makeObject(
    imgPathAlt[0],
    imgPathAlt[1],
    object.name,
    `${object.size} - ${object.date}`
  );
  objectElement.children[2].addEventListener("click", showPopupMenu);
  objectElement.addEventListener("contextmenu", showPopupMenu);
  document.querySelector(".objects").appendChild(objectElement);
});

function showPopupMenu(e) {
  // making the options menu popup
  function makePopupMenu() {
    // options callback functions for share, download and delete
    function deleteObject(e) {
      console.log("delete", e.currentTarget);
      e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    }
    function shareObject(e) {
      console.log("share", e.currentTarget);
      e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
      const overlay = document.querySelector(".overlay");
      const form = document.querySelector(".addpeople");
      overlay.classList.add("active");
      setTimeout(() => {
        form.classList.add("active");
      }, 0);
    }
    function downloadObject(e) {
      console.log("download", e.currentTarget);
    }

    // creating the options menu
    const optionsMenu = document.createElement("div");
    optionsMenu.classList.add("options__menu");

    const heading = document.createElement("h4");
    heading.textContent = "App School.fig";

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    const ul = document.createElement("ul");

    ["Share", "Download", "Delete"].forEach((optionText) => {
      const li = document.createElement("li");

      const button = document.createElement("button");
      button.classList.add("option__button");
      if (optionText === "Share") button.addEventListener("click", shareObject);
      else if (optionText === "Download")
        button.addEventListener("click", downloadObject);
      else if (optionText === "Delete")
        button.addEventListener("click", deleteObject);

      const optionIcon = document.createElement("div");
      optionIcon.classList.add("option__icon", optionText.toLowerCase());

      const img = document.createElement("img");
      img.setAttribute("src", `/icons/${optionText.toLowerCase()}.svg`);
      img.setAttribute("alt", `${optionText.toLowerCase()} icon`);

      optionIcon.appendChild(img);
      button.appendChild(optionIcon);
      button.appendChild(document.createTextNode(optionText));
      li.appendChild(button);
      ul.appendChild(li);
    });

    optionsDiv.appendChild(ul);
    optionsMenu.appendChild(heading);
    optionsMenu.appendChild(optionsDiv);
    optionsMenu.addEventListener("contextmenu", (e) => e.stopPropagation());

    return optionsMenu;
  }

  e.stopPropagation();
  e.preventDefault();

  if (document.querySelector(".options__menu"))
    document.querySelector(".options__menu").remove();

  let coordinates, object;
  if (e.currentTarget.nodeName === "BUTTON") {
    const button = e.currentTarget;
    object = button.parentNode;
    coordinates = button.getBoundingClientRect();
  } else if (e.currentTarget.nodeName === "DIV") {
    object = e.currentTarget;
    coordinates = object
      .getElementsByTagName("button")[0]
      .getBoundingClientRect();
  }
  const optionsMenu = makePopupMenu();
  if (Math.round(coordinates.bottom + 186) > window.innerHeight) {
    optionsMenu.style.left = `${Math.round(coordinates.left - 243)}px`;
    optionsMenu.style.bottom = `${Math.round(
      window.innerHeight - coordinates.bottom
    )}px`;
  } else {
    optionsMenu.style.left = `${Math.round(coordinates.left - 243)}px`;
    optionsMenu.style.top = `${Math.round(coordinates.bottom)}px`;
  }
  object.appendChild(optionsMenu);
}

function hidePopupMenu(e) {
  if (
    document.querySelector(".options__menu") &&
    !document.querySelector(".options__menu").contains(e.target)
  ) {
    document.querySelector(".options__menu").remove();
  }
}

// this function creates objects
function makeObject(imgPath, imgAlt, name, description) {
  const object = document.createElement("div");
  object.classList.add("object");

  const objImg = document.createElement("div");
  objImg.classList.add("obj__img");

  const img = document.createElement("img");
  img.setAttribute("src", imgPath);
  img.setAttribute("alt", imgAlt);
  objImg.appendChild(img);

  object.appendChild(objImg);

  const objDesc = document.createElement("div");
  objDesc.classList.add("obj__desc");

  const objName = document.createElement("h3");
  objName.textContent = name;

  const objInfo = document.createElement("p");
  objInfo.textContent = description;

  objDesc.appendChild(objName);
  objDesc.appendChild(objInfo);

  object.appendChild(objDesc);

  const button = document.createElement("button");
  button.setAttribute("type", "button");

  const buttonImg = document.createElement("img");
  buttonImg.setAttribute("src", "/icons/options.svg");
  buttonImg.setAttribute("alt", "three dot options icon");

  button.appendChild(buttonImg);

  object.appendChild(button);

  return object;
}

// this function creates users
function makeUser(imgPath, name, email) {
  const person = document.createElement("div");
  person.classList.add("person");
  person.id = "person-id";

  const checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("name", "person-id");
  checkbox.id = "person-id";
  person.appendChild(checkbox);

  const personImg = document.createElement("img");
  personImg.setAttribute("src", imgPath);
  personImg.setAttribute("alt", "user's profile picture");
  person.appendChild(personImg);

  const personInfo = document.createElement("div");
  personInfo.classList.add("person__info");

  const personName = document.createElement("h3");
  personName.textContent = name;
  personInfo.appendChild(personName);

  const personEmail = document.createElement("p");
  personEmail.textContent = email;
  personInfo.appendChild(personEmail);

  person.appendChild(personInfo);

  return person;
}

console.log(objects);
