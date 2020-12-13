import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Lender } from 'src/app/models/lender';
import { User } from 'src/app/models/user';
import { LenderService } from 'src/app/services/lender.service';
import { UserService } from 'src/app/services/user.service';
import { async } from '@angular/core/testing';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NewLenderComponent } from '../new-lender/new-lender.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { WppService } from 'src/app/services/wpp.service';
import { MatSort } from '@angular/material/sort';

export interface lenderUser{
  id_user:number,
  id_lender: number,
  specialism:string,
  surname:string,
  name: string,
  address:string,
  location: string,
  email:string,
  phone: number,
  status: number,
  updated_at: ''
}

@Component({
  selector: 'app-lender',
  templateUrl: './lender.component.html',
  styleUrls: ['./lender.component.scss']
})
export class LenderComponent implements OnInit, AfterViewInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild('dialog1451') private dialogApiError1451: TemplateRef<any>;
  public dataSource = new MatTableDataSource;
  public allLenders:Lender[]=[];
  public allUsers:User[]=[];
  public allData:lenderUser[] = [];
  public idLenderDelete:number = 0;
  public lenderAux: lenderUser;

  constructor(
    private _lenderService: LenderService,
    private _userService: UserService,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _loginService: LoginService,
    private _wppService: WppService,
    private router: Router,
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  ngOnInit(): void {
    this.getData();
  }

  displayedColumns: string[]=['surname', 'specialism', 'location', 'status', 'more'];

/*   async getData(){
    return new Promise(async resolve=>{

    await this.getLenders();
    await this.getUsers();
    const qlenders = this.allLenders.length;
    console.log(qlenders);
    console.log(this.allUsers.length);
        let user:User;
        let lender:Lender;
        for(let index=0;index<qlenders;index++){
          user = this.allUsers[index];
          lender = this.allLenders[index];

          await this.allData.push(this.replaceData(user,lender));
        }
    resolve(this.dataSource.data = this.allData);
  })
  } */

  getData(){
    this.allUsers= [];
    this.allData=[];
    this.dataSource.data = [];
    return new Promise(async resolve=>{
    await this.getLenders();
    await this.getUsers();
      this.allLenders.forEach(async lnd=>{
        for (let index = 0; index < this.allUsers.length; index++) {
          if(lnd.id_user == this.allUsers[index].id){
            await this.allData.push(this.replaceData(this.allUsers[index],lnd));
            index = this.allUsers.length;
          }
        }
      })
      resolve(this.dataSource.data = this.allData);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  replaceData(user:User, lender:Lender):lenderUser{
    console.log(user,lender);
    let lenderUser:lenderUser = {
      id_user:0,
      id_lender: 0,
      specialism:'',
      surname:'',
      name: '',
      address:'',
      location: '',
      email:'',
      phone: 0,
      status: 1,
      updated_at: ''
                };
                console.log(user);

      lenderUser.id_user = user.id;
      lenderUser.surname = user.surname;
      lenderUser.name = user.name;
      lenderUser.address = user.address;
      lenderUser.location = user.location;
      lenderUser.email = user.email;
      lenderUser.phone = user.phone;
      lenderUser.status = lender.status;
      lenderUser.id_lender = lender.id;
      lenderUser.specialism = lender.specialism;

      return lenderUser;
  }

  openMenu(r:any){
    console.log(r);
  }

  getLenders(){
    return new Promise(resolve => {
      this._lenderService.getLenders().subscribe(
        async(lnd:any)=>{
        resolve(this.allLenders = lnd['Lenders']);
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
    });
  }

 /*  getUsers(){
    return new Promise(resolve => {
      this._userService.getUsers().subscribe((usrs:any)=>{
        for (let index = 0; index < usrs['users'].length; index++) {
          if(usrs['users'][index]['role'] == 2){
            resolve(this.allUsers.push(usrs['users'][index]));
          }
        }
      })
    })
  } */

  getUsers(){
    return new Promise(resolve=>{
      this._userService.getUsers().subscribe((us:any)=>{
        resolve(this.allUsers = us['users']);
      });
    })

  }

  editLender(lender){
    console.log(lender);
    this.router.navigate(['/editar-prestador'],{state:{data: lender}});
  }

  contactLender(lender){
    this._wppService.sendMessage('',lender.phone);
  }

  deleteLender(lender){
    this._lenderService.deleteLender(lender.id_lender).subscribe(()=>{
      const noti = this._snackBar.open('El prestador fue eliminado correctamente','OK',{duration: 2000});
      noti.afterDismissed().subscribe(()=>{
        this.getData();
        this.table.renderRows();
      });
    },
    (error)=>{
      console.log(error);
      //const noti = this._snackBar.open('Error al eliminar prestador','OK',{duration: 2000});
      /* console.log(error.error.error.errorInfo[1]);
      const nroError = error.error.error.errorInfo[1];
      if(nroError == 1451){
        console.log(this.dialogApiError1451);
        const noti = this.openDialogNotif(this.dialogApiError1451);
        this.idLenderDelete = lender.id_lender;
        const noti = this.openDialogNotif();
      } */
    });
  }

  openDialogNotif(templateRef){
    this._dialog.open(templateRef);

  }

  openNewLender(){
    const newLenderBottomSheet = this._bottomSheet.open(NewLenderComponent);
    newLenderBottomSheet.afterDismissed().subscribe(()=>{
      this.table.renderRows();
    })
  }

  okDeleteAll(){
    this._lenderService.deleteLenderData(this.idLenderDelete).subscribe((p:any)=>{
      console.log(p);
      const noti = this._snackBar.open('Se eliminó el prestador y toda su información correctamente', 'OK', {duration: 2000});
      noti.afterDismissed().subscribe(()=>{
        this.table.renderRows();
      })
    },
    (error)=>{
      console.log(error);
    })
  }

  public logOut(){
    this._loginService.deleteToken();
    this._loginService.deleteRole();
    this._loginService.deleteProfile();
    this.router.navigate(['/']).then(()=>{window.location.reload()});
  }
}
