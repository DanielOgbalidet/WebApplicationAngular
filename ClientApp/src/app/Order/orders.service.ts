import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IOrder } from './order';

@Injectable({
  providedIn: 'root'
})

export class OrderService {

  private baseUrl = 'api/order';

  constructor(private _http: HttpClient) { }

  /*
  createOrder(newOrder: IOrder): Observable<any> {
    const createUrl = 'api/order/createOrder';
    return this._http.post<any>(createUrl, newOrder.StartDate, newOrder.EndDate, newOrder.HouseId, newOrder.TotalPrice, newOrder.User.Email);
  }
  */

  getOrderById(orderId: number): Observable<any> {
    const url = `${this.baseUrl}/${orderId}`;
    return this._http.get(url);
  }

  getOrders(userId: number): Observable<IOrder[]> {
    const url = `${this.baseUrl}/orders/${userId}`;
    return this._http.get<IOrder[]>(url);
  }

  updateOrder(orderId: number, newOrder: any): Observable<any> {
    const url = `${this.baseUrl}/updateOrder/${orderId}`;
    newOrder.orderId = orderId;
    return this._http.put<any>(url, newOrder);
  }

  deleteOrder(orderId: number): Observable<any> {
    const url = `${this.baseUrl}/deleteOrder/${orderId}`;
    return this._http.delete(url);
  }

}
