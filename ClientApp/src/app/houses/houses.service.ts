import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHouse } from './house';
import { IOrder } from '../Order/order';
//import { get } from 'http';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  private baseUrl = 'api/house';

  constructor(private _http: HttpClient) { }

  getHouses(): Observable<IHouse[]> {
    return this._http.get<IHouse[]>(this.baseUrl);
  }

  // Goes to the order controller
  createOrder(newOrder: IOrder): Observable<any> {
    const createUrl = `api/order/createOrder`;
    return this._http.post<IOrder>(createUrl, newOrder);
  }

  createHouse(newHouse: IHouse): Observable<any> {
    const createUrl = 'api/house/create';
    return this._http.post<any>(createUrl, newHouse);
  }

  createDirGridImg(imgFile: File, address: string): Observable<any> {
    const formData = new FormData();
    formData.append('gridImg', imgFile);
    formData.append('address', address);

    const gridImgUrl = 'api/house/createDirGridImg';
    return this._http.post<any>(gridImgUrl, formData);
  }

  uploadImages(images: File[], address: string): Observable<any> {
    const formData = new FormData();
    for (let i = 0; i < images.length; i++) {
      formData.append('imageFiles', images[i])
    }
    formData.append('address', address);
    const uploadImgUrl = 'api/house/uploadImg';
    return this._http.post<any>(uploadImgUrl, formData);
  }

  getHouseById(houseId: number): Observable<any> {
    const url = `${this.baseUrl}/${houseId}`;
    return this._http.get(url);
  }

  getListings(email: string): Observable<IHouse[]> {
    const url = `${this.baseUrl}/listings/${email}`;
    return this._http.get<IHouse[]>(url);
  }

  updateHouse(houseId: number, newHouse: any): Observable<any> {
    const url = `${this.baseUrl}/update/${houseId}`;
    newHouse.houseId = houseId;
    return this._http.put<any>(url, newHouse);
  }

  deleteHouse(houseId: number): Observable<any> {
    const url = `${this.baseUrl}/delete/${houseId}`;
    return this._http.delete(url);
  }

  getNumberOfFiles(address: string): Observable<number> {
    const apiUrl = `api/house/numberOfFiles?address=${address}`;
    return this._http.get<number>(apiUrl);
  }

  showId(email: string): Observable<number> {
    const url = `${this.baseUrl}/showId/${email}`;
    return this._http.get<number>(url);
  }

}
