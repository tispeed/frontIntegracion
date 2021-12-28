import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<any>(`${environment.url_api}/users/all`);
  }

  getElement(id: string) {
    return this.http.get<any>(`${environment.url_api}/users/get/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(`${environment.url_api}/users/create`, data);
  }

  update(id: number, changes: any) {
    return this.http.put<any>(`${environment.url_api}/users/update/${id}`, changes);
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.url_api}/users/delete/${id}`);
  }
}
