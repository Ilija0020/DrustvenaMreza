import { Group } from "../../models/group.model";
import { GroupService } from "../../services/group.service";

const groupService = new GroupService();

function showSpinner(): void {
  const spinner = document.querySelector("#loadingSpinner") as HTMLElement;
  if (spinner) spinner.style.display = "block";
}

function hideSpinner(): void {
  const spinner = document.querySelector("#loadingSpinner") as HTMLElement;
  if (spinner) spinner.style.display = "none";
}

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
  const saveBtn = document.querySelector("#saveGroupBtn") as HTMLButtonElement;
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

  const nameInput = document.querySelector("#groupName") as HTMLInputElement;
  const nameError = document.querySelector("#nameError") as HTMLSpanElement;

  if (nameError) nameError.textContent = "";

  const groupName = nameInput ? nameInput.value.trim() : "";

  if (!groupName) {
    if (nameError) nameError.textContent = "Name field is required.";
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.textContent = "Save Group";
    }
    return;
  }

  const newGroup: Group = {
    name: groupName,
    createdDate: new Date().toISOString().split("T")[0], // Generiše današnji datum u YYYY-MM-DD formatu
  };
  showSpinner();

  groupService
    .create(newGroup)
    .then(() => {
      window.location.href = "../groups/groups.html";
    })
    .catch((error) => {
      console.error("Error:", error.message);
      hideSpinner();
      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.textContent = "Save Group";
      }

      if (globalError) {
        globalError.textContent =
          "Došlo je do greške na serveru: " + error.message;
        globalError.classList.remove("hidden");
      }
    });
}

document.addEventListener("DOMContentLoaded", initializeAddGroup);
