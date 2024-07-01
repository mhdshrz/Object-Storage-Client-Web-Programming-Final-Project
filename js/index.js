import { generateRandomPictureUrl } from "../public/resources/objects";

const domain = localStorage.getItem("domain");
// const domain = "http://localhost:8000/";
const domain2 = "http://192.168.43.73:8001/";

let objectsArray = [];
let totalPages = -1;
let filteredObjects = [];
let users = [];
let filteredUsers = [];
let totalVolumeUsed = "";

fetch(`${domain}user_files/${localStorage.getItem("username")}/1/`)
  .then((response) => {
    if (!response.ok)
      throw new Error("network response was not ok", response.status);
    return response.json();
  })
  .then((result) => {
    // console.log(result);
    objectsArray = result.files;
    totalPages = result.totalPages;
    filteredObjects = [...objectsArray];
    totalVolumeUsed = objectsArray.reduce((acc, obj) => {
      if (obj.isOwner) return acc + obj.fileSize;
      return acc;
    }, 0);
    showObjects(objectsArray); // shows the first 20 objects at page startup

    document.querySelector(".user__profile").children[1].textContent =
      localStorage.getItem("username");
    document.querySelector(
      ".objects__container"
    ).children[1].children[0].textContent = `${
      Math.round((totalVolumeUsed / 1024) * 100) / 100
    } KB`;

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
    overlayGoBack.addEventListener("click", hideForm);

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
          .then((response) => {
            if (!response.ok)
              throw new Error("network response was not ok", response.status);
            // location.reload();
            alert(
              "your file was uploaded successfully, you can reload the page to see the updated file list"
            );
            return response.json();
          })
          .then((data) => console.log("success", data))
          .catch((error) => console.error("error", error));
      }
    });

    const profilePicElement = document.getElementById("profile-pic");
    profilePicElement.setAttribute(
      "src",
      `${domain2}${localStorage.getItem("username")}.jpg`
    );
    console.log(`${domain2}${localStorage.getItem("username")}.jpg`);
    profilePicElement.addEventListener("click", () => {
      const profilePicUpload = document.getElementById("profile-pic-upload");
      profilePicUpload.click();
    });

    const profilePicUpload = document.getElementById("profile-pic-upload");
    profilePicUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        // formData.append('username', username);

        fetch(`${domain}upload_image/${localStorage.getItem("username")}/`, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok)
              throw new Error("network response was not ok", response.status);
            // location.reload();
            alert(
              "your file was uploaded successfully, you can reload the page to see the updated file list"
            );
            return response.json();
          })
          .then((data) => console.log("success", data))
          .catch((error) => console.error("error", error));
      }
    });

    document.getElementById("previous").addEventListener("click", (e) => {
      e.stopPropagation();
      const pageNumber = document.getElementById("page-no");
      if (Number(pageNumber.textContent) > 1) {
        fetch(
          `${domain}user_files/${localStorage.getItem("username")}/${
            Number(pageNumber.textContent) - 1
          }/`
        )
          .then((response) => {
            if (!response.ok) throw new Error("network response was not ok");
            return response.json();
          })
          .then((result) => {
            objectsArray = result.files;
            pageNumber.textContent = `${Number(pageNumber.textContent) - 1}`;
            showObjects(objectsArray);
          })
          .catch((error) => console.error("error", error));
      }
    });

    document.getElementById("next").addEventListener("click", (e) => {
      e.stopPropagation();
      const pageNumber = document.getElementById("page-no");
      if (Number(pageNumber.textContent) < totalPages) {
        fetch(
          `${domain}user_files/${localStorage.getItem("username")}/${
            Number(pageNumber.textContent) + 1
          }/`
        )
          .then((response) => {
            if (!response.ok) throw new Error("network response was not ok");
            console.log("triggered");
            return response.json();
          })
          .then((result) => {
            objectsArray = result.files;
            pageNumber.textContent = `${Number(pageNumber.textContent) + 1}`;
            showObjects(objectsArray);
            showObjects(objectsArray);
          })
          .catch((error) => console.error("error", error));
      }
    });

    // search objects
    const objectElementsSearch = document.getElementById("search");
    objectElementsSearch.addEventListener("input", (e) => {
      filteredObjects = objectsArray.filter((item) =>
        item.originalFileName
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
      );
      showObjects(filteredObjects);
    });

    const userElementsSearch = document.getElementById("search-people");
    userElementsSearch.addEventListener("input", (e) => {
      filteredUsers = users.filter((item) =>
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      showUsers(filteredUsers);
    });

    function showPopupMenu(e, object) {
      // making the options menu popup
      function makePopupMenu() {
        // delete
        function deleteObject(e) {
          // const currentTarget = e.currentTarget;
          const objectElement =
            e.currentTarget.parentNode.parentNode.parentNode.parentNode
              .parentNode;
          e.currentTarget.parentNode.parentNode.parentNode.parentNode.remove();
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
          ).then((response) => {
            if (!response.ok)
              throw new Error("network response was not ok", response.status);
            // return response.json();
            objectElement.remove();
            // alert(
            //   "object deleted successfully, you can reload the page to see the updated file list"
            // );
          });
        }
        // share
        function shareObject(e) {
          const objectElement =
            e.currentTarget.parentNode.parentNode.parentNode.parentNode
              .parentNode;
          e.currentTarget.parentNode.parentNode.parentNode.parentNode.remove();

          fetch(`${domain}file-access/${objectElement.id}/`)
            .then((response) => {
              if (!response.ok)
                throw new Error("response network was not ok", response.status);
              return response.json();
            })
            .then((result) => {
              users = result;
              console.log(users);
              // filteredUsers = [...users];
              showUsers(users);
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
                fetch(`${domain}update_access_accounts/`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    fileUpload: Number(objectElement.id),
                    userIds: Array.from(document.querySelectorAll(".person"))
                      .map((person) => {
                        if (person.getElementsByTagName("input")[0].checked)
                          return Number(person.id);
                      })
                      .filter((item) => item !== undefined),
                  }),
                }).then((response) => {
                  if (!response.ok) {
                    throw new Error(
                      "network response was not ok",
                      response.status
                    );
                    alert("network response was not ok");
                  }
                  return response.json();
                });
                // function updateCheckboxes() {
                //   for (let id of temp.userIds) {
                //     document.getElementById(`user${id}`).checked = true;
                //   }
                // }
                // updateCheckboxes();
              };
            });

          const overlay = document.querySelector(".overlay");
          const form = document.querySelector(".addpeople");

          overlay.classList.add("active");
          setTimeout(() => {
            form.classList.add("active");
          }, 0);
        }
        // download
        function downloadObject(e) {
          console.log("download", e.currentTarget);
          e.currentTarget.parentNode.parentNode.parentNode.parentNode.remove();
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
          if (optionText === "Download") {
            const link = document.createElement("a");
            link.setAttribute("href", object.downloadLink);
            link.setAttribute("style", "display: none");
            link.setAttribute("target", "_blank");
            button.appendChild(link);
          }

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

      let coordinates, selectedObjectElement;
      if (e.currentTarget.nodeName === "BUTTON") {
        const button = e.currentTarget;
        selectedObjectElement = button.parentNode;
        coordinates = button.getBoundingClientRect();
      } else if (e.currentTarget.nodeName === "DIV") {
        selectedObjectElement = e.currentTarget;
        coordinates = selectedObjectElement
          .getElementsByTagName("button")[0]
          .getBoundingClientRect();
      }
      const optionsMenu = makePopupMenu();
      if (Math.round(coordinates.bottom + 206) > window.innerHeight) {
        optionsMenu.style.left = `${Math.round(coordinates.left - 243)}px`;
        optionsMenu.style.bottom = `${Math.round(
          window.innerHeight - coordinates.bottom
        )}px`;
      } else {
        optionsMenu.style.left = `${Math.round(coordinates.left - 243)}px`;
        optionsMenu.style.top = `${Math.round(coordinates.bottom)}px`;
      }
      console.log("selected", selectedObjectElement);
      console.log("coordinates", coordinates);
      console.log("bottom", optionsMenu.style.bottom);
      console.log("top", optionsMenu.style.top);
      console.log("left", optionsMenu.style.left);
      selectedObjectElement.appendChild(optionsMenu);
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
      const objectElement = document.createElement("div");
      objectElement.classList.add("object");
      objectElement.setAttribute("id", id);

      const objImg = document.createElement("div");
      objImg.classList.add("obj__img");

      const img = document.createElement("img");
      img.setAttribute("src", imgPath);
      img.setAttribute("alt", imgAlt);
      objImg.appendChild(img);

      objectElement.appendChild(objImg);

      const objDesc = document.createElement("div");
      objDesc.classList.add("obj__desc");

      const objName = document.createElement("h3");
      objName.textContent = name;

      // 2024-06-30
      // 16:48:20.032Z
      const objInfo = document.createElement("p");

      function month(number) {
        if (Number(number) === 1) return "Jan";
        if (Number(number) === 2) return "Feb";
        if (Number(number) === 3) return "Mar";
        if (Number(number) === 4) return "Apr";
        if (Number(number) === 5) return "May";
        if (Number(number) === 6) return "Jun";
        if (Number(number) === 7) return "Jul";
        if (Number(number) === 8) return "Aug";
        if (Number(number) === 9) return "Sep";
        if (Number(number) === 10) return "Oct";
        if (Number(number) === 11) return "Nov";
        if (Number(number) === 12) return "Dec";
        return "Oct";
      }
      let [size, date] = description.split(" - ");
      size = (Math.round((Number(size) / 1024) * 100) / 100).toString() + "KB";
      let [dateDay, dateHour] = date.split("T");
      date =
        dateHour.split(":")[0] +
        ":" +
        dateHour.split(":")[1] +
        ", " +
        dateDay.split("-")[2] +
        " " +
        month(dateDay.split("-")[1]);
      objInfo.textContent = size + " - " + date;

      objDesc.appendChild(objName);
      objDesc.appendChild(objInfo);

      objectElement.appendChild(objDesc);

      const button = document.createElement("button");
      button.setAttribute("type", "button");

      const buttonImg = document.createElement("img");
      buttonImg.setAttribute("src", "/icons/options.svg");
      buttonImg.setAttribute("alt", "three dot options icon");

      button.appendChild(buttonImg);

      objectElement.appendChild(button);

      return objectElement;
    }

    function showObjects(array) {
      if (document.querySelectorAll(".object"))
        document.querySelectorAll(".object").forEach((obj) => obj.remove());

      array.forEach((object) => {
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

    function showUsers(array) {
      if (document.querySelectorAll(".person"))
        document.querySelectorAll(".person").forEach((item) => item.remove());

      // sorting array based on access value and lastname
      array.sort((a, b) => {
        if (a.hasAccess === b.hasAccess) {
          const lastNameA = a.name.trim().split(" ")[
            a.name.trim().split(" ").length - 1
          ];
          const lastNameB = b.name.trim().split(" ")[
            b.name.trim().split(" ").length - 1
          ];
          return lastNameA.localeCompare(lastNameB);
        }
        return b.hasAccess - a.hasAccess;
      });

      array.forEach((user) => {
        if (user.name !== localStorage.getItem("username")) {
          const person = makeUser(
            user.id,
            `${domain2}${user.name}.jpg`,
            user.name,
            user.email,
            user.hasAccess
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
        }
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

    function hideForm(e) {
      e.stopPropagation();
      const overlay = document.querySelector(".overlay");
      const form = document.querySelector(".addpeople");
      form.classList.remove("active");
      setTimeout(() => {
        overlay.classList.remove("active");
      }, 500);
    }

    let sendUsers;
    document.querySelector(".addpeople").addEventListener("submit", (e) => {
      e.preventDefault();
      sendUsers();
      hideForm(e);
    });

    // console.log(objects);
    // console.log(users);
  })
  .catch((error) => console.error("error", error));
