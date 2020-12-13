import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';
import  autoTable from 'jspdf-autotable';


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

const doc = new jsPDF();

@Injectable({
  providedIn: 'root'
})
export class BenefitDetailPdfService {

  constructor() { }

  pdfExample(b:tableBenefit,bi:tableItems[]){
    console.log(b);
    console.log(bi);
    doc.addImage("../../../assets/asist-hor-der.png", "PNG", 10, 10, 95, 30);
    doc.setDrawColor(0);
    doc.setFillColor(43, 57, 144);
    doc.rect(10, 45, 190, 10, "F");
    doc.setTextColor(255,255,255);
    doc.text("PRESTACIÓN", 105, 50, {align:'center', baseline:'middle'});
    doc.setDrawColor(43, 57, 144); // draw red lines
    doc.setLineWidth(0.1);
    doc.line(10, 45, 10, 75); // vertical line
    doc.line(200, 45, 200, 75); // vertical line

    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("N°:000-0"+b.id_benefit, 15, 60, {align:'left', baseline:'middle'});
    doc.text("INICIO: "+b.start_at, 15, 70,{align:'left', baseline:'middle'});
    doc.text("FIN: "+b.finish_at, 70, 70,{align:'left', baseline:'middle'});
    let status;
    switch (b.status) {
      case 1:
        status = 'Activo';
        break;
      case 2:
        status = 'Terminado';
        break;
      case 3:
        status = 'Fallecido';
        break;
      default:
        break;
    }
    doc.text("ESTADO: "+status, 190,70, {align:'right', baseline:'middle'});

    doc.setDrawColor(0);
    doc.setFillColor(43, 57, 144);
    doc.rect(10, 75, 190, 10, "F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(16);
    doc.text("PACIENTE", 105, 80, {align:'center', baseline:'middle'});
    doc.setDrawColor(43, 57, 144); // draw red lines
    doc.setLineWidth(0.1);
    doc.line(10, 75, 10, 120); // vertical line
    doc.line(200, 75, 200, 120); // vertical line

    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("APELLIDO Y NOMBRE: "+b.name, 15, 90, {align:'left', baseline:'middle'});
    doc.text("DNI: "+b.dni, 15, 100);
    doc.text("OBRA SOCIAL: "+b.name_health_insurance, 15, 110,{baseline:'middle'});
    doc.text("N° OS: "+b.number_health_insurance, 190,110, {align:'right', baseline:'middle'});

    doc.setDrawColor(0);
    doc.setFillColor(43, 57, 144);
    doc.rect(10, 120, 190, 10, "F");
    doc.setTextColor(255,255,255);
    doc.setFontSize(16);
    doc.text("REQUERIMIENTOS", 105, 125, {align:'center', baseline:'middle'});
    doc.setDrawColor(43, 57, 144); // draw red lines
    doc.setLineWidth(0.1);
    doc.line(10, 120, 10, 175); // vertical line
    doc.line(200, 120, 200, 175); // vertical line
    doc.line(10,175,200,175);

    doc.setTextColor(0);
    doc.setFontSize(13);
    doc.text("DIAGNOSTICO: "+b.diagnosis, 15, 135, {align:'left', baseline:'middle'});

    var col = ['PRESTADOR','REQUERIMIENTO','INDICACIONES'];
    var data = [];
    bi.forEach(element => {
      var temp = [element.name,element.req,element.ind];
      data.push(temp);
    });

    autoTable(doc,{
      theme: 'plain',
      startY: 145,
      tableWidth: 185,
      margin: 20,
      head: [col],
      body: data,
      headStyles: {fontSize: 13, cellWidth: 'wrap'},
      bodyStyles: {fontSize: 12, cellWidth: 'auto'}
    })

    doc.output('dataurlnewwindow');
  }
}
