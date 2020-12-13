import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public auth:boolean=false;
  public id_user:number;
  public name:string;
  public adminLoged = false;
  constructor(
    private _loginService: LoginService,
    private _userService: UserService
  ) { }

  async ngOnInit():Promise<void> {
    await this.isAdminLoged();
  }

  isLogin(){
    return new Promise(async resolve=>{      
      resolve(this.auth = await this._loginService.isLogin());
    });
  }

  isAdminLoged(){
    return new Promise(resolve=>{
      resolve(this.adminLoged = this._loginService.admin);
    })
  }

  getName(){
    return new Promise(async resolve=>{
      await this.getProfile();
      await this._userService.getUser(this.id_user).subscribe((u:any)=>{
        resolve(this.name = `${u.user.surname}, ${u.user.name}`);
    });
    })
    
  }

  getProfile(){
    return new Promise(async resolve=>{
      resolve(this.id_user = await this._loginService.getProfile());
    });
  }

}
