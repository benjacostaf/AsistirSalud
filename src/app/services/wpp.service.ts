import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WppService {
  public urlDesktop = 'https://web.whatsapp.com/';
  public urlMobile = 'whatsapp://';
  

  constructor(
    private http: HttpClient
  ) { }

  isMobile(){
    if(sessionStorage.desktop)
    return false;
    else if(localStorage.mobile)
    return true;
  }

  sendMessage(msg:string, phone:number){
    console.log(phone);
    let message = 'send?phone=54' + phone +  `&text=${msg}`;
    if(this.isMobile()){
      window.open(this.urlMobile + message);
    } else{
      window.open(this.urlDesktop + message);
    }
  }


}
