import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Benefit } from 'src/app/models/benefit';
import { BenefitItem } from 'src/app/models/benefitItem';
import { HealthInsurance } from 'src/app/models/healthInsurance';
import { Lender } from 'src/app/models/lender';
import { Patient } from 'src/app/models/patient';
import { User } from 'src/app/models/user';
import { BenefitService } from 'src/app/services/benefit.service';
import { HealthInsuranceService } from 'src/app/services/health-insurance.service';
import { LenderService } from 'src/app/services/lender.service';
import { PatientService } from 'src/app/services/patient.service';
import { UserService } from 'src/app/services/user.service';

interface selectOption {
  value: number;
  display: string;
}
export interface tableItems{
  id: number;
  name: string;
  req: string;
  ind: string;
}

export interface sLender{
  index: number;
  id_lender:number;
  display:string;
}

export interface tableReq{
  id_lender: number;
  lender: string;
  req: string;
  ind: string;
  hs: number;
}

export interface tableLenders{
  id: number; //id == id_item == id benefit item
  id_benefit: number;
  id_lender: number;
  index: number;
  name: string;
  req: string;
  ind: string;
  hs: number;
  status:number;
  updatedDate: string;
}


@Component({
  selector: 'app-edit-benefit',
  templateUrl: './edit-benefit.component.html',
  styleUrls: ['./edit-benefit.component.scss']
})
export class EditBenefitComponent implements OnInit {
  @ViewChild('editLenderTemplate') private dialogEditLender: TemplateRef<any>;
  @ViewChild('newReqTemplate') private dialogNewReq: TemplateRef<any>;
  @ViewChild(MatTable) table: MatTable<any>;
  public resultPatients:Patient[] = [];
  public optionsPatient:selectOption[] = [];
  public optionsAuxPatient:selectOption[] = [];
  public selectPatient: selectOption = {value: 0,display: ''};
  public hIData:HealthInsurance[] = [];
  public selectHI:HealthInsurance =  new HealthInsurance('','','',0,0);
  public selectLenderEdit:tableLenders = {id:0,id_benefit: 0,id_lender:0,index:0,name:'',req:'',ind:'',hs:0, status:0, updatedDate: ''};
  public resultLenders:Lender[] = [];
  public selectLenderId: number = 0;
  public resultUsers:User[] = [];
  public resultItems:BenefitItem[] = [];
  public dataItems:tableLenders[] = [];
  public auxLenderEdit:tableLenders = {id:0,id_benefit:0,id_lender:0,index:0,name:'',req:'',ind:'',hs:0, status: 0, updatedDate: ''};
  public auxName:string = '';
  public items:tableLenders[] = [];
  public auxItems = new MatTableDataSource;
  public dataReq:tableLenders[] = [];
  public updatedTimeLender: Date;

  optionsLender: sLender[] = [];
  myControl = new FormControl();
  statusData: selectOption[] = [
    {value: 0, display: 'Eliminado'},
    {value: 1, display: 'Activo'}
  ];
  statusBenefitData: selectOption[] = [
    {value: 0, display: 'Eliminado'},
    {value: 1, display: 'Activo'},
    {value: 2, display: 'Inactivo'},
    {value: 3, display: 'Difunto'},
    {value: 4, display: 'Completado'},
    {value: 5, display: 'Cobrado'},
    {value: 6, display: 'Cobro pendiente'}
  ];
  selectedStatus: selectOption = {value: 0,display: ''};
  public data = history.state.data;

  displayedColumns: string[] = ['Lender', 'Requirement', 'Indication', 'Hours', 'status', 'Options'];


