import { Component,Input,OnInit } from '@angular/core';
import { LoginService } from './services/login.service';
import { UserService } from './services/user.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  public auth:boolean = false;  
  public role:number = 0;
  public myId:number = 0;
    constructor(
    private _loginService: LoginService,
    private _userService: UserService,
    private router: Router,
    private _snackBar: MatSnackBar
  ){}

  async ngOnInit(): Promise<void> {
    if(this._loginService.isLogin()){
      this.auth=true;
    }else{
      this.router.navigate(['/login']);
    }    
  }


  public logOut(){
    this._loginService.deleteToken();
    this._loginService.deleteRole();
    this._loginService.deleteProfile();
    this.router.navigate(['/']).then(()=>{window.location.reload()});
  }



  title = 'AS';
}
