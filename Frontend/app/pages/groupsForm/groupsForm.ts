import { Group } from "../../models/group.model";
import { GroupService } from "../../services/group.service";

const groupService = new GroupService();

function initializeAddGroup(): void {
  // Kažemo TypeScript-u da su ovo dugmići
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
  // Dohvatamo input polje i span za grešku
  const nameInput = document.querySelector("#groupName") as HTMLInputElement;
  const nameError = document.querySelector("#nameError") as HTMLSpanElement;

  // Resetujemo poruku o grešci
  if (nameError) nameError.textContent = "";

  // Uzimamo vrednost i sklanjamo prazne prostore
  const groupName = nameInput ? nameInput.value.trim() : "";

  // Validacija: Da li je polje prazno?
  if (!groupName) {
    if (nameError) nameError.textContent = "Name field is required.";
    return;
  }

  // Pravimo objekat koji se savršeno poklapa sa našim Group modelom
  const newGroup: Group = {
    name: groupName,
    createdDate: new Date().toISOString().split("T")[0], // Generiše današnji datum u YYYY-MM-DD formatu
  };

  // Pozivamo naš servis
  groupService
    .create(newGroup)
    .then(() => {
      // Ako je uspešno, vraćamo se na tabelu
      window.location.href = "../groups/groups.html";
    })
    .catch((error) => {
      console.error("Error:", error.message);
      // Hvatanje statusa 400 koji baca tvoj C# (BadRequest)
      if (error.status === 400) {
        if (nameError) nameError.textContent = "Invalid data sent to server.";
      } else {
        alert("An error occurred while communicating with the server.");
      }
    });
}

// Pokrećemo skriptu tek kada se HTML učita
document.addEventListener("DOMContentLoaded", initializeAddGroup);
