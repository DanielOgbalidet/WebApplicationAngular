import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IUser } from './user';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  private baseUrl = 'api/user';

  constructor(private _http: HttpClient) { }

  checkLogin(email: string, password: string): Observable<boolean> {
    const params = {
      email: email,
      password: password,
    };

    const url = 'api/user/login';
    return this._http.get<boolean>(url, { params })
  }

  createUser(newUser: IUser): Observable<any> {
    const createUrl = 'api/user/createUser';
    return this._http.post<any>(createUrl, newUser);
  }
}
