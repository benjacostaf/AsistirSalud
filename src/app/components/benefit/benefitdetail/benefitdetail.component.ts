import { AfterViewInit, Input, Output, TemplateRef } from '@angular/core';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BenefitService } from 'src/app/services/benefit.service';
import { BenefitDetailPdfService } from 'src/app/services/pdf/benefit-detail-pdf.service';
import { UserService } from 'src/app/services/user.service';
import { CheckupdetailComponent } from '../checkupdetail/checkupdetail.component';

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
  updatedTime: string;
}

export interface tableItems{
  id_b: number;
  id_lender: number;
  id_item: number;
  name: string;
  req: string;
  ind: string;
  hs: number;
}


@Component({
  selector: 'app-benefitdetail',
  templateUrl: './benefitdetail.component.html',
  styleUrls: ['./benefitdetail.component.scss']
})
export class BenefitdetailComponent implements OnInit, AfterViewInit{
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('dialog1451') private dialogApiError1451: TemplateRef<any>;
  @Input('benefitsTable') private tableB:MatTable<any>;
  benefitdetail:tableBenefit;
  public items;
  public dataItems:tableItems[] = [];
  /* public dataSource:MatTableDataSource<any>; */
  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  public dataEmpty=false;
  public updatedTime:Date;
  public dataLoaded = false;
  /* public dataSource; */
    constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)public benefit:any,
    private _benefitService: BenefitService,
    private _userService: UserService,
    private _pdfService: BenefitDetailPdfService,
    private _bottomSheet: MatBottomSheet,
    private _snackBar: MatSnackBar,
    private _dialog:MatDialog,
    private router:Router
    ) { }
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

    async ngOnInit(): Promise<void> {
      this.benefitdetail = this.benefit['bnf'];
      this.updatedTime = new Date(this.benefitdetail.updatedTime);
      console.log(this.benefitdetail);
      await this.getData();
      await this.setDataItems();
      /* this.refresh(); */
      /* await this.assignmentData(); */


    }

    isDataEmpty(){
      return new Promise(async resolve=>{
        console.log(this.dataSource.data.length);
        if(this.items.length==0){
          await this.finishLoadItems();
          resolve(this.dataEmpty = true);
        }else{
          await this.finishLoadItems();
          resolve(this.dataEmpty = false);
        }
      })
    }

  assignData(itemsData){
    return new Promise(async resolve=>{
      console.log(itemsData);
      resolve(this.dataSource = itemsData);
      console.log(this.dataSource);
    })
  }

  async refresh(){
    this.dataSource.data = this.dataItems;
    this.table.renderRows();
  }

  async editBenefit(id_benefit:number){
    console.log(id_benefit);
    console.log(this.benefitdetail);
    console.log(this.dataSource.data);
    await this.dismissBottomSheet().finally(async ()=>{
      const data = {
        benefit: this.benefitdetail,
        items: this.dataSource.data
      }
      /* await this.goto('/editar-prestacion',data); */
      this.router.navigate(['/editar-prestacion'], {state: {data:data}});
    });
  }

  goto(ruta:string,data:any){
    return new Promise(resolve=>{
      this.router.navigate(['`${{ruta}}`'], {state: {data:data}});
    })
  }

  async deleteBenefit(id_b:number){
    if(await(this.isBenefitEmpty(id_b))){
      this._benefitService.deleteBenefitData(id_b).subscribe((p:any)=>{
        console.log(p);
        const noti = this._snackBar.open('Prestacion eliminada correctamente','ok');
        noti.onAction().subscribe(async()=>{
          this._bottomSheet.dismiss();
        });
      })
    }else{
      const noti = this.openDialogNotif(this.dialogApiError1451);
    }
  }

  openDialogNotif(templateRef){
    this._dialog.open(templateRef);
  }

  deleteAll(id_b:number){
    this._benefitService.deleteBenefitData(id_b).subscribe((r:any)=>{
      console.log(r);
      this.dismissDialog();
      this.dismissBottomSheet();
    },
    (error)=>{
      console.log('error');
    });
  }

  dismissDialog(){
    this._dialog.closeAll();
  }

  dismissBottomSheet(){
    return new Promise(resolve=>{
      resolve(this._bottomSheet.dismiss());
    });
  }

  isBenefitEmpty(id_b:number){
    return new Promise(resolve=>{
      if(this.dataSource.data.length>0){
        resolve(false);
      }else{
        resolve(true);
      }

    })

  }

    /* refresh(){
      return new Promise(resolve=>{
        setTimeout(() => {
          resolve(this.dataSource.data = [...this.dataItems]);
          console.log(this.dataSource);
          this.dataSource.data = [...this.dataItems];
          console.log('time!');
        },1000)

      })
    } */
    getData(){
      return new Promise(resolve=>{
        this._benefitService.getItemsBenefit(this.benefitdetail.id_benefit).subscribe(async (b:any)=>{
          resolve(this.items = b['BenefitItems']);
          /* await this.isDataEmpty(); */
        });
      });
    }

  /* setDataItems() {
    return new Promise(async resolve => {
      resolve(for (let index = 0; index < this.items.length; index++) {
        let lender = {
          id_b: this.items[index].id_benefit,
          id_l: this.items[index].id_lender,
          name: await this.getLenderName(this.items[index].id_lender),
          req: this.items[index].requirements,
          ind: this.items[index].indications,
        }
        await this.pushDataItems(lender);
    }})
  } */

  setDataItems(){
    return new Promise(async resolve=>{
      resolve(this.items.forEach(async element=>{
        console.log(element);
        const lender = {
          id_item : element.id,
          id_b : element.id_benefit,
          id_lender : element.id_lender,
          name : await this.getLenderName(element.id_lender),
          req : element.requirements,
          ind : element.indications,
          hs: element.hours
        }
        await this.pushDataItems(lender);
        await(this.refresh());
        await this.finishLoadItems();
      }));
    })
  }

  finishLoadItems(){
    return new Promise(resolve=>{
      resolve(this.dataLoaded = true);
    });
  }

  logAsync(data){
    return new Promise(resolve=>{
      resolve(console.log(data));
    })
  }

      /* return new Promise(async resolve=>{
                await (this.items.forEach(async element=>{
          const lender = {
            id_b : element.id_benefit,
            id_l : element.id_lender,
            name : await this.getLenderName(element.id_lender),
            req : element.requirements,
            ind : element.indications,
          }
          console.log(lender);
          resolve(await this.pushDataItems(lender));
        }));
      }); */


    getLenderName(id_lender){
      return new Promise(resolve=>{
        this._userService.getUserLender(id_lender).subscribe((u:any)=>{
          resolve(`${u.user.surname}, ${u.user.name}`);
        });
      });
    }

    pushDataItems(lender){
      return new Promise(resolve=>{
        resolve(this.dataItems.push(lender));
        console.log(this.dataItems);
      })
    }

  /* async ngOnInit(): Promise<void> {
    await (this.benefitdetail = this.benefit['bnf']);
    await this.getItems(this.benefitdetail.id_benefit);
    await this.getData();
  }

  async getData(){
    return new Promise(async resolve=>{
      await this.addDataSource();
      resolve(await this.replaceDataSource());
      await (console.log(this.dataSource));
    })
  }

  replaceDataSource(){
    console.log(this.dataItems);
    return new Promise(resolve=>{
      resolve(this.dataSource = this.dataItems);
      console.log(this.dataSource);
    });
  }

  getItems(id_benefit){
    return new Promise(resolve=>{
      console.log(id_benefit);
      this._benefitService.getItemsBenefit(id_benefit).subscribe((p:any)=>{
        console.log(p);
        resolve(this.items = p['BenefitItems']);
        console.log(this.items);
      })
    })
  }

  addDataSource(){
    return new Promise(resolve=>{
      resolve(this.items.forEach(async element=>{
        let lender = {
          id_b: element.id_benefit,
          id_l: element.id_lender,
          name : await this.getLenderName(element.id_lender),
          req: element.requirements,
          ind: element.indications
        }
        console.log(lender);
        await this.pushDataSource(lender);
      }))
    })
  }

  getLenderName(id_l){
    return new Promise(resolve=>{
      this._userService.getUserLender(id_l).subscribe((u:any)=>{
        resolve(`${u.user.surname}, ${u.user.name}`);
      })
    })
  }

  pushDataSource(item){
    return new Promise(resolve=>{
      resolve(this.dataItems.push(item));
      console.log(this.dataItems);
      this.dataSource.data = this.dataItems;
    })
  } */

  displayedColumns: string[] = ['lender', 'requirements', 'indications', 'hs'];

  openCheckupDetail(itemBenefit){
    const window = this._bottomSheet.open(CheckupdetailComponent,{
      panelClass : 'mat-bottom-sheet-custom',
      data: {item: itemBenefit}
    });
  }

  print(){
    this._pdfService.pdfExample(this.benefitdetail,this.dataItems);
  }


}
