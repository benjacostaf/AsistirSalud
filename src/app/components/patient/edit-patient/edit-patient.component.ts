import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HealthInsurance } from 'src/app/models/healthInsurance';
import { Patient } from 'src/app/models/patient';
import { HealthInsuranceService } from 'src/app/services/health-insurance.service';
import { PatientService } from 'src/app/services/patient.service';

interface selectOption {
  value: number;
  display: string;
}

@Component({
  selector: 'app-edit-patient',
  templateUrl: './edit-patient.component.html',
  styleUrls: ['./edit-patient.component.scss']
})
export class EditPatientComponent implements OnInit {
  public idPatient = history.state.data.id;
  public dataPatient:Patient = new Patient(0,'','',0,0,0,'','',0,'',0,1);
  public hIData:HealthInsurance[] = [];
  public selectHI:HealthInsurance =  new HealthInsurance('','','',0,0);
  public status = 1;
  public updateTime:Date;
  statusPatient: selectOption[] = [
    {value: 0, display: 'Eliminado'},
    {value: 1, display: 'Activo'},
    {value: 2, display: 'Inactivo'},
    {value: 3, display: 'Difunto'},
    {value: 6, display: 'Cobro pendiente'}
  ];
  constructor(
    private _patientService: PatientService,
    private _hiService: HealthInsuranceService,
    private _snackBar: MatSnackBar,
    private router: Router
  ) { }

  async ngOnInit():Promise<void> {
    await this.getPatient(this.idPatient);
    console.log(this.dataPatient);
    await this.getHI();
    console.log(this.dataPatient);
  }

  updatePatient(){
    console.log(this.selectHI);
    this.dataPatient.health_insurance = this.selectHI.id;
    console.log(this.status);
    this.dataPatient.status = this.status;
    this._patientService.updatePatient(this.dataPatient).subscribe(()=>{
      const notif = this._snackBar.open('Paciente actualizado correctamente', 'OK');
      notif.onAction().subscribe(()=>{
        this.router.navigate(['/pacientes']);
      });
    },
    (error)=>{
      const noti = this._snackBar.open('Error al actualizar paciente, intente nuevamente', '', {duration: 2000});
    });
  }

  getPatient(id){
    return new Promise(resolve=>{
      this._patientService.getPatient(this.idPatient).subscribe(async (p:any)=>{
        resolve(await this.setPatient(p['Patient']));
      })
    })
  }

  setPatient(dataP){
    this.dataPatient = dataP;
    this.selectHI.id = this.dataPatient.health_insurance;
    this.status = this.dataPatient.status;
    console.log(dataP.updated_at);
    this.updateTime = new Date(dataP.updated_at);
  }

  getHI():Promise<HealthInsurance>{
    return new Promise(resolve=>{
      this._hiService.getHealthInsurance().subscribe((hi:any)=>{
        resolve(this.hIData = hi['HealthInsurances']);
      });
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
