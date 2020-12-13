import { OnInit, Pipe, PipeTransform } from '@angular/core';
import { promise } from 'protractor';
import { Patient } from '../models/patient';
import { PatientService } from '../services/patient.service';

@Pipe({
  name: 'patientNames'
})
export class PatientNamesPipe implements PipeTransform {

  resultPatients: Patient[] = [];

  constructor(
    private _patientService:PatientService){      
    }  

  obtenerPacientes(){
    return new Promise(resolve=>{
      this._patientService.getPatients().subscribe(async (p:any)=>{
        resolve(this.resultPatients = p['Patients']);
        console.log(this.resultPatients);
      })
    })
    
  }
  async transform(id:number):Promise<string>{
    let pret = '';
    await this.obtenerPacientes().then(()=>{
    for (let index = 0; index < this.resultPatients.length; index++) {
      if(this.resultPatients[index].id == id){
        pret = `${this.resultPatients[index].surname}, ${this.resultPatients[index].name}`;
        index = this.resultPatients.length;
      }      
    }    
    });   
    return pret;
  }

}
