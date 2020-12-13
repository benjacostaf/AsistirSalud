import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public myUser: User;
  /* public url = 'https://api.asistirsalud.com.ar/api/user'; */
  public url = 'http://localhost:8000/api/user';

  constructor(
    private http: HttpClient
  ) { }

    newUser(u:User):Observable<any>{
      console.log(u);
      const body = new HttpParams()
      .set('id_user_login', (u.id_user_login).toString())
      .set('role', (u.role).toString())
      .set('surname', u.surname)
      .set('name', u.name)
      .set('address', u.address)
      .set('location', u.location)
      .set('email', u.email)
      .set('phone', (u.phone).toString())

      return this.http.post(this.url+ "/register",
      body.toString(),
      { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    });
    }

    getUsers():Observable<any>{
      return this.http.get(this.url);
    }

    getUser(id:number):Observable<any>{
      return this.http.get(this.url + "/" + id);
    }

    getProfile():Observable<any>{
      return this.http.get(this.url + "/profile");
    }

    getUserLoginId(id_login:number){
      return this.http.get(this.url+"/userlogin/"+id_login);
    }

    getLastUser():Observable<any>{
      return this.http.get(this.url + "/last");
    }

    getUserLender(id_l):Observable<any>{
      return this.http.get(this.url + "/lnd/"+id_l);
    }

}
