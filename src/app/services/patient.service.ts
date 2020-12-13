import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Patient} from '../models/patient';
@Injectable({
  providedIn: 'root'
})
export class PatientService {
  /* public url = 'https://api.asistirsalud.com.ar/api/patient'; */
  public url = 'http://localhost:8000/api/patient';
  constructor(
    private http: HttpClient
   ) { }

  getPatients():Observable<any>{
    return this.http.get(this.url);
  }

  getPatient(id:number):Observable<any>{
    return this.http.get(this.url+"/"+ id);
  }

  newPatient(np:Patient):Observable<any>{
    const body = new HttpParams()
      .set('surname', np.surname)
      .set('name', np.name)
      .set('dni', (np.dni).toString())
      .set('health_insurance', (np.health_insurance).toString())
      .set('number_health_insurance', (np.number_health_insurance).toString())
      .set('address', np.address)
      .set('location', np.location)
      .set('years', (np.years).toString())
      .set('email', np.email)
      .set('phone', (np.phone).toString())
    console.log(body);
    return this.http.post(this.url + "/register",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  });

  }

  updatePatient(dataPatient):Observable<any> {
    const body = new HttpParams()
    .set('id', (dataPatient.id).toString())
    .set('surname', dataPatient.surname)
    .set('name', dataPatient.name)
    .set('health_insurance', dataPatient.health_insurance)
    .set('number_health_insurance', (dataPatient.number_health_insurance).toString())
    .set('address', dataPatient.address)
    .set('location', dataPatient.location)
    .set('years', (dataPatient.years).toString())
    .set('email', dataPatient.email)
    .set('phone', (dataPatient.phone).toString())
    .set('status', (dataPatient.status).toString())
    console.log(body);
    return this.http.post(this.url+"/update",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')});
  }

  deletePatient(id_p:number):Observable<any>{
    const body = new HttpParams()
    .set('id_patient', (id_p).toString())
    return this.http.post(this.url + "/delete",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  });
  }
}
