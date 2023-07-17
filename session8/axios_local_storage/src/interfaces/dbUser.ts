import { DbAttachment } from "./dbAttachment";

export interface DbUser {
  user_id: number;
  username: string;
  password: string;
  photo: DbAttachment[]
}
