import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReceptionsService {

  constructor(
    private http: HttpClient
  ) { }

  getDIRecepcionesDFbyRangeDate(data: any){
    return this.http.post<any>(`${environment.url_api}/receptions/direcepcionesdf/getbyrangedate`, data);
  }

  getDIRecepcionesDFbyRangeDateAndFolio(folio:any,data: any){
    return this.http.post<any>(`${environment.url_api}/receptions/direcepcionesdf/getbyrangedateandfolio/${folio}`, data);
  }

  getDIRecepcionesGFAUTbyRangeDate(data: any){
    return this.http.post<any>(`${environment.url_api}/receptions/direcepcionesgfaut/getbyrangedate`, data);
  }
  getDIRecepcionesGFAUTbyRangeDateAndReserva(reserva:any,data: any){
    return this.http.post<any>(`${environment.url_api}/receptions/direcepcionesgfaut/getbyrangedateandreserva/${reserva}`, data);
  }
}
