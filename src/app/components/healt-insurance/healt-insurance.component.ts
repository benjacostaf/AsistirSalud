import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { HealthInsurance } from 'src/app/models/healthInsurance';
import { HealthInsuranceService } from 'src/app/services/health-insurance.service';

@Component({
  selector: 'app-healt-insurance',
  templateUrl: './healt-insurance.component.html',
  styleUrls: ['./healt-insurance.component.scss']
})
export class HealtInsuranceComponent implements OnInit, AfterViewInit {
  @ViewChild('benefitsTable') public tableB:MatTable<any>
  @ViewChild('Table') public tableExport: ElementRef;
  @ViewChild(MatSort) sort: MatSort;
  public allHI:HealthInsurance[] = [];
  public dataTable:HealthInsurance[] = [];
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

  displayedColumns: string[] = ['name', 'location', 'email', 'phone', 'status', 'actions'];

  constructor(
    private _hiService: HealthInsuranceService,
  ) { }

  async ngOnInit():Promise<void> {
    await this.getHI();
    await this.replaceData();
  }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  getHI():Promise<HealthInsurance>{
    return new Promise(resolve=>{
      this._hiService.getHealthInsurance().subscribe((hi:any)=>{
        console.log(hi);
        resolve(this.allHI = hi['HealthInsurances']);
      })
    })
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

  replaceData(){
    return new Promise(resolve=>{
    console.log(this.allHI);
      switch (this.filterSelect) {
        case 1:
          resolve(this.allHI.forEach(async element=>{
            console.log(element);
            if(element.status!=0){
                this.addBenefitPatient(element);
                console.log(this.dataTable);
                this.dataSource.data = this.dataTable;
              }
              console.log(this.dataSource.data);
        }))
          break;
        case 2:
          resolve(this.allHI.forEach(async element=>{
            if(element.status==0){
                this.addBenefitPatient(element);
                console.log(this.dataTable);
                this.dataSource.data = this.dataTable;
              }
              console.log(this.dataSource.data);
        }))
          break;
          case 3:
            resolve(this.allHI.forEach(async element=>{
                  this.addBenefitPatient(element);
                  console.log(this.dataTable);
                  this.dataSource.data = this.dataTable;
                console.log(this.dataSource.data);
          }))
          break;
        default:
          break;
      }
  })
  }

  addBenefitPatient(item:HealthInsurance){
    return new Promise(resolve=>{
      console.log(item);
      resolve(this.dataTable.push(item));
      console.log(this.dataTable);
    })
  }


}
