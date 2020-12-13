import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse, HttpHeaders, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLogin } from '../models/userlogin';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public username:string;
  public password:string;
  /* public url = 'https://api.asistirsalud.com.ar/api'; */
  public url = 'http://localhost:8000/api';
  public admin = false;



  constructor( private http: HttpClient) {}

  signUp(ul:UserLogin):Observable<any>{
    const body = new HttpParams()
    .set('username', ul.username)
    .set('password', ul.password)
    .set('password_confirmation', ul.password)

    console.log(body);
    return this.http.post(this.url + "/register",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  });
  }

  /* signIn(username:string, password:string): Observable<any>{
    //let credentials = JSON.stringify(new UserLogin(username,password));
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);
    return this.http.post(this.url + "/login",
       body.toString(),
       {
         headers: new HttpHeaders()
         .set('Access-Control-Allow-Origin', '*')
         .set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
         .set('Access-Control-Allow-Credentials','true')
         .set('Content-Type', 'application/x-www-form-urlencoded')
         .set('Access-Control-Allow-Headers','Access-Control-Allow-Headers, Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')
       }
       );
  } */
  signIn(username:string, password:string){
    //let credentials = JSON.stringify(new UserLogin(username,password));
    const body = new HttpParams()
      .set('username', username)
      .set('password', password)
    return this.http.post(this.url + "/login",
    body.toString(),
    { headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
  });
  }

  getLastUserLogin():Observable<any>{
    return this.http.get(this.url + "/last");
  }

  isLogin(){
    if(localStorage.getItem('token')){
      return true;
    }
  }

  isAdmin():boolean{
    const role = localStorage.getItem('role');
    if(role == '1'){
      this.admin = true;
      return true;
    }else{
      this.admin = false;
      return false;
    }
  }

  writeData(role,id){
    localStorage.setItem('role', JSON.stringify(role));
    localStorage.setItem('id_user', JSON.stringify(id));
  }

  writeToken(tkn:string){
    localStorage.setItem('token', JSON.stringify(tkn));
  }

  writeRole(rle:number){
    localStorage.setItem('role', JSON.stringify(rle));
  }

  getAuthToken(){
    if(localStorage.getItem('token')){
      return JSON.parse(localStorage.getItem('token'));
    }
  }

  writeProfile(id:number){
    localStorage.setItem('id_user', JSON.stringify(id));
  }

  getProfile(){
    if(localStorage.getItem('id_user')){
      return JSON.parse(localStorage.getItem('id_user'));
    }
  }

  deleteToken(){
    localStorage.removeItem('token');
  }

  deleteRole(){
    localStorage.removeItem('role');
  }

  deleteProfile(){
    localStorage.removeItem('id_user');
  }

}
