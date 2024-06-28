const username = localStorage.getItem("username");
console.log(username);

function showPopupMenu(e) {
  function makePopupMenu() {
    const optionsMenu = document.createElement("div");
    optionsMenu.classList.add("options__menu");

    const heading = document.createElement("h4");
    heading.textContent = "App School.fig";

    const optionsDiv = document.createElement("div");
    optionsDiv.classList.add("options");

    const ul = document.createElement("ul");

    ["Share", "Download", "Delete"].forEach((optionText) => {
      const li = document.createElement("li");

      const optionIcon = document.createElement("div");
      optionIcon.classList.add("option__icon", optionText.toLowerCase());

      const img = document.createElement("img");
      img.setAttribute("src", `/icons/${optionText.toLowerCase()}.svg`);
      img.setAttribute("alt", `${optionText.toLowerCase()} icon`);

      optionIcon.appendChild(img);

      li.appendChild(optionIcon);
      li.appendChild(document.createTextNode(optionText));

      ul.appendChild(li);
    });

    optionsDiv.appendChild(ul);

    optionsMenu.appendChild(heading);
    optionsMenu.appendChild(optionsDiv);

    return optionsMenu;
  }

  e.stopPropagation();
  if (document.querySelector(".options__menu"))
    document.querySelector(".options__menu").remove();
  const button = e.currentTarget;
  const coordinates = button.getBoundingClientRect();
  const optionsMenu = makePopupMenu();
  optionsMenu.style.left = `${Math.round(coordinates.left - 243)}px`;
  optionsMenu.style.top = `${Math.round(coordinates.bottom)}px`;

  e.currentTarget.parentNode.appendChild(optionsMenu);
}

function hidePopupMenu(e) {
  if (
    document.querySelector(".options__menu") &&
    !document.querySelector(".options__menu").contains(e.target)
  ) {
    document.querySelector(".options__menu").remove();
  }
}

document.querySelectorAll(".object").forEach((object) => {
  object.children[2].addEventListener("click", showPopupMenu);
});
document.addEventListener("click", hidePopupMenu);
