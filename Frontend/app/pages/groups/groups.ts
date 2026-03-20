import { Group } from "../../models/group.model";
import { GroupService } from "../../services/group.service";

const groupService = new GroupService();

function initializeGroups(): void {
  const addBtn = document.querySelector("#addGroupBtn") as HTMLButtonElement;

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      window.location.href = "../groupsForm/groupsForm.html";
    });
  }

  getAllGroups();
}

function getAllGroups(): void {
  groupService
    .getAll()
    .then((groups: Group[]) => {
      renderGroups(groups);
    })
    .catch((error) => {
      console.error("Error", error.message);
      const table = document.querySelector("table") as HTMLTableElement;
      if (table) table.style.display = "none";
      alert("An error occurred while loading groups.");
    });
}

function renderGroups(data: Group[]): void {
  const tableBody = document.querySelector(
    "#groups-tbody",
  ) as HTMLTableSectionElement;
  const tableHeader = document.querySelector(
    "table thead",
  ) as HTMLTableSectionElement;
  const noDataMessage = document.querySelector(
    "#no-data-message",
  ) as HTMLParagraphElement;

  if (!tableBody || !tableHeader || !noDataMessage) return;

  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableHeader.classList.add("hidden");
    noDataMessage.classList.remove("hidden");
  } else {
    tableHeader.classList.remove("hidden");
    noDataMessage.classList.add("hidden");

    data.forEach((group: Group) => {
      const newRow = document.createElement("tr");

      const cellName = document.createElement("td");
      cellName.textContent = group.name;
      cellName.style.fontWeight = "bold";
      newRow.appendChild(cellName);

      const cellDate = document.createElement("td");
      const dateString = group.createdDate.toString().split("T")[0];
      cellDate.textContent = dateString;
      newRow.appendChild(cellDate);

      const cellMembers = document.createElement("td");
      const membersBtn = document.createElement("button");
      membersBtn.textContent = "View Members";
      membersBtn.className = "btn btn-primary";

      membersBtn.addEventListener("click", () => {
        window.location.href = `../members/members.html?id=${group.id}&name=${encodeURIComponent(group.name)}`;
      });

      cellMembers.appendChild(membersBtn);
      newRow.appendChild(cellMembers);

      const cellDelete = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "btn btn-danger";

      deleteButton.addEventListener("click", () => {
        if (confirm(`Da li želite da obrišete grupu: ${group.name}?`)) {
          if (group.id !== undefined) {
            groupService
              .delete(group.id)
              .then(() => {
                getAllGroups();
              })
              .catch((err) => {
                console.error("Greška pri brisanju:", err);
                alert("Došlo je do greške pri brisanju grupe.");
              });
          }
        }
      });

      cellDelete.appendChild(deleteButton);
      newRow.appendChild(cellDelete);

      tableBody.appendChild(newRow);
    });
  }
}

document.addEventListener("DOMContentLoaded", initializeGroups);
