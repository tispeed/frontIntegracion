import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<any>(`${environment.url_api}/settings/all`);
  }

  getElement(id: string) {
    return this.http.get<any>(`${environment.url_api}/settings/get/${id}`);
  }

  create(data: any) {
    return this.http.post<any>(`${environment.url_api}/settings/create`, data);
  }

  update(id: string, changes: any) {
    return this.http.put<any>(`${environment.url_api}/settings/update/${id}`, changes);
  }

  delete(id: string) {
    return this.http.delete<any>(`${environment.url_api}/settings/delete/${id}`);
  }
  getByRangeDate(data: any){
    return this.http.post<any>(`${environment.url_api}/settings/getbyrangedate`, data);
  }
  changeStatus(data: any){
    return this.http.post<any>(`${environment.url_api}/settings/changestatus`, data);
  }
  changeAccountingAccount(data: any){
    return this.http.post<any>(`${environment.url_api}/settings/changeaccountingaccount`, data);
  }
}
