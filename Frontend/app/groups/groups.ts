import { Group } from "../models/group.model";
import { GroupService } from "../services/group.service";

const groupService = new GroupService();

function initializeGroups(): void {
  // TypeScript zahteva da mu kažemo koji je tačno HTML element u pitanju
  const addBtn = document.querySelector("#addGroupBtn") as HTMLButtonElement;

  if (addBtn) {
    addBtn.addEventListener("click", () => {
      window.location.href = "../groupsForm/groupsForm.html";
    });
  }

  getAllGroups();
}

function getAllGroups(): void {
  // Ovde sada pozivamo naš uredan servis, a ne sirov fetch
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
  // Dodajemo tipove za elemente iz tabele
  const tableBody = document.querySelector(
    "#groups-tbody",
  ) as HTMLTableSectionElement;
  const tableHeader = document.querySelector(
    "table thead",
  ) as HTMLTableSectionElement;
  const noDataMessage = document.querySelector(
    "#no-data-message",
  ) as HTMLParagraphElement;

  // Sigurnosna provera da TypeScript ne bi prijavljivao greške da elementi možda ne postoje
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

      // 1. Naziv grupe
      const cellName = document.createElement("td");
      cellName.textContent = group.name;
      cellName.style.fontWeight = "bold";
      newRow.appendChild(cellName);

      // 2. Datum kreiranja grupe
      const cellDate = document.createElement("td");
      const dateString = group.createdDate.toString().split("T")[0];
      cellDate.textContent = dateString;
      newRow.appendChild(cellDate);

      // 3. Dugme za članove
      const cellMembers = document.createElement("td");
      const membersBtn = document.createElement("button");
      membersBtn.textContent = "View Members";
      membersBtn.className = "btn-add";

      membersBtn.addEventListener("click", () => {
        window.location.href = `../members/members.html?id=${group.id}&name=${encodeURIComponent(group.name)}`;
      });

      cellMembers.appendChild(membersBtn);
      newRow.appendChild(cellMembers);

      // 4. Dugme za brisanje
      const cellDelete = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.className = "btn-delete";

      deleteButton.addEventListener("click", () => {
        if (confirm(`Da li želite da obrišete grupu: ${group.name}?`)) {
          // TypeScript pametno upozorava da 'id' može biti undefined (jer je opcioni u modelu), pa moramo to da proverimo
          if (group.id !== undefined) {
            groupService
              .delete(group.id)
              .then(() => {
                getAllGroups(); // Osvežavamo tabelu nakon uspešnog brisanja
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
