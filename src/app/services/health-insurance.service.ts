import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HealthInsurance } from '../models/healthInsurance';

@Injectable({
  providedIn: 'root'
})
export class HealthInsuranceService {
  public url = 'http://localhost:8000/api/health-insurance';
  /* public url = 'https://api.asistirsalud.com.ar/api/health-insurance'; */
  constructor(
    private http: HttpClient
  ) { }

  getHealthInsurance():Observable<any>{
    return this.http.get(this.url);
  }

  newHealthInsurance(hi:HealthInsurance):Observable<any>{
    const body = new HttpParams()
      .set('name', (hi.name).toLowerCase())
      .set('location', (hi.location).toLowerCase())
      .set('email', hi.email)
      .set('phone', (hi.phone).toString())
      .set('status', '1')
    return this.http.post(this.url + "/register",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  });
  }


}