  constructor(
    private _bottomSheet:MatBottomSheet,
    private _dialog: MatDialog,
    private _patientService: PatientService,
    private _hiService: HealthInsuranceService,
    private _lenderService: LenderService,
    private _userService: UserService,
    private _benefitService: BenefitService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  async ngOnInit():Promise<void>{

    console.log(this.data);
    /* let items = this.data.items; */
    /* console.log(items); */
    await this.getDataReq();
    await this.setDataItems();
    console.log(this.auxItems);
    /* this.getItems(); */
    console.log(this.items);
    /* this.getItemsData(this.items); */
    this.getPatient();
    this.getHI();
    this.selectedStatus.value = this.data.benefit.status;
    this.getDataLenders();
  }

  selectedPatient(id_p:number){
    console.log(id_p);
    for (let index = 0; index < this.resultPatients.length; index++) {
      if(id_p == this.resultPatients[index].id){
        this.selectHI.id = Number(this.resultPatients[index].health_insurance);
        this.data.benefit.number_health_insurance = this.resultPatients[index].number_health_insurance;
        this.data.benefit.id_patient = id_p;
        index = this.resultPatients.length;
      }
    }
  }


  getItemsData(items:[]){
    for (let index = 0; index < items.length; index++) {
      let laux:tableLenders = {
        id : items[index]['id'],
        id_benefit: items[index]['id_benefit'],
        id_lender : items[index]['id_lender'],
        index: index,
        name: items[index]['name'],
        req: items[index]['req'],
        ind: items[index]['ind'],
        hs: items[index]['hs'],
        status: items[index]['status'],
        updatedDate: items[index]['updated_at']
      }
      this.dataItems.push(laux);
      console.log(laux);
    }
    console.log(this.dataItems);
  }

  getItems(){
    return new Promise(resolve=>{
      this._benefitService.getItemsBenefit(this.data.benefit.id_benefit).subscribe((its:any)=>{
        console.log(its);
        this.resultItems = its['BenefitItems'];
        console.log(this.resultItems);
      });
    });
  }

  getHI():Promise<HealthInsurance>{
    return new Promise(resolve=>{
      this._hiService.getHealthInsurance().subscribe((hi:any)=>{
        this.selectHI.id = Number(this.data.benefit.health_insurance);
        console.log(this.selectHI);
        resolve(this.hIData = hi['HealthInsurances']);
      });
    });
  }

  selectLender(lender:sLender){
    console.log(lender);
    this.selectLenderId = lender.id_lender;
    for(let index = 0;index<this.resultLenders.length;index++){
      if(this.resultLenders[index].id==lender.id_lender){
        this.auxLenderEdit.req = this.resultLenders[index].specialism;
        this.auxName = lender.display.substr(0,lender.display.indexOf(','));
        index=this.resultLenders.length;
      }
    }
  }


  async getPatient(){
    let auxResult: selectOption[] = [];
    let auxPatient: selectOption = { value: 0, display: '' };
    await this._patientService.getPatients().subscribe(async (p: any) => {
      this.resultPatients = p['Patients'];
      await this.getPatientsDisplay(this.resultPatients);
      console.log(this.optionsPatient);
    });
  }

  getPatientsDisplay(array: Patient[]){
    array.forEach(element => {
      return new Promise(async resolve => {
        console.log(element);
        await resolve(this.optionsAuxPatient.push(this.assignmentDataPatien(element)));
      })
    });

    this.optionsPatient = this.optionsAuxPatient;
    console.log(this.optionsPatient);
  }

  assignmentDataPatien(element: Patient): any {
    let patient: selectOption = { value: 0, display: '' };
    patient.display = `${element['surname']}, ${element['name']} - ${element['dni']} - ${element['location']} - ${element['years']} Años`;
    console.log(element.id);
    patient.value = element.id;
    if(element.id == this.data.benefit.id_patient){
      this.selectPatient = patient;
    }
    return patient;
  }



  editLender(lender:tableLenders){
    console.log(lender);
    this.auxLenderEdit = lender;
    this.updatedTimeLender = new Date(this.auxLenderEdit.updatedDate);
    console.log(this.auxLenderEdit);
    this._dialog.open(this.dialogEditLender);
  }

  saveAuxLender(lender:tableLenders){
    this.auxLenderEdit = lender;
  }


  async getDataLenders(){
    /* return new Promise(async resolve=>{
      await this.getLenders();
      await this.getUsers();
      resolve(this.getLendersUsers());
      console.log(this.optionsLender);
    }) */
    await this.getLenders();
    await this.getUsers();
    await this.getLendersUsers();
  }

  getLenders(){
    return new Promise(resolve=>{
      this._lenderService.getLenders().subscribe((response:any)=>{
        console.log(response);
        resolve(this.resultLenders = response['Lenders']);
      });
    })
  }

  getUsers(){
    return new Promise(resolve=>{
    this._userService.getUsers().subscribe((response:any)=>{
      console.log(response);
      resolve(this.resultUsers = response['users']);
    });
  });
  }

  getLendersUsers(){
    return new Promise(resolve=>{
      this.resultLenders.forEach(async element => {
        console.log(element);
        resolve(await this.replaceLenderUser(element));
      });
    })
  }

  replaceLenderUser(lender:Lender){
    return new Promise(resolve=>{
      /* this.auxLender.id = lender.id; */
      let userId = lender.id_user;
      let specialism = lender.specialism;
      /* this.selectReq = specialism; */
      let userIndex = 0;
      console.log(userId);
      userIndex = this.getIndexUser(userId);
      console.log(userId);
      console.log(userIndex);
      const lenderAux:sLender = {index:userIndex, id_lender: lender.id, display:`${this.resultUsers[userIndex].surname} ${this.resultUsers[userIndex].name}, ${this.resultUsers[userIndex].location}, ${specialism}`}
      resolve(this.pushLenders(lenderAux));
    });
  }

  pushLenders(lender:sLender){
    this.optionsLender.push(lender);
  }

  getIndexUser(userId:number){
    let userI = 0;
      for (let index = 0; index < this.resultUsers.length; index++) {
        console.log(this.resultUsers[index]);
        console.log(userId);
        if(this.resultUsers[index].id==userId){
          console.log('iguales');
          userI = index;
          index = this.resultUsers.length;
        }
      }
      console.log(userI);
      return userI;

  }

  async saveEditLender(){
    console.log(this.auxLenderEdit);
    let item = new BenefitItem(
      this.auxLenderEdit.id_benefit,
      this.auxLenderEdit.id_lender,
      this.auxLenderEdit.req,
      this.auxLenderEdit.ind,
      this.auxLenderEdit.hs,
      this.auxLenderEdit.status,
      this.auxLenderEdit.id
    );
    await this._benefitService.updateItem(item).subscribe(async (r:any)=>{
      console.log(r);
      await this._dialog.closeAll();
      await this.getDataReq();
    }),
    (error)=>{
      console.log(error);
    };

  }

  deleteLender(lender:tableLenders){
    this._benefitService.deleteBenefitItem(lender.id).subscribe(async (r:any)=>{
      console.log(r);
      await this.getDataReq();
    })
  }

  openNewReq(){
    this.auxLenderEdit = {id:0,id_benefit:0,id_lender:0,index:0,name:'',req:'',ind:'',hs:0, status: 0, updatedDate: ''};
    this._dialog.open(this.dialogNewReq);
  }

  saveNewReq(){
    let item = new BenefitItem(
      this.data.benefit.id_benefit,
      this.selectLenderId,
      this.auxLenderEdit.req,
      this.auxLenderEdit.ind,
      this.auxLenderEdit.hs,
      this.auxLenderEdit.status,
      this.auxLenderEdit.id
    );
    this._benefitService.newBenefitItem(item).subscribe(async (r:any)=>{
      console.log(r);
      this._dialog.closeAll();
      await this.getDataReq();
    }),
    (error)=>{{
      console.log(error);
    }}
  }

  updateDataBenefit(){
    let b = new Benefit(
      this.data.benefit.id_patient,
      this.data.benefit.diagnosis,
      this.data.benefit.start_at,
      this.data.benefit.finish_at,
      this.data.benefit.status,
      this.data.benefit.id_benefit
    );

    this._benefitService.updateBenefit(b).subscribe((r:any)=>{
      console.log(r);
      this._snackBar.open('Prestación modificada exitosamente','OK').onAction().subscribe(()=>{
        this.router.navigate(['/prestaciones']);
      });
    })
  }

  splitName(sn:string){
    const surname = sn.substr(0,sn.indexOf(' '));
    const name = sn.substr(sn.indexOf(' ')+1,sn.length);
    let data = {
      s: surname,
      n: name
    }
    return data;
  }

  cancel(){
    this.selectLenderEdit = this.auxLenderEdit;
    this._dialog.closeAll();
  }

  getDataReq(){
    let itsArray = [];
    let index = 0;
    this.items = [];
    return new Promise(resolve=>{
      this._benefitService.getItemsBenefit(this.data.benefit.id_benefit).subscribe((its)=>{
        console.log(its);
        index = 0;
        itsArray = its['BenefitItems'];
        resolve(itsArray.forEach(async element => {
          let item:tableLenders = {
            id: element.id,
            id_benefit: element.id_benefit,
            id_lender: element.id_lender,
            index: index,
            name: (await(this.getLenderName(element.id_lender))).toString(),
            req: element.requirements,
            ind: element.indications,
            hs: element.hours,
            status: element.status,
            updatedDate: element.updated_at
          }
          await this.items.push(item);
          console.log(item);
          await this.refresh();
        }));
      });
    })
  }

  getLenderName(id_lender:number){
    return new Promise(resolve=>{
      this._userService.getUserLender(id_lender).subscribe((u:any)=>{
        resolve(`${u.user.surname}, ${u.user.name}`);
      });
    });
  }


  setDataItems(){
    return new Promise(resolve=>{
      resolve(this.auxItems.data = this.items);
    });
  }

  async refresh(){
    this.auxItems.data = [];
    this.auxItems.data = this.items;
    this.table.renderRows();
  }



 // mat-accordion-stepper
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
