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

  getOrderById(orderId: number): Observable<any> {
    const url = `${this.baseUrl}/getOrderById/${orderId}`;
    return this._http.get(url);
  }

  getOrders(email: string): Observable<IOrder[]> {
    const url = `${this.baseUrl}/orders/${email}`;
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
