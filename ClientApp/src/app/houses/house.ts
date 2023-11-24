import { IOrder } from "../Order/order";
import { IUser } from "../users/user";

export interface IHouse {
  HouseId: number;
  Price: number;
  Address: string;
  ImageUrl: string;
  Bedrooms: number;
  Guests: number;
  Description: string;
  UserId: number;
  User: IUser;
  Order: IOrder[]; 
}
