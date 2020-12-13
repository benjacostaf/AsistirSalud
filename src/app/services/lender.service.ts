import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lender } from '../models/lender';

@Injectable({
  providedIn: 'root'
})
export class LenderService {
  /* public url = 'https://api.asistirsalud.com.ar/api/lender'; */
  public url = 'http://localhost:8000/api/lender';
  constructor(
    private http: HttpClient
  ) { }

  newLender(lnd: Lender): Observable<any> {
    console.log(lnd);
    const body = new HttpParams()
      .set('id_user', (lnd.id_user).toString())
      .set('specialism', lnd.specialism)
      .set('enrolment', (lnd.enrolment).toString())
      .set('hours_avaibles', (lnd.hours_avaibles).toString())
      .set('status', '1')

    return this.http.post(this.url + "/register",
      body.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      });
  }

  deleteLender(id_l: number): Observable<any> {
    const body = new HttpParams()
      .set('id_lender', (id_l).toString())
    return this.http.post(this.url + "/delete",
      body.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      });
  }

  deleteLenderData(id_l: number): Observable<any> {
    const body = new HttpParams()
      .set('id_lender', (id_l).toString())
      console.log(body);
      return this.http.post(this.url + "/deleteData",
      body.toString(),
      {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
      });
  }

  updateLender(dataLender):Observable<any> {
    const body = new HttpParams()
    .set('id_lender', (dataLender.id_lender).toString())
    .set('id_user', (dataLender.id_user).toString())
    .set('specialism', (dataLender.specialism))
    .set('surname', (dataLender.surname))
    .set('name', (dataLender.name))
    .set('address', (dataLender.address))
    .set('location', (dataLender.location))
    .set('email', (dataLender.email))
    .set('phone', (dataLender.phone).toString())
    .set('status', (dataLender.status).toString())
    return this.http.post(this.url + "/update",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')});
  }



  getLenders(): Observable<any> {
    return this.http.get(this.url);
  }

  getLender(id: number): Observable<any> {
    return this.http.get(this.url + "/" + id);
  }

  getLastLender(): Observable<any> {
    return this.http.get(this.url + "/last");
  }


  getLenderUserId(id_u): Observable<any> {
    return this.http.get(this.url + "/lenderuser/" + id_u);
  }



}
