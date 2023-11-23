import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IHouse } from './house';

@Injectable({
  providedIn: 'root'
})
export class HouseService {

  private baseUrl = 'api/house';

  constructor(private _http: HttpClient) { }

  getHouses(): Observable<IHouse[]> {
    return this._http.get<IHouse[]>(this.baseUrl);
  }

  createHouse(newHouse: IHouse): Observable<any> {
    const createUrl = 'api/house/create';
    return this._http.post<any>(createUrl, newHouse);
  }

  createDirGridImg(imgFile: File, address: string): Observable<any> {
    const formData = new FormData();
    formData.append('gridImg', imgFile);
    formData.append('address', address);

    const gridImgUrl = 'api/house/createDir';
    return this._http.post<any>(gridImgUrl, formData);
  }

  getHouseById(houseId: number): Observable<any> {
    const url = `${this.baseUrl}/${houseId}`;
    return this._http.get(url);
  }

  getListings(userId: number): Observable<IHouse[]> {
    const url = `${this.baseUrl}/listings/${userId}`;
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

}
