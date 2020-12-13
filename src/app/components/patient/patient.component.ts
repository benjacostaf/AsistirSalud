import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Patient } from '../../models/patient';
import { PatientService } from 'src/app/services/patient.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NewPatientComponent } from '../new-patient/new-patient.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { HealthInsurance } from 'src/app/models/healthInsurance';
import { HealthInsuranceService } from 'src/app/services/health-insurance.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatSort } from '@angular/material/sort';

export interface PatientsTable {
  id: number;
  surname: string;
  name: string;
  dni: number;
  health_insurance: string;
  number_health_insurance: number;
  location: string;
  status: number;
}

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit, AfterViewInit {
  @ViewChild('patientTable') tablePatient: MatTable<any>;
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild('dialog1451') private dialogApiError1451: TemplateRef<any>;
  public allPatients: Patient[] = [];
  public patients_table: PatientsTable[] = [];
  public dataSource = new MatTableDataSource();
  public hIData: HealthInsurance[] = [];
  public dataFiltered = new MatTableDataSource();
  public selected = 2;
  myControl = new FormControl();
  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;
  
  constructor(
    private _patientService: PatientService,
    private _hiService: HealthInsuranceService,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getHI();
    this.getData();
    console.log(this.dataSource);
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  filterData(){
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter(value))
    );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }




  getData() {
    this._patientService.getPatients().subscribe(async (p: any) => {
      this.allPatients = p['Patients'];
      this.allPatients.forEach(element => {
        this.replaceData(element);
      });
      this.dataSource.data = this.patients_table;
    });
  }

  displayedColumns: string[] = ['surname', 'name', 'health_insurance', 'number_health_insurance', 'location', 'status', 'actions'];

  openBottomSheet(): void {
    this._bottomSheet.open(NewPatientComponent)
      .afterDismissed();
  }

  async replaceData(patient: Patient) {
    const hi = patient.health_insurance;
    let name_hi: string;
    for (let index = 0; index < this.hIData.length; index++) {
      if (hi == this.hIData[index].id) {
        name_hi = this.hIData[index].name;
        index = this.hIData.length + 1;
      }
    }
    const sP: PatientsTable = {
      id: patient.id,
      surname: patient.surname,
      name: patient.name,
      dni: patient.dni,
      health_insurance: name_hi,
      number_health_insurance: patient.number_health_insurance,
      location: patient.location,
      status: patient.status
    }
    await this.pushData(sP);
  }

  pushData(item) {
    return new Promise(resolve => {
      resolve(this.patients_table.push(item));
    });
  }

  refreshData() {
  }

  getHI(): Promise<HealthInsurance> {
    return new Promise(resolve => {
      this._hiService.getHealthInsurance().subscribe((hi: any) => {
        resolve(this.hIData = hi['HealthInsurances']);
      });
    });
  }

  editPatient(patient: any) {
    console.log(patient);
    this.router.navigate(['/editar-paciente'], { state: { data: patient } });
  }
  deletePatient(patient: any) {

    this._patientService.deletePatient(patient.id).subscribe(() => {
      const noti = this._snackBar.open('El paciente fue eliminado correctamente', 'OK', { duration: 2000 });
      noti.onAction().subscribe(()=>{
        this.getData();        
        this.refreshTable();
      })      
    },
      (error) => {
        const nroError = error.error.error.errorInfo[1];
        if (nroError == 1451) {
          const noti = this.openDialogNotif(this.dialogApiError1451);
        }
      })
  }

  refreshTable(){
    this.patients_table = [];
    this.dataSource.data = [];
    this.tablePatient.renderRows();
  }

  openDialogNotif(templateRef) {
    this._dialog.open(templateRef);
  }

/**---------------- todo */
/*   filtrar(){
    console.log(this.selected);
    switch (this.selected) {
      case 1:
          this.dataSource.filterPredicate(this.displayedColumns[5],'1');
        break;
      case 2:
          this.dataSource.filterPredicate(this.displayedColumns[5],'0');
      default:
        this.dataSource.filter = '1'
        break;
    }
  } */
}
