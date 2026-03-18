import { User } from "../models/user.model";

export class GroupMembersService {
  private baseUrl: string;

  constructor() {
    // Osnovni URL do kog idemo, a posle ćemo dodavati ID-jeve
    this.baseUrl = "http://localhost:5152/api/groups";
  }

  // 1. DOHVATANJE ČLANOVA GRUPE (GET api/groups/{groupId}/users)
  getUsersInGroup(groupId: number): Promise<User[]> {
    return fetch(`${this.baseUrl}/${groupId}/users`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        return response.json();
      })
      .then((data: User[]) => {
        return data;
      })
      .catch((error) => {
        console.error(
          "Greska pri dohvatanju clanova grupe:",
          error.status,
          error.message,
        );
        throw error;
      });
  }

  // 2. DODAVANJE KORISNIKA U GRUPU (PUT api/groups/{groupId}/users/{userId})
  addUserToGroup(groupId: number, userId: number): Promise<void> {
    return fetch(`${this.baseUrl}/${groupId}/users/${userId}`, {
      method: "PUT",
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        // Backend vraća Ok() bez podataka, pa ne zovemo response.json()
      })
      .catch((error) => {
        console.error(
          "Greska pri dodavanju korisnika u grupu:",
          error.status,
          error.message,
        );
        throw error;
      });
  }

  // 3. IZBACIVANJE KORISNIKA IZ GRUPE (DELETE api/groups/{groupId}/users/{userId})
  removeUserFromGroup(groupId: number, userId: number): Promise<void> {
    return fetch(`${this.baseUrl}/${groupId}/users/${userId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        // Backend vraća NoContent() bez podataka, pa ne zovemo response.json()
      })
      .catch((error) => {
        console.error(
          "Greska pri brisanju korisnika iz grupe:",
          error.status,
          error.message,
        );
        throw error;
      });
  }
}
