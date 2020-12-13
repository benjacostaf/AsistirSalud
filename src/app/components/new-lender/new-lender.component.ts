import { Component, ComponentFactoryResolver, OnInit } from '@angular/core';
import { UserLogin} from 'src/app/models/userlogin';
import { User} from 'src/app/models/user';
import { Lender} from 'src/app/models/lender';
import { UserService } from 'src/app/services/user.service';
import { LenderService } from 'src/app/services/lender.service';
import { LoginService } from 'src/app/services/login.service';
import { WppService } from 'src/app/services/wpp.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-lender',
  templateUrl: './new-lender.component.html',
  styleUrls: ['./new-lender.component.scss']
})
export class NewLenderComponent implements OnInit {
  hide=true;
  public dataUser:User={
    id:0,
    id_user_login:0,
    role:2,
    surname: '',
    name: '',
    address: '',
    location: '',
    email: '',
    phone: 0
  }

  public dataLogin:UserLogin={
    username: '',
    password: '',
    status: 1
  }

  public dataLender:Lender={
    id: 0,
    id_user: 0,
    specialism: '',
    enrolment: 0,
    hours_avaibles: 0,
    status: 1
  }

  userLoginId=0;
  userId=0;


  constructor(
    private _loginService: LoginService,
    private _userService: UserService,
    private _lenderService: LenderService,
    private _wppService: WppService,
    private _router: Router,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }


  async guardarRegistro(){
    await this.saveLogin();
    await this.getLastLogin();
    await this.saveUser();
    await this.getLastUser();
    await this.saveLender();    
  }

  sendMessage(){
    let msg=`${this.dataUser.name} te damos la bienvenida al equipo de Asistir Salud! %0A 
    Tus credenciales para acceder a nuestra plataforma son: %0A
    App: https://app.asistirsalud.com.ar %0A
    Usuario: ${this.dataLogin.username}%0A
    Contraseña: ${this.dataLogin.password}%0A
    `;

    this._wppService.sendMessage(msg,this.dataUser.phone);
  }

  getLastLogin(){
    return new Promise(resolve => {
      this._loginService.getLastUserLogin().subscribe((response:any)=>{
        resolve(this.userLoginId = (response['Last UserLogin']['id']));
      });
    })
  }

  getLastUser(){
    return new Promise(resolve => {
      this._userService.getLastUser().subscribe((response:any)=>{
        console.log(response);
        resolve(this.userId = (response['Last User']['id']));
      });
    })
  }


  saveLogin(){
    this._loginService.signUp(this.dataLogin).subscribe((response:any)=>{
      console.log(response);
    });
  }

  saveUser(){
    this.dataUser.id_user_login = this.userLoginId;
    console.log(this.dataUser);
    this._userService.newUser(this.dataUser).subscribe((response:any)=>{
      console.log(response);
    });
  }

  saveLender(){
    this.dataLender.id_user = this.userId;
    console.log(this.dataLender);
    this._lenderService.newLender(this.dataLender).subscribe((response:any)=>{
      console.log(response);
      const noti = this._snackBar.open('Prestador Creado Correctamente','OK');
      noti.onAction().subscribe(()=>{
        this.sendMessage();
        this._router.navigateByUrl("/prestadores");
      })
    });
  }






  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

}
