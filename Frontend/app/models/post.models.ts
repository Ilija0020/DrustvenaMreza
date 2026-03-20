import { User } from "./user.model";

export interface Post {
  id?: number;
  userId: number;
  content: string;
  date: string | Date;
  author?: User;
}
