import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransfersService {

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<any>(`${environment.url_api}/transfers/all`);
  }

  getElement(id: string) {
    return this.http.get<any>(`${environment.url_api}/transfers/get/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(`${environment.url_api}/transfers/create`, data);
  }

  update(id: string, changes: any) {
    return this.http.put<any>(`${environment.url_api}/transfers/update/${id}`, changes);
  }

  delete(id: string) {
    return this.http.delete<any>(`${environment.url_api}/transfers/delete/${id}`);
  }
  getByRangeDate(data: any){
    return this.http.post<any>(`${environment.url_api}/transfers/getbyrangedate`, data);
  }
  changeStatus(data: any){
    return this.http.post<any>(`${environment.url_api}/transfers/changestatus`, data);
  }
}
