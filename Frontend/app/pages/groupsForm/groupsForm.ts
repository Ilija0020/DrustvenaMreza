import { Group } from "../../models/group.model";
import { GroupService } from "../../services/group.service";

const groupService = new GroupService();

function initializeAddGroup(): void {
  const saveBtn = document.querySelector("#saveGroupBtn") as HTMLButtonElement;
  const cancelBtn = document.querySelector("#cancelBtn") as HTMLButtonElement;

  if (saveBtn) {
    saveBtn.addEventListener("click", saveNewGroup);
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      window.location.href = "../groups/groups.html";
    });
  }
}

function saveNewGroup(): void {
  const nameInput = document.querySelector("#groupName") as HTMLInputElement;
  const nameError = document.querySelector("#nameError") as HTMLSpanElement;

  if (nameError) nameError.textContent = "";

  const groupName = nameInput ? nameInput.value.trim() : "";

  if (!groupName) {
    if (nameError) nameError.textContent = "Name field is required.";
    return;
  }

  const newGroup: Group = {
    name: groupName,
    createdDate: new Date().toISOString().split("T")[0], // Generiše današnji datum u YYYY-MM-DD formatu
  };

  groupService
    .create(newGroup)
    .then(() => {
      window.location.href = "../groups/groups.html";
    })
    .catch((error) => {
      console.error("Error:", error.message);
      if (error.status === 400) {
        if (nameError) nameError.textContent = "Invalid data sent to server.";
      } else {
        alert("An error occurred while communicating with the server.");
      }
    });
}

document.addEventListener("DOMContentLoaded", initializeAddGroup);
