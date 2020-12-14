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
  public myControl = new FormControl();
  public options: string[] = ['One', 'Two', 'Three'];
  public filteredOptions: Observable<string[]>;
  public filterSelect = 1;
  public optionsFilters = [
    {value: 1, display: 'Activos'},
    {value: 2, display: 'Eliminados'},
    {value: 3, display: 'Todos'}
    /* {value: 2, display: 'Inactivo'},
    {value: 3, display: 'Difunto'},
    {value: 4, display: 'Completado'},
    {value: 5, display: 'Cobrado'},
    {value: 6, display: 'Cobro pendiente'} */
  ];
  idPatientElimante: any;

  constructor(
    private _patientService: PatientService,
    private _hiService: HealthInsuranceService,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    await this.getData();
    await this.getHI();
    await this.replaceData();
    console.log(this.dataSource);
  }

  async selectFilter(opt){
    this.filterSelect = opt;
    this.dataSource.data = [];
    this.patients_table = [];
    this.replaceData();
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
 /*      this.allPatients.forEach(element => {
        this.replaceData(element);
      });
      this.dataSource.data = this.patients_table; */
    });
  }

  displayedColumns: string[] = ['surname', 'name', 'health_insurance', 'number_health_insurance', 'location', 'status', 'actions'];

  openBottomSheet(): void {
    this._bottomSheet.open(NewPatientComponent)
      .afterDismissed();
  }

  /* async replaceData() {
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
  } */

  getHIName(id_hi){
    return new Promise(resolve=>{
      let HI = '';
      for(let i = 0; i<this.hIData.length;i++){
        if(id_hi == this.hIData[i].id){
          HI = this.hIData[i].name;
          i = this.hIData.length + 1;
        }
      }
      resolve(HI);
    });
  }


  replaceData(){
    return new Promise(resolve=>{
      console.log(this.allPatients);
      switch(this.filterSelect){
        case 1:
          resolve(this.allPatients.forEach(async element=>{
              console.log(element);
              if(element.status==1){
                let nameHI = await this.getHIName(element.health_insurance);
                const sp: PatientsTable = {
                  id: element.id,
                  surname: element.surname,
                  name: element.name,
                  dni: element.dni,
                  health_insurance: String(await this.getHIName(element.health_insurance)),
                  number_health_insurance: element.number_health_insurance,
                  location: element.location,
                  status: element.status
                }
                await this.pushData(sp);
              }
            this.dataSource.data = this.patients_table;
          }));
          break;
          case 2:
            resolve(this.allPatients.forEach(async element=>{
                console.log(element);
                if(element.status==0){
                  let nameHI = await this.getHIName(element.health_insurance);
                  const sp: PatientsTable = {
                    id: element.id,
                    surname: element.surname,
                    name: element.name,
                    dni: element.dni,
                    health_insurance: String(await this.getHIName(element.health_insurance)),
                    number_health_insurance: element.number_health_insurance,
                    location: element.location,
                    status: element.status
                  }
                  await this.pushData(sp);
                }
              this.dataSource.data = this.patients_table;
            }));
            break;
            case 3:
              resolve(this.allPatients.forEach(async element=>{
                  console.log(element);
                    let nameHI = await this.getHIName(element.health_insurance);
                    const sp: PatientsTable = {
                      id: element.id,
                      surname: element.surname,
                      name: element.name,
                      dni: element.dni,
                      health_insurance: String(await this.getHIName(element.health_insurance)),
                      number_health_insurance: element.number_health_insurance,
                      location: element.location,
                      status: element.status
                    }
                    await this.pushData(sp);
                this.dataSource.data = this.patients_table;
              }));
              break;
              default:
                break;
      }
    });
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
    this._patientService.hasBenefit(patient.id).subscribe((r:any)=>{
      if(r){
        const noti = this.openDialogNotif(this.dialogApiError1451);
        this.idPatientElimante = patient.id;
      }else{
        this._patientService.deletePatient(patient.id).subscribe(()=>{
          this.notifPatientDeleteOK();
        });
      }
    }),
    (error)=>{
      const notiError = this._snackBar.open('Error de servidor, no se pudo determinar si el paciente contiene relaciones','OK', {duration: 2000});
    }
  }

  deletePatientData(){
    this._patientService.deletePatient(this.idPatientElimante).subscribe(()=>{
      this.notifPatientDeleteOK();
    })
  }

  notifPatientDeleteOK(){
    this._dialog.closeAll();
    const notif = this._snackBar.open('El paciente fuen eliminado correctamente','OK');
          notif.onAction().subscribe(()=>{
            this.getData();
            this.refreshTable();
          });
  }

  refreshTable(){
    this.patients_table = [];
    this.dataSource.data = [];
    this.tablePatient.renderRows();
  }

  openDialogNotif(templateRef) {
    this._dialog.open(templateRef);
  }

  dismissDialog(){
    this._dialog.closeAll();
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
