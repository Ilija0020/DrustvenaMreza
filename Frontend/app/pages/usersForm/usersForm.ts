import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";

const userService = new UserService();

function showSpinner(): void {
  const spinner = document.querySelector("#loadingSpinner") as HTMLElement;
  if (spinner) spinner.style.display = "block";
}

function hideSpinner(): void {
  const spinner = document.querySelector("#loadingSpinner") as HTMLElement;
  if (spinner) spinner.style.display = "none";
}

function initialize(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  const saveBtn = document.querySelector("#saveUserBtn") as HTMLButtonElement;
  const addTitle = document.querySelector("#addTitle") as HTMLHeadingElement;
  const editTitle = document.querySelector("#editTitle") as HTMLHeadingElement;
  if (userId) {
    if (addTitle) addTitle.style.display = "none";
    if (editTitle) editTitle.style.display = "block";

    userService.getById(parseInt(userId)).then((user) => {
      (document.querySelector("#username") as HTMLInputElement).value =
        user.username;
      (document.querySelector("#firstName") as HTMLInputElement).value =
        user.firstName;
      (document.querySelector("#lastName") as HTMLInputElement).value =
        user.lastName;
      (document.querySelector("#dateOfBirth") as HTMLInputElement).value =
        user.dateOfBirth.toString().split("T")[0];
    });
    if (saveBtn) {
      saveBtn.addEventListener("click", editUser);
    }
  } else {
    if (addTitle) addTitle.style.display = "block";
    if (editTitle) editTitle.style.display = "none";
    if (saveBtn) {
      saveBtn.addEventListener("click", saveNewUser);
    }
  }

  const cancelBtn = document.querySelector("#cancelBtn") as HTMLButtonElement;
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "../users/users.html";
    });
  }
}

function saveNewUser(): void {
  const saveBtn = document.querySelector("#saveUserBtn") as HTMLButtonElement;
  const globalError = document.querySelector(
    "#globalError",
  ) as HTMLParagraphElement;

  if (globalError) {
    globalError.textContent = "";
    globalError.classList.add("hidden");
  }
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
  }

  const newUser = collectData();
  if (!newUser) {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save User";
    }
    return;
  }
  showSpinner();

  userService
    .create(newUser)
    .then(() => {
      window.location.href = "../users/users.html";
    })
    .catch((error) => {
      console.error("Error creating user: ", error.status, error.message);
      hideSpinner();
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save User";
      }
      if (globalError) {
        globalError.textContent =
          "Došlo je do greške na serveru: " + error.message;
        globalError.classList.remove("hidden");
      }
    });
}

function editUser(): void {
  const saveBtn = document.querySelector("#saveUserBtn") as HTMLButtonElement;
  const globalError = document.querySelector(
    "#globalError",
  ) as HTMLParagraphElement;

  if (globalError) {
    globalError.textContent = "";
    globalError.classList.add("hidden");
  }
  if (saveBtn) {
    saveBtn.disabled = true;
    saveBtn.textContent = "Saving...";
  }
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get("id");

  const userData = collectData();
  if (!userData || !userId) {
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save User";
    }
    return;
  }
  showSpinner();

  userService
    .update(parseInt(userId), userData)
    .then(() => {
      window.location.href = "../users/users.html";
    })
    .catch((error) => {
      console.error("Error updating user: ", error.status, error.message);
      hideSpinner();
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save User";
      }
      if (globalError) {
        globalError.textContent =
          "Došlo je do greške na serveru: " + error.message;
        globalError.classList.remove("hidden");
      }
    });
}

function collectData(): User {
  const username = (document.querySelector("#username") as HTMLInputElement)
    .value;
  const firstName = (document.querySelector("#firstName") as HTMLInputElement)
    .value;
  const lastName = (document.querySelector("#lastName") as HTMLInputElement)
    .value;
  const dateOfBirth = (
    document.querySelector("#dateOfBirth") as HTMLInputElement
  ).value;

  if (!username || !firstName || !lastName || !dateOfBirth) {
    alert("All fields are required!");
    return;
  }
  const newUser: User = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
  };
  return newUser;
}

document.addEventListener("DOMContentLoaded", initialize);
