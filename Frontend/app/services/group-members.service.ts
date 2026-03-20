import { User } from "../models/user.model";

export class GroupMembersService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = "http://localhost:5152/api/groups";
  }

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
