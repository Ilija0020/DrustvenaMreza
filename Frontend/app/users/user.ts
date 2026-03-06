import { User } from "../models/user.model";
import { UserService } from "../services/user.service";

const userService = new UserService();

function initialize() {
  const addBtn = document.querySelector("#addBtn") as HTMLButtonElement;
  if (addBtn) {
    addBtn.addEventListener("click", () => {
      window.location.href = "../usersForm/usersForm.html";
    });
  }
  getAllUsers();
}

function getAllUsers() {
  userService
    .getAll()
    .then((users: User[]) => {
      renderData(users);
    })
    .catch((error) => {
      console.error("Greska pri ucitavanju podataka:", error);
      const table = document.querySelector("table");
      if (table) table.style.display = "none";
      alert("Doslo je do greske pri ucitavanju podataka.");
    });
}

function renderData(data: User[]) {
  const tableBody = document.querySelector(
    "table tbody",
  ) as HTMLTableSectionElement;
  const tableHeader = document.querySelector(
    "table thead",
  ) as HTMLTableSectionElement;
  const noDataMessage = document.querySelector(
    "#no-data-message",
  ) as HTMLElement;

  if (!tableBody || !tableHeader || !noDataMessage) return;
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableHeader.classList.add("hidden");
    noDataMessage.classList.remove("hidden");
  } else {
    tableHeader.classList.remove("hidden");
    noDataMessage.classList.add("hidden");
  }

  data.forEach((user: User) => {
    const newRow = document.createElement("tr");

    const cell1 = document.createElement("td");
    cell1.textContent = user.username;
    newRow.appendChild(cell1);

    const cell2 = document.createElement("td");
    cell2.textContent = user.firstName;
    newRow.appendChild(cell2);

    const cell3 = document.createElement("td");
    cell3.textContent = user.lastName;
    newRow.appendChild(cell3);

    const cell4 = document.createElement("td");
    const date = new Date(user.dateOfBirth);
    cell4.textContent = date.toISOString().split("T")[0];
    newRow.appendChild(cell4);

    const cell5 = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.className = "btn-primary";
    editBtn.addEventListener("click", () => {
      window.location.href = `../usersForm/usersForm.html?id=${user.id}`;
    });
    cell5.appendChild(editBtn);
    newRow.appendChild(cell5);

    tableBody.appendChild(newRow);
  });
}

document.addEventListener("DOMContentLoaded", initialize);
