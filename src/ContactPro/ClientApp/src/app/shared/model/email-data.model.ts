import { IContact } from "./contact.model";

export interface IEmailData {
  id?: number;
  subject?: string;
  body?: string;
  contacts?: IContact[];
  isCategory?: boolean;
}

export const defaultValue: Readonly<IEmailData> = {
  isCategory: false,
};
