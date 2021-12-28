import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicationModulesService {

  constructor(
    private http: HttpClient
  ) { }

  getAll() {
    return this.http.get<any>(`${environment.url_api}/application-modules/all`);
  }
}
