import { Injectable } from '@angular/core';
import { BenefitItem } from '../models/benefitItem';

export interface tableReq{
  id_lender: number;
  lender: string;
  req: string;
  ind: string;
  hs: number;
}



@Injectable({
  providedIn: 'root'
})
export class ItemRequirementService {
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
  constructor() { }

  setItem(bitem: BenefitItem){
    this.itemRequirement = bitem;
  }

  setItemTable(treq: tableReq){
    this.itemReqTable = treq;
  }

  get getItem(){
    return this.itemRequirement;
  }

  getItemTable(){
    return this.itemReqTable;
  }
}
