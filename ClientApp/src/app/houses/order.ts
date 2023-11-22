import { IHouse } from "./house";
import { IUser } from "./user";

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
