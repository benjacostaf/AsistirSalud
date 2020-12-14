import { ElementRef, Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';


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
  /* createdTime: string; */
}

export interface tableExport{
  benefit: tableBenefit;
  items: tableItems[];
}

export interface tableItems{
  id_benefit:number;
  id_lender:number;
  name: string;
  req: string;
  ind: string;
  hs: number;
  status: number;
  updatedTime: string;
}

@Injectable({
  providedIn: 'root'
})


export class ExportService {
  constructor(

  ) { }


  /**
   * Creates excel from the table element reference.
   *
   * @param element DOM table element reference.
   * @param fileName filename to save as.
   */
  public exportTableElmToExcel(element: ElementRef, fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element.nativeElement);
    // generate workbook and add the worksheet
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const date = new Date();
    const name = fileName + `-${date.toLocaleDateString()}`;
    XLSX.utils.book_append_sheet(workbook, ws, 'Sheet1');
    // save to file
    XLSX.writeFile(workbook, `${name}${EXCEL_EXTENSION}`);
  }

  public exportDataBenefitToExcel(data:tableExport[]){
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    const columnsBenefit = [['Paciente'] , ['DNI'], ['Obra Social'], ['N° OS'], ['Diagnóstico'], ['Inicio'], ['Fin'], ['Estado']]; //Row for benefit
    const columns = [[ ],['Prestado'], ['Requerimineto'], ['Indicación'], ['Cant. HS'], ['Estado']]; //Row for benefitItem
    const date = new Date();
    const name = `Prestaciones - ${date.toLocaleDateString()}`;
    workbook.Props = {
      Title: name,
      Subject: "Test",
      Author: "Asistir Salud",
      CreatedDate: date
    };

    workbook.SheetNames.push("Prestaciones");

    console.log(data);

    let arrayData = [];
    let arrayItems = [];
    let arrayBenefit = [];
    let benefitItemData;
    let benefitData;
    arrayData.push(columnsBenefit);
    data.forEach(d=>{
      benefitItemData = [];
      benefitData = [];
      benefitData.push([`${d.benefit.name}`]);
      benefitData.push([`${d.benefit.dni}`]);
      benefitData.push([`${d.benefit.name_health_insurance}`]);
      benefitData.push([`${d.benefit.number_health_insurance}`]);
      benefitData.push([`${d.benefit.diagnosis}`]);
      benefitData.push([`${d.benefit.start_at}`]);
      benefitData.push([`${d.benefit.finish_at}`]);
      benefitData.push([`${d.benefit.status}`]);
      console.log(d);
      arrayData.push(benefitData);
      console.log(arrayBenefit);
      console.log(d.items[0][0]);
      let i = d.items[0][1];
      console.log(i);
      if(d.items[0]){
        arrayData.push(columns);
        console.log();
        for(let j=0;j<d.items.length;j++){
          console.log(d.items[0][j]);
          benefitItemData = [];
          if(d.items[0][j] === undefined){
            j == d.items.length +1;
          }else{
            benefitItemData.push([]);
            benefitItemData.push([`${d.items[0][j].id_lender}`]);
            benefitItemData.push([`${d.items[0][j].requirements}`]);
            benefitItemData.push([`${d.items[0][j].indications}`]);
            benefitItemData.push([`${d.items[0][j].hours}`]);
            benefitItemData.push([`${d.items[0][j].status}`]);
            arrayData.push(benefitItemData);
          }
        }
      }
      /* arrayItems.push(dataRowBenefit);
      arrayData.push(arrayItems); */
    });
    /* arrayData.push(arrayBenefit); */
    console.log(arrayData);
    var ws = XLSX.utils.aoa_to_sheet(arrayData);

      workbook.Sheets["Prestaciones"] = ws;

    XLSX.writeFile(workbook, `${name}${EXCEL_EXTENSION}`);
  }

}
