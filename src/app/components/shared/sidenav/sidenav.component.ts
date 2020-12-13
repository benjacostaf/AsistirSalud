import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { rejects } from 'assert';
import { UserService } from 'src/app/services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();
  /* @Input() role:number; */
  public admin:boolean=false;
  public realoadbar =0;
  public auth = false;
  public role = 0;
  public myId = 0;
  public name: string;
 
  constructor(
    private _loginService: LoginService,
    private _userService: UserService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }
 
  async ngOnInit():Promise<void> {
    if(this._loginService.isLogin()){
      this.auth=true;
      await this.getProfileData();
    }else{
      this.router.navigate(['/login']);
    }      
  }

  isAdmin(){
    return new Promise(async resolve=>{
      const role = await(localStorage.getItem('role'));
      console.log(role);
      if((role)=='1'){        
        console.log(this.role);
        resolve(this.admin = true);
      }});
      
  }
 
  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  getProfileData(){
    return new Promise(resolve=>{
      this._userService.getProfile().subscribe(async (profile:any) => {
        const id_login = profile['user'].id;
        console.log(id_login);
        await this.getCurrentUser(id_login);
        await this.writeData(this.role,this.myId);
        if(this.role == 1){
          this.admin = true;
          this._loginService.admin = true;
        }
      },
      (error)=>{
        console.log(error.error);
        if(error.error=='Unauthorized.'){
          /* this._dialog.open(LoginComponent, {
            width:'400px'
          }); */
          this._snackBar.open('Por razones de seguridad, debe loguearse nuevamente.', 'OK');
          
          this._snackBar._openedSnackBarRef.onAction().subscribe(()=>{
            this.logOut();
          });
        }
      });
    })
  }

  writeData(role,id){
    return new Promise(resolve=>{
      resolve(this._loginService.writeData(role,id));
    })
  }

  public logOut(){
    this._loginService.deleteToken();
    this._loginService.deleteRole();
    this._loginService.deleteProfile();
    this.router.navigate(['/']).then(()=>{window.location.reload()});
  }

  getCurrentUser(id:number){
    return new Promise(resolve=>{
      this._userService.getUserLoginId(id).subscribe((response:any)=>{
        console.log(response);
        this.myId = response['user']['id'];
        this.name = `${response.user.surname}, ${response.user.name}` ;
        resolve(this.role = response['user']['role']);
      })
    })
  }

 
}