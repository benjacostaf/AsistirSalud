import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { LenderService } from 'src/app/services/lender.service';

@Component({
  selector: 'app-edit-lender',
  templateUrl: './edit-lender.component.html',
  styleUrls: ['./edit-lender.component.scss']
})
export class EditLenderComponent implements OnInit {
  public dataLender = history.state.data;
  public updateTime:Date;
  constructor(
    private router:Router,
    private _snackBar: MatSnackBar,
    private _lenderService: LenderService,
  ) { }

  ngOnInit(): void {
    /* const lender = this.router.getCurrentNavigation().extras.state; */
    const lender = history.state.data;
    this.getUpdatedTime();
    console.log(lender);
    console.log(this.dataLender);
  }

getUpdatedTime(){
  this._lenderService.getLender(history.state.data.id_lender).subscribe(p=>{
    console.log(p);
    const date = p['Lender']['updated_at'];
    this.updateTime = new Date(date);
  })
}

  updateLender(){
    this._lenderService.updateLender(this.dataLender).subscribe(()=>{
      const notif = this._snackBar.open('Prestador actualizado correctamente', 'OK');
      notif.onAction().subscribe(()=>{
        this.router.navigate(['/prestadores']);
      });
    },
    (error)=>{
      const notif = this._snackBar.open('Error al actualizar prestador, intente nuevamente', '', {duration: 2000});
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
