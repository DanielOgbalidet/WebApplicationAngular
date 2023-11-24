import { IHouse } from "../houses/house";
import { IUser } from "../users/user";

export interface IOrder {
  OrderId: number;
  OrderDate: string;
  UserId: number;
  User: IUser;
  HouseId: number;
  House: IHouse;
  StartDate: string;
  EndDate: string;
  TotalPrice: number; 
} 
