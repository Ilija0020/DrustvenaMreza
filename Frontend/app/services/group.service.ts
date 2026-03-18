import { Group, PagedGroupResult } from "../models/group.model";

export class GroupService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = "http://localhost:5152/api/groups";
  }

  // Dohvata SVE grupe (bez paginacije)
  getAll(): Promise<Group[]> {
    return fetch(this.apiUrl)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        return response.json();
      })
      .then((data: Group[]) => {
        return data;
      })
      .catch((error) => {
        console.error(
          "Greska pri dohvatanju svih grupa:",
          error.status,
          error.message,
        );
        throw error;
      });
  }

  // Dohvata grupe sa paginacijom
  getPaged(page: number, pageSize: number): Promise<PagedGroupResult> {
    return fetch(`${this.apiUrl}/paged?page=${page}&pageSize=${pageSize}`)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        return response.json();
      })
      .then((data: PagedGroupResult) => {
        return data; // Vraća objekat { data: Group[], totalCount: number }
      })
      .catch((error) => {
        console.error(
          "Greska pri dohvatanju paged grupa:",
          error.status,
          error.message,
        );
        throw error;
      });
  }

  // Dohvata jednu grupu po ID-ju
  getById(id: number): Promise<Group> {
    return fetch(this.apiUrl + "/" + id)
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        return response.json();
      })
      .then((data: Group) => {
        return data;
      })
      .catch((error) => {
        console.error(
          "Greska pri dohvatanju grupe:",
          error.status,
          error.message,
        );
        throw error;
      });
  }

  // Kreira novu grupu
  create(group: Group): Promise<Group> {
    return fetch(this.apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(group),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        return response.json();
      })
      .then((data: Group) => {
        return data;
      })
      .catch((error) => {
        console.error(
          "Greska pri kreiranju grupe: ",
          error.status,
          error.message,
        );
        throw error;
      });
  }

  // Menja postojeću grupu
  update(id: number, group: Group): Promise<Group> {
    return fetch(this.apiUrl + "/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(group),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((errorMessage) => {
            throw { status: response.status, message: errorMessage };
          });
        }
        return response.json();
      })
      .then((data: Group) => {
        return data;
      })
      .catch((error) => {
        console.error(
          "Greska pri azuriranju grupe: ",
          error.status,
          error.message,
        );
        throw error;
      });
  }

  // Briše grupu
  delete(id: number): Promise<void> {
    return fetch(this.apiUrl + "/" + id, {
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
          "Greska pri brisanju grupe: ",
          error.status,
          error.message,
        );
        throw error;
      });
  }
}
