import dayjs from "dayjs";
import { IUser } from "app/shared/model/user.model";
import { ICategory } from "app/shared/model/category.model";
import { States } from "app/shared/model/enumerations/states.model";

export interface IContact {
  id?: number;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string | null;
  city?: string;
  state?: States;
  zipCode?: string;
  email?: string;
  phoneNumber?: string;
  birthDate?: string | null;
  imageData?: string | null;
  imageType?: string | null;
  created?: string | null;
  user?: IUser | null;
  categories?: ICategory[] | null;
}

export const defaultValue: Readonly<IContact> = {};
