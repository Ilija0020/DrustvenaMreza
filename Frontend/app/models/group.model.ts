import { User } from "./user.model";

export interface Group {
  id?: number;
  name: string;
  createdDate: string | Date;
  members?: User[];
}
