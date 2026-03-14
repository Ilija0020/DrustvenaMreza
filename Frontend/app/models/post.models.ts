import { User } from "./user.model";

export interface Post {
  id?: number;
  userId: number;
  content: string;
  createdDate: string | Date;
  author?: User;
}
