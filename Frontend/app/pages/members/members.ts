import { User } from "../../models/user.model";
import { UserService } from "../../services/user.service";
import { GroupMembersService } from "../../services/group-members.service";

const userService = new UserService();
const groupMembersService = new GroupMembersService();

function initialize(): void {
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get("name");
  const idParam = urlParams.get("id");

  if (!idParam) return;
  const groupId = parseInt(idParam);

  // Menjamo naslove na stranici da sadrže ime grupe
  if (name) {
    const titles = document.querySelectorAll("h2");
    titles.forEach((title) => {
      // TypeScript provera: osiguravamo da textContent postoji
      if (title.textContent) {
        title.textContent =
          title.textContent.split("group")[0] + '"' + name + '" group';
      }
    });
  }

  loadData(groupId);
}

function loadData(groupId: number): void {
  // Promise.all ispaljuje oba zahteva istovremeno i čeka da se oba završe
  Promise.all([
    groupMembersService.getUsersInGroup(groupId),
    userService.getAll(),
  ])
    .then(([usersInGroup, allUsers]) => {
      const usersOutOfGroup = allUsers.filter(
        (user) => !usersInGroup.some((member) => member.id === user.id),
      );

      renderTable("#in-group tbody", usersInGroup, groupId, true);
      renderTable("#out-of-group tbody", usersOutOfGroup, groupId, false);
    })
    .catch((error) => {
      console.error("Greška pri učitavanju podataka:", error);
      alert(
        "Došlo je do greške pri učitavanju članova. Molimo pokušajte ponovo.",
      );
    });
}

function renderTable(
  tableBodySelector: string,
  users: User[],
  groupId: number,
  isMember: boolean,
): void {
  const tableBody = document.querySelector(
    tableBodySelector,
  ) as HTMLTableSectionElement;
  if (!tableBody) return;

  tableBody.innerHTML = "";

  users.forEach((user: User) => {
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
    cell4.textContent = user.dateOfBirth.toString().split("T")[0];
    newRow.appendChild(cell4);

    const cell5 = document.createElement("td");
    const button = document.createElement("button");

    if (isMember) {
      button.textContent = "Remove";
      button.className = "btn btn-danger";
    } else {
      button.textContent = "Insert";
      button.className = "btn btn-primary";
    }

    button.addEventListener("click", () => {
      if (user.id === undefined) return;

      if (isMember) {
        groupMembersService
          .removeUserFromGroup(groupId, user.id)
          .then(() => {
            loadData(groupId);
          })
          .catch(() => alert("Došlo je do greške pri izbacivanju korisnika."));
      } else {
        groupMembersService
          .addUserToGroup(groupId, user.id)
          .then(() => {
            loadData(groupId);
          })
          .catch(() => alert("Došlo je do greške pri ubacivanju korisnika."));
      }
    });

    cell5.appendChild(button);
    newRow.appendChild(cell5);

    tableBody.appendChild(newRow);
  });
}

document.addEventListener("DOMContentLoaded", initialize);
