import { IUser } from "app/shared/model/user.model";
import { IContact } from "app/shared/model/contact.model";

export interface ICategory {
  id?: number;
  name?: string;
  created?: string | null;
  user?: IUser | null;
  contacts?: IContact[] | null;
}

export const defaultValue: Readonly<ICategory> = {};
