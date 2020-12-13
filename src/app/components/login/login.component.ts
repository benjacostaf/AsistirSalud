import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent{
  hide=true;
  constructor(
    private _loginService: LoginService,    
    private router: Router,
    private _snackBar:MatSnackBar,
  ) { }

  signIn(username:string, password:string){
    console.log(username,password);
    if(username.length>0 && password.length>0){
      this._loginService.signIn(username,password).subscribe((data:any) => {
        /* if(data['status']) */
        console.log(data.status);
        console.log(data.token);
        this._loginService.writeToken(data.token);
        this._loginService.writeRole(data.role);
        this._loginService.isAdmin();
        this.router.navigate(['/home']).then(()=>{window.location.reload();window.location.reload()});
      },
      (error)=>{
        this._snackBar.open('Usuario o Contraseña Incorrectos','',{duration: 2000});
      });
    }else{
      console.log('Ingrese datos válidos por favor!');
    }
  } 

}
