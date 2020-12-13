import { Component, OnInit } from '@angular/core';
import { LenderService } from 'src/app/services/lender.service';
import { CheckupService } from 'src/app/services/checkup.service';
import { Benefit } from 'src/app/models/benefit';
import { BenefitService } from 'src/app/services/benefit.service';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { BenefitItem } from 'src/app/models/benefitItem';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { Checkup } from 'src/app/models/checkup';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export interface sBenefit{
  id_benefit: number;
  id_lender: number;
  patient: string;
  requirements: string;
  indications: string;  
}

export interface location{
  longitude:number,
  latitude: number
}


@Component({
  selector: 'app-new-checkup',
  templateUrl: './new-checkup.component.html',
  styleUrls: ['./new-checkup.component.scss']
})
export class NewCheckupComponent implements OnInit {
  public id_lender;
  public selectBenefit;
  public selectText;
  public selectIndications;
  public id_user:number=0;
  selectLocation:location = {longitude:0,latitude:0};
  public resultBenefitItems:BenefitItem[] = [];
  public patientResult:Patient[] = [];
  public sBenefitData:sBenefit[] = [];
  public selectSBenefit:sBenefit;
  public newCheckup:Checkup;


  constructor(
    private _lenderService: LenderService,
    private _checkupService: CheckupService,
    private _loginService: LoginService,
    private _benefitService: BenefitService,
    private _patientService: PatientService,
    private _geolocationService: GeolocationService,
    private _snackBar: MatSnackBar
  ) { }

  async ngOnInit():Promise<void> {
    await this.getBenefitAssigned();
    await this.getLocation();
    console.log(this.selectLocation);
  }
  
  getLocation(){
    return new Promise(resolve=>{
      resolve(this._geolocationService.getPosition().then(data=>this.selectLocation = data));
    })    
  }

  async getBenefitAssigned(){    
    await this.getData();
    this.resultBenefitItems.forEach(async element => {
      this.addSBenefit(await this.setSBenefit(element));
    });
  }

  getUser(){
    return new Promise(async resolve=>{
      const id_user = await this._loginService.getProfile();    
      this._lenderService.getLenderUserId(id_user).subscribe((lender:any)=>{    
        const lnd = lender['Lender'];    
        resolve(this.id_lender = lnd[0].id);
    })
    })
    
  }

  getData(){
    return new Promise(async resolve=>{
      await this.getUser();
      console.log(this.id_lender);
      this._benefitService.getBenefitsByLender(this.id_lender).subscribe((b:any)=>{
        console.log(b);
        resolve(this.resultBenefitItems = b['BenefitItems']);
        console.log(this.resultBenefitItems);
      })
    })
  }
/* 
  getData(){
    return new Promise(resolve=>{
      this.getUser();
      this._benefitService.getBenefitsByLender(1).subscribe((b:any)=>{
        console.log(b);
        resolve(this.resultBenefitItems = b['BenefitItems']);
        console.log(this.resultBenefitItems);
      });
    });    
  } */

  getDataPatient(id_patient:number):Promise<Patient>{
    let pat:Patient;
    return new Promise(resolve=>{
      this._patientService.getPatient(id_patient).subscribe(async (p:any)=>{
        resolve(pat = p['Patient']);
      });
      return pat;
    });    
  }

  getDataBenefit(id_benefit:number):Promise<Benefit>{
    let ben:Benefit;
    return new Promise(resolve=>{
      this._benefitService.getBenefit(id_benefit).subscribe(async(b:any)=>{
        resolve(ben = b['Benefit']);
      });
      return ben;
    }) 
  }

  async setSBenefit(bi:BenefitItem):Promise<sBenefit>{
    const b = this.getDataBenefit(bi.id_benefit);
    console.log(b);
    const p = this.getDataPatient((await b).id_patient);
    const sb:sBenefit = {
      id_benefit: bi.id_benefit,
      id_lender: bi.id_lender,
      patient: `${(await p).surname}, ${(await p).name}`,
      requirements: bi.requirements,
      indications: bi.indications      
    }
    return sb;
  }

  addSBenefit(sb:sBenefit){
    this.sBenefitData.push(sb);
  }

  setBenefitSelected(select:any){
    this.selectIndications = this.selectSBenefit.indications;
    console.log(select.value);
  }

  async saveNewCheckup(){
    await this.setNewCheckup();
    console.log(this.newCheckup);
    this._checkupService.newCheckup(this.newCheckup).subscribe(response=>{
      console.log(response);
      if(response['message']=="CREATED"){
        this.openSnackBar('Su visita fue registrada.','OK');
        this.clearForms();
      }
      else{
        this.openSnackBar('Error al registrar su visita, intente nuevamente.','OK');
      }
    });
  }

  setNewCheckup(){
    let b = false;
    if(this.selectSBenefit===undefined){
      alert('Primero debe seleccionar una prestación!');
    }else{
      b = true;
    } 
    if(b==true){
      return new Promise(resolve=>{
        let date = new Date();
        console.log(this.selectSBenefit);
        
        resolve(this.newCheckup = new Checkup(
                        this.selectSBenefit.id_benefit,
                        this.selectSBenefit.id_lender,
                        this.selectText,
                        this.toMysqlFormat(date),
                        this.selectLocation.latitude.toString(),
                        this.selectLocation.longitude.toString(),
                        0
                        ));
                        console.log(this.newCheckup);
      }); 
    }         
  }

  /**
 * You first need to create a formatting function to pad numbers to two digits…
 **/
twoDigits(d) {
  if(0 <= d && d < 10) return "0" + d.toString();
  if(-10 < d && d < 0) return "-0" + (-1*d).toString();
  return d.toString();
}

/**
* …and then create the method to output the date string as desired.
* Some people hate using prototypes this way, but if you are going
* to apply this to more than one Date object, having it as a prototype
* makes sense.
**/
toMysqlFormat(date:Date){
  return date.getUTCFullYear() + "-" + this.twoDigits(1 + date.getUTCMonth()) + "-" + this.twoDigits(date.getUTCDate()) + " " + this.twoDigits(date.getUTCHours()) + ":" + this.twoDigits(date.getUTCMinutes()) + ":" + this.twoDigits(date.getUTCSeconds());
};


openSnackBar(message: string, action: string){
  this._snackBar.open(message, action, {
    duration: 20000,
  })
}

clearForms(){

}


 
}
