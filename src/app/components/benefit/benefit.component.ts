import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Benefit } from 'src/app/models/benefit';
import { HealthInsurance } from 'src/app/models/healthInsurance';
import { Patient } from 'src/app/models/patient';
import { BenefitService } from 'src/app/services/benefit.service';
import { ExportService } from 'src/app/services/export.service';
import { HealthInsuranceService } from 'src/app/services/health-insurance.service';
import { PatientService } from 'src/app/services/patient.service';
import { NewBenefitComponent } from '../new-benefit/new-benefit.component';
import { BenefitdetailComponent } from './benefitdetail/benefitdetail.component';

export interface tableBenefit{
  id_benefit:number;
  id_patient:number;
  name: string;
  dni: number;
  health_insurance: number;
  name_health_insurance: string;
  number_health_insurance: number;
  diagnosis: string;
  start_at: string;
  finish_at: string;
  status: number;
  /* updatedTime: string;
  createdTime: string; */
}


@Component({
  selector: 'app-benefit',
  templateUrl: './benefit.component.html',
  styleUrls: ['./benefit.component.scss']
})
export class BenefitComponent implements OnInit, AfterViewInit{
  @ViewChild('benefitsTable') public tableB:MatTable<any>
  @ViewChild('Table') public tableExport: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  public allBenefits:Benefit[] = [];
  public allHI:HealthInsurance[] = [];
  public allPatients:Patient[] = [];
  public dataTable:tableBenefit[] = [];
  public dataSource = new MatTableDataSource;
  public filterSelect = 1;
  optionsFilters = [
    {value: 1, display: 'Activos'},
    {value: 2, display: 'Eliminados'},
    {value: 3, display: 'Todos'}
    /* {value: 2, display: 'Inactivo'},
    {value: 3, display: 'Difunto'},
    {value: 4, display: 'Completado'},
    {value: 5, display: 'Cobrado'},
    {value: 6, display: 'Cobro pendiente'} */
  ];
  value = '';
  constructor(
    private _bottomSheet: MatBottomSheet,
    private _benefitService:BenefitService,
    private _patientService: PatientService,
    private _hiService: HealthInsuranceService,
    private _exportService: ExportService
  ) { }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  async selectFilter(opt){
    this.filterSelect = opt;
    this.dataSource.data = [];
    this.dataTable = [];
    await this.replaceData();
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  async ngOnInit(): Promise<void> {
    await this.getHI();
    await this.getData();
    await this.getPatients();
    await this.replaceData();
    console.log(this.dataTable);
    console.log(this.dataSource.data);
  }

  getHI():Promise<HealthInsurance>{
    return new Promise(resolve=>{
      this._hiService.getHealthInsurance().subscribe((hi:any)=>{
        resolve(this.allHI = hi['HealthInsurances']);
      })
    })
  }

  getIndexHI(id_hi:number):Promise<number>{
    return new Promise(resolve=>{
      for (let index = 0; index < this.allHI.length; index++) {
        console.log(this.allHI[index]);
        console.log(id_hi);
        if(this.allHI[index].id==id_hi){
          resolve(index);
          index = this.allHI.length;
        }
      }
    })
  }

  /**Get benefits active */
  getData(){
    return new Promise(resolve=>{
      this._benefitService.getBenefits().subscribe(async (p:any)=>{
        resolve(this.allBenefits = p['Benefits']);
        console.log(this.allBenefits);
      });
    })
  }



  getPatients(){
    return new Promise(resolve=>{
      this._patientService.getPatients().subscribe(async (p:any)=>{
        resolve(this.allPatients = p['Patients']);
        console.log(this.allPatients);
      })
    })
  }

  replaceData(){
    return new Promise(resolve=>{
    console.log(this.allBenefits);
      switch (this.filterSelect) {
        case 1:
          resolve(this.allBenefits.forEach(async element=>{
          for (let index = 0; index < this.allPatients.length; index++){
            console.log(element);
            if(element.status!=0){
              console.log(element);
              console.log(this.allPatients);
              console.log(this.allPatients[index]);
              if(this.allPatients[index].id == element.id_patient){
                this.addBenefitPatient(await this.setBenefitPatient(element, this.allPatients[index]));
                index = this.allPatients.length;
                console.log(this.dataTable);
                this.dataSource.data = this.dataTable;
              }
              console.log(this.dataSource.data);
            }
          }
        }))
          break;
        case 2:
          resolve(this.allBenefits.forEach(async element=>{
            console.log(element);
          for (let index = 0; index <= this.allPatients.length; index++){
            if(element.status==0){
              console.log(element);
              console.log(this.allPatients);
              console.log(this.allPatients[index]);
              if(this.allPatients[index].id == element.id_patient){
                this.addBenefitPatient(await this.setBenefitPatient(element, this.allPatients[index]));
                index = this.allPatients.length;
                console.log(this.dataTable);
                this.dataSource.data = this.dataTable;
              }
              console.log(this.dataSource.data);
            }
          }
        }))

          break;
          case 3:
            resolve(this.allBenefits.forEach(async element=>{
            for (let index = 0; index < this.allPatients.length; index++){
              console.log(element);
              console.log(this.allPatients);
              console.log(this.allPatients[index]);
              if(this.allPatients[index].id == element.id_patient){
                this.addBenefitPatient(await this.setBenefitPatient(element, this.allPatients[index]));
                index = this.allPatients.length;
                console.log(this.dataTable);
                this.dataSource.data = this.dataTable;
              }
              console.log(this.dataSource.data);
            }
          }))
        default:
          break;
      }
  })
  }

  setBenefitPatient(benefit:Benefit, patient:Patient):Promise<tableBenefit>{
    return new Promise(async resolve=>{
    console.log(benefit,patient);
    let index = await this.getIndexHI(patient.health_insurance);
    console.log(index);
    console.log(this.allHI);
    const hiname = this.allHI[index].name;
    let bp:tableBenefit = {
      id_benefit : benefit.id,
      id_patient : benefit.id_patient,
      name : `${patient.surname}, ${patient.name}`,
      diagnosis : benefit.diagnosis,
      dni : patient.dni,
      health_insurance: patient.health_insurance,
      name_health_insurance: hiname,
      number_health_insurance : patient.number_health_insurance,
      start_at : benefit.start_at,
      finish_at : benefit.finish_at,
      status : benefit.status
    };
    console.log(bp);
    resolve(bp);
    })
  }

  addBenefitPatient(item:tableBenefit){
    return new Promise(resolve=>{
      console.log(item);
      resolve(this.dataTable.push(item));
      console.log(this.dataTable);
    })
  }

  selectionRow = new SelectionModel<tableBenefit>(false,[]);

  displayedColumns: string[] = ['name', 'diagnosis', 'health_insurance', 'start_at', 'finish_at', 'status'];


  openBenefitDetail(benefit){
    const window = this._bottomSheet.open(BenefitdetailComponent, {
      data: {bnf: benefit}
    }).afterDismissed().subscribe(async()=>{
      this.tableB.renderRows();
    });
  }



  openNewBenefit(){
    const win = this._bottomSheet.open(NewBenefitComponent,{
      panelClass : ['container-custom']
    });
    win.afterDismissed().subscribe(()=>{
      this.tableB.renderRows();
    })

  }


  /**
   * Function prepares data to pass to export service to create excel from Table DOM reference
   *
   */
  exportElmToExcel(): void {
    console.log(this.tableExport);
    this._exportService.exportTableElmToExcel(this.tableExport, 'Prestaciones');
  }

}

