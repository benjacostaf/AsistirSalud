import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { BenefitItem } from 'src/app/models/benefitItem';
import { Lender } from 'src/app/models/lender';
import { User } from 'src/app/models/user';
import { ItemRequirementService } from 'src/app/services/item-requirement.service';
import { LenderService } from 'src/app/services/lender.service';
import { UserService } from 'src/app/services/user.service';
import { NewBenefitComponent } from '../new-benefit.component';


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


@Component({
  selector: 'app-new-requirement',
  templateUrl: './new-requirement.component.html',
  styleUrls: ['./new-requirement.component.scss']
})

export class NewRequirementComponent implements OnInit {

  controlLender = new FormControl();
  selectLenderName: string;
  resultLenders:Lender[] = [];
  resultUsers:User[] = [];
  optionsLender: sLender[] = [];
  filteredOptions: Observable<string[]>;
  auxLender: sLender = {index:0,id_lender: 0,display:''};
  selectIndication: string = '';
  selectHours: number = 0;
  selectReq:string = '';
  selectLenderId: number = 0;
  public itemRequirement:BenefitItem = {
    id: 0,
    id_benefit: 0,
    id_lender: 0,
    requirements: '',
    indications: '',
    hours: 0,
    status: 0
  };

  public itemReqTable:tableReq = {
    id_lender: 0,
    lender: '',
    req: '',
    ind: '',
    hs: 0
  }



  constructor(
    private _bottomSheet: MatBottomSheetRef<NewBenefitComponent>,
    private _lenderService: LenderService,
    private _userService: UserService,
    private _itemRequerimentService: ItemRequirementService
  ) { }

  async ngOnInit() {
    this.filteredOptions = this.controlLender.valueChanges
    .pipe(
      startWith(''),
      map(lndr => this._filterLenders(lndr))
    );
    await this.getDataLenders();
    /* await this.getLendersUsers(); */
    console.log(this.optionsLender);
  }

  getLenderSelected(){
    this.controlLender.valueChanges.subscribe(valuel=>{
      console.log(valuel);
      if(this.selectLenderId!=0){



        console.log(this.selectLenderId);
      }else{
        console.log('no se selecciono lender aun');
      }

    });
  }

  setLenderSelect(indexLender:number, idLender:number){
    this.selectLenderId = idLender;
    this.selectLenderName = `${this.resultUsers[indexLender].surname}, ${this.resultUsers[indexLender].name}`;
    for (let index = 0; index < this.resultLenders.length; index++){
      if(this.resultLenders[index].id == idLender){
        this.selectReq = this.resultLenders[index].specialism;
      }
    }

  }

  _filterLenders(value:string):string[]{
    const filterValueL = value.toLowerCase();
    return this.optionsLender['display'].filter(option => option.toLowerCase().includes(filterValueL));
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

  openLink(event:MouseEvent):void{
    this._bottomSheet.dismiss();
  }

  addRequirement(){
    this.itemReqTable.id_lender = this.selectLenderId;
    this.itemReqTable.lender = this.selectLenderName;
    console.log(this.selectReq);
    this.itemReqTable.req = this.selectReq;
    this.itemReqTable.ind = this.selectIndication;
    this.itemReqTable.hs = this.selectHours;
    this._itemRequerimentService.setItemTable(this.itemReqTable);
    this._bottomSheet.dismiss();
  }
}
