import { IHouse } from "../houses/house";
import { IOrder } from "../Order/order";

export interface IUser {
  UserId: number;
  FirstName: string;
  LastName: string;
  Address: string;
  Number: string;
  Email: string;
  Houses: IHouse[];
  Order: IOrder[];
  Password: string;
  // Other user properties...
}
