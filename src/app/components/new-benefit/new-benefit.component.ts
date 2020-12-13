import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { NewPatientComponent } from '../new-patient/new-patient.component';
import { WppService } from 'src/app/services/wpp.service';
import { PatientService } from '../../services/patient.service';
import { LenderService } from '../../services/lender.service';
import { UserService } from '../../services/user.service';
import { BenefitService } from '../../services/benefit.service';
import { Patient } from '../../models/patient';
import { Lender } from '../../models/lender';
import { Benefit } from '../../models/benefit';
import { User } from 'src/app/models/user';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { NewRequirementComponent } from './new-requirement/new-requirement.component';
import { BenefitItem } from 'src/app/models/benefitItem';
import { ItemRequirementService } from 'src/app/services/item-requirement.service';
import { MatTable } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

const moment = _rollupMoment || _moment;

export interface tableReq {
  id_lender: number;
  lender: string;
  req: string;
  ind: string;
  hs: number;
}

export interface sPatient {
  id: number;
  display: string;
}

export interface sLender {
  id: number;
  display
}


@Component({
  selector: 'app-new-benefit',
  templateUrl: './new-benefit.component.html',
  styleUrls: ['./new-benefit.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})

export class NewBenefitComponent implements OnInit {
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild('dialogOk') private d_benefitOk: TemplateRef<any>;
  public selectPatient: Patient;
  public dataNewBenefit: Benefit;
  public selectPatientId: number = 0;
  public selectDiagnosis: string = '';
  public selectSRequeriments: number = 0;
  public selectRequeriments: string = '';
  public selectHoursPDay: number = 0;
  public selectStart: string = '';
  public selectDateStart: Date;
  public selectFinish: string = '';
  public selectDateFinish: Date;
  public selectLender: Lender;
  public selectLenderId: number = 0;
  public selectLenderPhone: number = 0;
  public dataSource: tableReq[] = [];
  public lastBenefitId = 0;
  public loadNumbers = false;

  displayedColumns: string[] = ['Lender', 'Requirement', 'Indication', 'Hours', 'Options'];

  dateStart = new FormControl(moment([2018, 0, 1]));
  myControl = new FormControl();
  lenderControl = new FormControl();
  options: sPatient[] = [];

  optionsLenders: sPatient[] = [];
  filteredOptions: Observable<string[]>;
  filteredOptionsLender: Observable<string[]>;

  resultLenders: Lender[] = [];
  resultUsers: User[] = [];
  resultPatients: Patient[] = [];
  auxResultPatients: sPatient[] = [];
  selectLenderName: string;
  selectPatientName: string;
  auxDataItemReq: tableReq;

  @Output() itemReq: EventEmitter<tableReq> = new EventEmitter();

  constructor(
    private _bottomSheet: MatBottomSheet,
    private _wppService: WppService,
    private _patientService: PatientService,
    private _lenderService: LenderService,
    private _userService: UserService,
    private _benefitService: BenefitService,
    private _itemRequerimentService: ItemRequirementService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog
  ) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action), {
      duration: 20000,
    }
  }

  async ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterPatients(value))
      );
    this.filteredOptionsLender = this.lenderControl.valueChanges
      .pipe(
        startWith(''),
        map(lndr => this._filterLenders(lndr))
      );

    this.getPatients();
    this.getDataLenders();

    this.getPatientSelected();
  }

  /* getDataSource(){
    console.log(this.itemReq.emit());
  } */

  openBottomSheet() {
    const newReq = this._bottomSheet.open(NewRequirementComponent);
    newReq.afterDismissed().subscribe(async Req => {
      await this.getDataSource();
      console.log(this.dataSource);
      this.table.renderRows();
    });
  }

  getDataSource() {
    return new Promise(async resolve => {
      const aux = this.getItemReq();
      resolve(this.dataSource.push(aux));
    })
  }

  getItemReq() {
    return this._itemRequerimentService.getItemTable();
  }

  getPatientSelected() {
    this.myControl.valueChanges.subscribe(value => {
      console.log(value);
    });
  }

  getLenderSelected() {
    this.lenderControl.valueChanges.subscribe(valuel => {
      console.log(valuel);
    });
  }

  getLendersPhone() {

  }

  async getPatients() {
    let auxResult: sPatient[] = [];
    let auxPatient: sPatient = { id: 0, display: '' };
    await this._patientService.getPatients().subscribe(async (p: any) => {
      this.resultPatients = p['Patients'];
      await this.getPatientsDisplay(this.resultPatients);
      console.log(this.options);
    })
  }


  getPatientsDisplay(array: Patient[]) {
    let auxPatient: sPatient = { id: 0, display: '' };
    array.forEach(element => {
      return new Promise(async resolve => {
        console.log(element);
        await resolve(this.auxResultPatients.push(this.assignmentDataPatien(element)));
      })
    });

    this.options = this.auxResultPatients;
  }

  assignmentDataPatien(element: Patient): any {
    let patient: sPatient = { id: 0, display: '' };
    patient.display = `${element['surname']}, ${element['name']} - ${element['location']} - ${element['healt_insurance']}`;
    patient.id = element.id;
    return patient;
  }

  replaceData() {

  }

  comprobarDatos() {


    console.log(this.selectPatientId);
    console.log(this.selectDiagnosis);
    console.log(this.selectSRequeriments);
    console.log(this.selectRequeriments);

    console.log(this.selectStart['_i']);
    this.selectDateStart = new Date();
    this.selectDateStart.setFullYear(this.selectStart['_i']['year'], this.selectStart['_i']['month'], this.selectStart['_i']['date']);
    console.log(this.selectDateStart);
    /* console.log(start); */
    this.selectDateFinish.setFullYear(this.selectFinish['_i']['year'], this.selectFinish['_i']['month'], this.selectFinish['_i']['date']);
    console.log(this.selectFinish);
    console.log(this.selectLenderId);
    console.log(this.selectLenderPhone);
  }

  getFecha(date: string) { }

  getDataLenders() {
    return new Promise(async resolve => {
      await this.getLenders();
      await this.getUserLenders();
      resolve(this.replaceData());
    })
  }


  getLenders() {
    this._lenderService.getLenders().subscribe((l: any) => {
      this.resultLenders = l['Lenders'];
    });
  }

  getUserLenders() {
    this._userService.getUsers().subscribe((u: any) => {
      this.resultUsers = u['users'];
      let resultAuxLender: Lender[] = [];
      let auxLender: sPatient = { id: 0, display: '' };
      this.resultLenders.forEach(element => {
        auxLender.id = element.id;
        let luid = element.id_user;
        let specialism = element.specialism;
        auxLender.display = `${this.resultUsers[luid].surname}, ${this.resultUsers[luid].name} - ${this.resultUsers[luid].location} - ${specialism}`;
        this.optionsLenders.push(auxLender);
      });
    });
  }



  _filterPatients(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options['display'].filter(option => option.toLowerCase().includes(filterValue));
  }

  setPatientSelect(id_patient_select: number) {
    this.selectPatientId = id_patient_select;
  }

  setLenderSelect(indexLender: number) {
    this.selectLenderId = this.resultLenders[indexLender].id;
  }

  _filterLenders(value: string): string[] {
    const filterValueL = value.toLowerCase();
    return this.optionsLenders['display'].filter(option => option.toLowerCase().includes(filterValueL));
  }

  getLenderPhone() {
    return new Promise(resolve => {
      this.dataSource.forEach(element => {
        this._lenderService.getLender(element.id_lender).subscribe(async (l: any) => {
          const lenderUser = l['Lender']['id_user'];
          await this._userService.getUser(lenderUser).subscribe((u: any) => {
            resolve(this.selectLenderPhone = u['user']['phone']);
            this.selectLenderName = `${u['user']['surname']}, ${u['user']['name']}`;
          })
        })
      });
    });
  }

  getSelectedPatientData() {
    return new Promise(resolve => {
      this._patientService.getPatient(this.selectPatientId).subscribe((p: any) => {
        resolve(this.selectPatient = p['Patient']);
      });
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

  newPatient(): void {
    this._bottomSheet.open(NewPatientComponent);
  }

  getDates() {
    return new Promise(resolve => {
      this.selectDateStart = new Date();
      this.selectDateFinish = new Date();
      this.selectDateStart.setFullYear(this.selectStart['_i']['year'], this.selectStart['_i']['month'], this.selectStart['_i']['date']);
      this.selectDateFinish.setFullYear(this.selectFinish['_i']['year'], this.selectFinish['_i']['month'], this.selectFinish['_i']['date']);
      /* this.selectStart = this.selectDateStart.toLocaleDateString()
      resolve(this.selectFinish = this.selectDateFinish.toLocaleDateString()); */
      resolve(console.log('ok'));
    })

  }


  async sendMessage() {
    console.log(await this.getLenderPhone());   
  }

  formatDate(dp) {
    let day: string = '';
    let month: string = '';
    let year: string = `${dp['_i']['year']}`
    if (dp['_i']['date'] < 10) {
      day = `0${dp['_i']['date']}`;
    } else {
      day = `${dp['_i']['date']}`;
    }

    if (dp['_i']['month'] < 10) {
      month = `0${dp['_i']['month']}`;
    } else {
      month = `${dp['_i']['month']}`;
    }

    month = (Number(month)+1).toString();

    return `${year}-${month}-${day}`;
  }

  async saveNewBenefit() {
    await this.saveBenefit(await this.setNewBenefit());
    await this.saveBenefitItems(this.dataSource);
    /* this.openSnackBar('Prestación creda! ¿Desea informar a prestadores?', 'Enviar Mensaje');
    this._router.navigate(['/prestaciones']); */
    const dialog = this._dialog.open(this.d_benefitOk);
    dialog.afterClosed().subscribe(() => {
      this._router.navigate(['/prestaciones']);
    })
  }

  messageToLenders() {
    this.loadNumbers = true;
    if (this.dataSource.length == 1) {
      this.sendMessage();
    }
  }

  dismissDialog() {
    this._dialog.closeAll();
  }

  setNewBenefit(): Promise<Benefit> {
    return new Promise(resolve => {
      let start_at: string = '';
      start_at = this.formatDate(this.selectStart);
      let finish_at: string = '';
      finish_at = this.formatDate(this.selectFinish);
      let benefit: Benefit = new Benefit(
        this.selectPatientId,
        this.selectDiagnosis,
        start_at,
        finish_at,
        1,
        0
      );
      resolve(benefit);
    })

  }

  saveBenefit(benefit: Benefit) {
    return new Promise(resolve => {
      this._benefitService.newBenefit(benefit).subscribe(p => {
        resolve(console.log(p));
      })
    })
  }

  async saveBenefitItems(items: tableReq[]) {
    return new Promise(async resolve => {
      await this.getLastBenefit();
      items.forEach(async element => {
        resolve(this.saveItem(this.lastBenefitId, element));
      })
    })
  }



  /* id_b -> lastBenefit (getLastBenefit) */
  saveItem(id_b: number, item: tableReq) {
    return new Promise(async resolve => {
      console.log(item);
      this._benefitService.newBenefitItem(await this.setBenefitItem(id_b, item)).subscribe(response => {
        resolve(console.log(response));
      });
    })

  }

  getLastBenefit() {
    return new Promise(resolve => {
      this._benefitService.getLastBenefit().subscribe((b: any) => {
        console.log(this.lastBenefitId);
        resolve(this.lastBenefitId = b['LastBenefit'].id);
      });
    })
  }

  setBenefitItem(id: number, e: tableReq): Promise<BenefitItem> {
    return new Promise(resolve => {
      console.log(e);
      let item: BenefitItem = new BenefitItem(
        id,
        e.id_lender,
        e.req,
        e.ind,
        e.hs,
        0
      );
      console.log(item);
      resolve(item);
    })

  }

  deleteBenefitItem(item){
    console.log(item);
    this.dataSource.forEach(element => {
      if(element.id_lender == item.id_lender){
        console.log(element);
      }
    })
  }

  editBenefitItem(item){
    console.log(item);
  }
}
