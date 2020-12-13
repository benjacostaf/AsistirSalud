import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Checkup } from '../models/checkup';

@Injectable({
  providedIn: 'root'
})
export class CheckupService {
  /* public url = 'https://api.asistirsalud.com.ar/api/checkup'; */
  public url = 'http://localhost:8000/api/checkup';
  constructor(
    private http: HttpClient
  ) { }

  getCheckups():Observable<any>{
    return this.http.get(this.url);
  }

  getCheckupbyId(id:number):Observable<any>{
    return this.http.get(this.url+"/"+id);
  }

  getCheckupbyBnftLndr(id_b:number, id_l:number):Observable<any>{
    return this.http.get(this.url+"/bl/"+id_b+"/"+id_l);
  }

  newCheckup(chckup: Checkup):Observable<any>{
    const body = new HttpParams()
    .set('id_benefit', (chckup.id_benefit).toString())
    .set('id_lender', (chckup.id_lender).toString())
    .set('description', chckup.description)
    .set('time_at', chckup.time_at)
    .set('geo_lat', chckup.geo_lat)
    .set('geo_long', chckup.geo_long)

    return this.http.post(this.url+ "/register",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')});
  }

}
