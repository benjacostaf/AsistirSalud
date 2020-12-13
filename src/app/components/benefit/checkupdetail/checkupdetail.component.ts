import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Checkup } from 'src/app/models/checkup';
import { CheckupService } from 'src/app/services/checkup.service';
import { MapDialogComponent } from '../map-dialog/map-dialog.component';

export interface tableCheckups{
  obs: string,
  date: string,
  geo_lat: string,
  geo_long: string
}

@Component({
  selector: 'app-checkupdetail',
  templateUrl: './checkupdetail.component.html',
  styleUrls: ['./checkupdetail.component.scss']
})
export class CheckupdetailComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  public dataCheckups:tableCheckups[] = [];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public lenderName:string;
  public dataEmpty:boolean = false;
  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)public item: any,
    private _dialog: MatDialog,
    private _checkupService:CheckupService
  ) { }

  displayedColumns: string[] = ['observations', 'date'];

  async ngOnInit(): Promise<void> {
    console.log(this.item);
    const itemBenefit = this.item['item'];
    this.lenderName = itemBenefit.name;
    console.log(itemBenefit);
    const checkupsData = await this.getAllCheckups(itemBenefit.id_b,itemBenefit.id_lender);
    console.log(checkupsData);
    if(checkupsData.length == 0){
      this.dataEmpty = true;
    }else{
      checkupsData.forEach(async element => {
        await this.addCheckups(element);
        await(this.refreshData());
      });
    }    
    /* this.dataSource = this.dataCheckups;
    console.log(this.dataSource); */
  }

  refreshData(){
    this.dataSource.data = this.dataCheckups;
    console.log(this.dataSource);
    this.table.renderRows();
  }

  getAllCheckups(id_b,id_l):Promise<any>{
    return new Promise(resolve=>{
      console.log(id_b,id_l);
      this._checkupService.getCheckupbyBnftLndr(id_b,id_l).subscribe((ch:any)=>{
        console.log(ch);
        resolve(ch['Checkups']);
      })
    })
  }

  addCheckups(checkup:Checkup){
    return new Promise(resolve=>{
      let ch: tableCheckups = {
        obs: checkup.description,
        date: checkup.time_at,
        geo_lat: checkup.geo_lat,
        geo_long: checkup.geo_long
      }
  
      resolve(this.dataCheckups.push(ch));
    })
  }

  openMapView(item){
    this._dialog.open(MapDialogComponent,{
      data: item
    })
  }

}
