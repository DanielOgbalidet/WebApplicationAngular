import { IHouse } from "./house";
import { IOrder } from "./order";

export interface IUser {
  UserId: number;
  FirstName: string;
  LastName: string;
  Address: string;
  Number: string;
  Email: string;
  Houses: IHouse[];
  Order: IOrder[]; 
  // Other user properties...
}