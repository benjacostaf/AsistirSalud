import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HealthInsurance } from 'src/app/models/healthInsurance';
import { HealthInsuranceService } from 'src/app/services/health-insurance.service';

@Component({
  selector: 'app-new-hi',
  templateUrl: './new-hi.component.html',
  styleUrls: ['./new-hi.component.scss']
})
export class NewHiComponent implements OnInit {
  public dataHi:HealthInsurance = { name : '',
                                    location: '',
                                    email: '',
                                    phone: 0,
                                    status: 1};
  constructor(
    private _hiService: HealthInsuranceService,
    private router: Router,
    private _location: Location,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  saveHI(){
    console.log(this.dataHi);
    this._hiService.newHealthInsurance(this.dataHi).subscribe((hi:any)=>{
      this._snackBar.open('Obra social creada correctamente', 'OK');
      this._snackBar._openedSnackBarRef.onAction().subscribe(()=>{
        /* this.router.navigate(['/tarifas/obras-sociales']); */
        this._location.back();
      })
    },
    (error)=>{
      this._snackBar.open('Error al crear obra social, intente nuevamente', 'OK', {duration: 2000});
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
