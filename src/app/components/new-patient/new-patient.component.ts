import { Component, OnInit, Input } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { PatientService } from 'src/app/services/patient.service';
import { Patient } from 'src/app/models/patient';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HealthInsuranceService } from 'src/app/services/health-insurance.service';
import { HealthInsurance } from 'src/app/models/healthInsurance';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent implements OnInit {
  public datosPaciente:Patient = {
    id: 0,
    surname: '',
    name: '',
    dni: 0,
    health_insurance: 0,
    number_health_insurance: 0,
    address: '',
    location: '',
    years:0,
    email: '',
    phone: 0,
    status: 0
  };

  public hIData:HealthInsurance[] = [];
  public selectHI:HealthInsurance = new HealthInsurance('','','',0,0);

  step = 0;
  constructor(
    private _patientService: PatientService,
    private _hiService: HealthInsuranceService,
    /* private _bottomSheetRef: MatBottomSheetRef<NewPatientComponent>, */
    private _snackBar: MatSnackBar,
    private _router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    /* this.datosPaciente = new Patient(0,'','','',0,'','','',0); */
    await this.getHI();
    console.log(this.hIData);
  }

  /* openLink(event:MouseEvent):void{
    this._bottomSheetRef.dismiss();
  } */

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  getHI():Promise<HealthInsurance>{
    return new Promise(resolve=>{
      this._hiService.getHealthInsurance().subscribe((hi:any)=>{
        resolve(this.hIData = hi['HealthInsurances']);
      });
    });
  }


  savePatient(){
    console.log(this.datosPaciente);
    this.datosPaciente.health_insurance = this.selectHI.id;
    this._patientService.newPatient(this.datosPaciente).subscribe((response:any)=>{
      console.log(response);
      const noti = this._snackBar.open('Paciente Creado Correctamente','OK');
      noti.onAction().subscribe(()=>{
        this._router.navigateByUrl("/pacientes");
      })

    })
  }

}
