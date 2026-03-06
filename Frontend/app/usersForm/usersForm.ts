import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

const userService = new UserService();

function initialize() {
  const saveBtn = document.querySelector("#saveUserBtn") as HTMLButtonElement;
  if (saveBtn) {
    saveBtn.addEventListener("click", () => {
      saveNewUser();
    });
  }
  const cancelBtn = document.querySelector("#cancelBtn") as HTMLButtonElement;
  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "../users/users.html";
    });
  }
  const addTitle = document.getElementById("addTitle");
  const editTitle = document.getElementById("editTitle");
  if (addTitle) addTitle.style.display = "block";
  if (editTitle) editTitle.style.display = "none";
}

function saveNewUser() {
  const username = (document.getElementById("username") as HTMLInputElement)
    .value;
  const firstName = (document.getElementById("firstName") as HTMLInputElement)
    .value;
  const lastName = (document.getElementById("lastName") as HTMLInputElement)
    .value;
  const dateOfBirth = (
    document.getElementById("dateOfBirth") as HTMLInputElement
  ).value;

  if (!username || !firstName || !lastName || !dateOfBirth) {
    alert("Sva polja su obavezna!");
    return;
  }
  const newUser: User = {
    username: username,
    firstName: firstName,
    lastName: lastName,
    dateOfBirth: dateOfBirth,
  };

  userService
    .create(newUser)
    .then(() => {
      window.location.href = "../users/users.html";
    })
    .catch((error) => {
      console.error("Error creating user: ", error.status, error.message);
      alert("Doslo je do greske pri cuvanju korisnika: " + error.message);
    });
}

document.addEventListener("DOMContentLoaded", initialize);
