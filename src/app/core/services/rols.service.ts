import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolsService {

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<any>(`${environment.url_api}/rols/all`);
  }

  getElement(id: string) {
    return this.http.get<any>(`${environment.url_api}/rols/get/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(`${environment.url_api}/rols/create`, data);
  }

  update(id: number, changes: any) {
    console.log("changes:",changes)
    return this.http.post<any>(`${environment.url_api}/rols/update/${id}`, changes);
  }

  delete(id: number) {
    return this.http.delete<any>(`${environment.url_api}/rols/delete/${id}`);
  }
}
