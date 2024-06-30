// import { objects } from "../public/resources/objects";
// import { users } from "../public/resources/objects";

const domain = localStorage.getItem("domain");

let objects = [];
let filteredObjects = [];
let users = [];

fetch(`${domain}user_files/${localStorage.getItem("username")}/`)
  .then((response) => {
    if (!response.ok)
      throw new Error("network response was not ok", response.status);
    return response.json();
  })
  .then((result) => {
    objects = result;
    filteredObjects = [...objects];
    showObjects(0, 20, objects); // shows the first 20 objects at page startup
    document.querySelector(".user__profile").children[1].textContent =
      localStorage.getItem("username");

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
      });
      let checkbox = person.getElementsByTagName("input")[0];
      checkbox.addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });

    const overlayGoBack = document
      .querySelector(".addpeople")
      .getElementsByTagName("button")[0];
    overlayGoBack.addEventListener("click", (e) => {
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

    const lastPageNumber = Math.ceil(objects.length / 20);
    document.getElementById("previous").addEventListener("click", (e) => {
      e.stopPropagation();
      const pageNumber = document.getElementById("page-no");
      if (Number(pageNumber.textContent) > 1) {
        pageNumber.textContent = `${Number(pageNumber.textContent) - 1}`;
        showObjects(
          Number(pageNumber.textContent) * 20 - 20,
          Number(pageNumber.textContent) * 20,
          filteredObjects
        );
      }
    });

    document.getElementById("next").addEventListener("click", (e) => {
      e.stopPropagation();
      const pageNumber = document.getElementById("page-no");
      if (Number(pageNumber.textContent) < lastPageNumber) {
        pageNumber.textContent = `${Number(pageNumber.textContent) + 1}`;
        showObjects(
          Number(pageNumber.textContent) * 20 - 20,
          Number(pageNumber.textContent) * 20,
          filteredObjects
        );
      }
    });

    // search objects
    const searchObjects = document.getElementById("search");
    searchObjects.addEventListener("input", (e) => {
      filteredObjects = objects.filter((item) =>
        item.originalFileName
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      showObjects(0, 20, filteredObjects);
    });

    function showPopupMenu(e, object) {
      // making the options menu popup
      function makePopupMenu() {
        // options callback functions for share, download and delete
        // delete
        function deleteObject(e) {
          console.log("delete", e.currentTarget);
          fetch(
            `${domain}delete_file/${localStorage.getItem("username")}/${
              object.id
            }/`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          e.currentTarget.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
        }
        // share
        function shareObject(e) {
          const objectElement =
            e.currentTarget.parentNode.parentNode.parentNode.parentNode
              .parentNode;
          sendUsers = function () {
            const temp = {
              fileUpload: Number(objectElement.id),
              userIds: Array.from(document.querySelectorAll(".person"))
                .map((person) => {
                  if (person.getElementsByTagName("input")[0].checked)
                    return Number(person.id);
                })
                .filter((item) => item !== undefined),
            };
            console.log(temp);
            // function updateCheckboxes() {
            //   for (let id of temp.userIds) {
            //     document.getElementById(`user${id}`).checked = true;
            //   }
            // }
            // updateCheckboxes();
          };

          e.currentTarget.parentNode.parentNode.parentNode.parentNode.remove();

          const overlay = document.querySelector(".overlay");
          const form = document.querySelector(".addpeople");

          overlay.classList.add("active");
          setTimeout(() => {
            form.classList.add("active");
          }, 0);
          showUsers();
        }
        // download
        function downloadObject(e) {
          console.log("download", e.currentTarget);
          // fetch(object.downloadLink)
          //   .then((response) => {
          //     if (!response.ok) throw new Error("network response was not ok");
          //     console.log("response");
          //     return response.blob();
          //   })
          //   .then((blob) => {
          //     const url = window.URL.createObjectURL(blob);
          //     const a = document.createElement("a");
          //     a.href = url;
          //     a.download = `${object.originalFileName}`;
          //     document.body.appendChild(a);
          //     a.click();
          //     a.remove();
          //     window.URL.revokeObjectURL(url);
          //   })
          //   .catch((error) =>
          //     console.error(
          //       "There has been a problem with your fetch operation",
          //       error
          //     )
          //   );
          e.currentTarget.children[0].click();
        }

        // creating the options menu
        const optionsMenu = document.createElement("div");
        optionsMenu.classList.add("options__menu");

        const heading = document.createElement("h4");
        heading.textContent = "App School.fig";

        const optionsDiv = document.createElement("div");
        optionsDiv.classList.add("options");

        const ul = document.createElement("ul");

        (object.isOwner
          ? ["Share", "Download", "Delete"]
          : ["Download"]
        ).forEach((optionText) => {
          const li = document.createElement("li");

          const button = document.createElement("button");
          button.classList.add("option__button");
          if (optionText === "Share")
            button.addEventListener("click", shareObject);
          else if (optionText === "Download")
            button.addEventListener("click", downloadObject);
          else if (optionText === "Delete")
            button.addEventListener("click", deleteObject);

          // hidden a tag
          const link = document.createElement("a");
          link.setAttribute("href", object.downloadLink);
          link.setAttribute("style", "display: none");
          link.setAttribute("target", "_blank");
          button.appendChild(link);

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

      let coordinates, selectedObject;
      if (e.currentTarget.nodeName === "BUTTON") {
        const button = e.currentTarget;
        selectedObject = button.parentNode;
        coordinates = button.getBoundingClientRect();
      } else if (e.currentTarget.nodeName === "DIV") {
        selectedObject = e.currentTarget;
        coordinates = selectedObject
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
      selectedObject.appendChild(optionsMenu);
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
    function makeObject(id, imgPath, imgAlt, name, description) {
      const object = document.createElement("div");
      object.classList.add("object");
      object.setAttribute("id", id);

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

    function showObjects(start, end, array) {
      if (document.querySelectorAll(".object"))
        document.querySelectorAll(".object").forEach((obj) => obj.remove());

      array.slice(start, end).forEach((object) => {
        function getImgPathAlt(fileType) {
          switch (fileType) {
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
        const imgPathAlt = getImgPathAlt(object.fileType);
        const objectElement = makeObject(
          object.id,
          imgPathAlt[0],
          imgPathAlt[1],
          object.originalFileName,
          `${object.fileSize} - ${object.uploadDate}`
        );
        objectElement.children[2].addEventListener("click", (e) => {
          showPopupMenu(e, object);
        });
        objectElement.addEventListener("contextmenu", (e) => {
          showPopupMenu(e, object);
        });
        document.querySelector(".objects").appendChild(objectElement);
      });
    }

    // this function creates users
    function makeUser(id, imgPath, name, email, access) {
      const person = document.createElement("div");
      person.classList.add("person");
      person.id = id;

      const checkbox = document.createElement("input");
      checkbox.setAttribute("type", "checkbox");
      checkbox.setAttribute("name", `user${id}`);
      if (access) checkbox.setAttribute("checked", access);
      checkbox.id = `checkbox${id}`;
      person.appendChild(checkbox);

      const personImg = document.createElement("img");
      personImg.setAttribute("src", imgPath);
      personImg.setAttribute("alt", `${name}'s profile picture`);
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

    function showUsers() {
      if (document.querySelectorAll(".person"))
        document.querySelectorAll(".person").forEach((child) => child.remove());

      // fetch(`${domain}someshit`)

      // sorting array based on access value and lastname
      users.sort((a, b) => {
        if (a.access === b.access) {
          const lastNameA = a.name.trim().split(" ")[
            a.name.trim().split(" ").length - 1
          ];
          const lastNameB = b.name.trim().split(" ")[
            b.name.trim().split(" ").length - 1
          ];
          return lastNameA.localeCompare(lastNameB);
        }
        return b.access - a.access;
      });

      users.forEach((user) => {
        const person = makeUser(
          user.id,
          user.picture,
          user.name,
          user.email,
          user.access
        );
        person.addEventListener("click", (e) => {
          e.stopPropagation();
          let checkbox = person.getElementsByTagName("input")[0];
          checkbox.checked = !checkbox.checked;
        });
        let checkbox = person.getElementsByTagName("input")[0];
        checkbox.addEventListener("click", (e) => {
          e.stopPropagation();
        });
        document.querySelector(".people").appendChild(person);
      });

      updateThreePeople();
    }

    function updateThreePeople() {
      // the first three checked user
      if (document.querySelector(".people3").children)
        Array.from(document.querySelector(".people3").children).forEach(
          (item) => item.remove()
        );
      Array.from(document.querySelectorAll(".person"))
        .slice(0, 3)
        .forEach((person, index) => {
          let alt = "";
          if (index === 0) alt = "first checked user";
          else if (index === 1) alt = "second checked user";
          else if (index === 2) alt = "third checked user";

          if (person.children[0].checked) {
            const img = document.createElement("img");
            img.setAttribute("src", person.children[1].src);
            img.setAttribute("alt", alt);
            document.querySelector(".people3").appendChild(img);
          }
        });
    }

    let sendUsers;
    document.querySelector(".addpeople").addEventListener("submit", (e) => {
      e.preventDefault();
      // fetch(`${domain}update_access_accounts/`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     fileUpload: object.id,
      //     userIds: Array.from(document.querySelectorAll(".person")).map(
      //       (person) => {
      //         if (person.getElementsByTagName("input")[0].checked)
      //           return person.id;
      //       }
      //     ),
      //   }),
      // })
      //   .then((response) => console.log(response.json()))
      //   .then((result) => console.log("success", result))
      //   .catch((error) => console.log("error", error));
      sendUsers();
    });

    // console.log(objects);
    // console.log(users);
  })
  .catch((error) => console.error("error", error));
