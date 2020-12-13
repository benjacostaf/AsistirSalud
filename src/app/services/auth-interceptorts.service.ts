import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptortsService  implements HttpInterceptor{

  constructor(
    private auth: LoginService
  ) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Get the auth header from your auth service.
    try{const authToken = this.auth.getAuthToken();
    const authReq = req.clone({headers: req.headers.set('Authorization', `bearer ${authToken}`)});
    return next.handle(authReq);}
    catch(error){
      console.log('error');
    }
  }
}
