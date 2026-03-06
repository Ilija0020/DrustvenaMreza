import { User } from "../models/user.model";

export class UserService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:17948/api/users";
  }

  getAll(): Promise<User[]> {
    return fetch(this.apiUrl)
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
        console.error("Greska sa servera:", error.status, error.message);
        throw error;
      });
  }

  create(user: User): Promise<User> {
    return fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        return response.json();
      })
      .then((data: User) => {
        return data;
      })
      .catch((error) => {
        console.error("Error creating user: ", error.status, error.message);
        throw error;
      });
  }
}
