import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { SidenavComponent } from './components/shared/sidenav/sidenav.component';

/**
 * Material components imports.
 */
import { MatSliderModule } from '@angular/material/slider';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { HeaderComponent } from './components/shared/header/header.component';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatCardModule} from '@angular/material/card';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MAT_DATE_LOCALE} from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthInterceptortsService } from './services/auth-interceptorts.service';
import { PatientComponent } from './components/patient/patient.component';
import { NewPatientComponent } from './components/new-patient/new-patient.component';
import { LenderComponent } from './components/lender/lender.component';
import { NewLenderComponent } from './components/new-lender/new-lender.component';
import { MatNativeDateModule } from '@angular/material/core';
import { BenefitComponent } from './components/benefit/benefit.component';
import { NewBenefitComponent } from './components/new-benefit/new-benefit.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import {MatButtonToggleModule} from '@angular/material/button-toggle';


import {DatePipe} from '@angular/common';
import { NewCheckupComponent } from './components/lenders/new-checkup/new-checkup.component';
import { NewRequirementComponent } from './components/new-benefit/new-requirement/new-requirement.component';
import { BenefitsPipe } from './pipes/benefits.pipe';
import { PatientNamesPipe } from './pipes/patient-names.pipe';
import { BenefitIdPipe } from './pipes/benefit-id.pipe';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment.prod';
import { AngularFireModule } from '@angular/fire';
import { BenefitdetailComponent } from './components/benefit/benefitdetail/benefitdetail.component';
import { CheckupdetailComponent } from './components/benefit/checkupdetail/checkupdetail.component';
import { MapDialogComponent } from './components/benefit/map-dialog/map-dialog.component';
import { UrlsafePipe } from './pipes/urlsafe.pipe';
import { SplashScreenComponent } from './components/shared/splash-screen/splash-screen.component';
import { BenefitAssignedComponent } from './components/lenders/benefit-assigned/benefit-assigned.component';
import { TariffHiComponent } from './components/tariff/tariff-hi/tariff-hi.component';
import { NewTariffHiComponent } from './components/tariff/tariff_hi/new-tariff-hi/new-tariff-hi.component';
import { HealtInsuranceComponent } from './components/healt-insurance/healt-insurance.component';
import { NewHiComponent } from './components/healt_insurance/new-hi/new-hi.component';
import { BillingHiComponent } from './components/billing/billing-hi/billing-hi.component';
import { BillingComponent } from './components/billing/billing.component';
import { EditLenderComponent } from './components/lender/edit-lender/edit-lender.component';
import { EditPatientComponent } from './components/patient/edit-patient/edit-patient.component';
import { EditBenefitComponent } from './components/benefit/edit-benefit/edit-benefit.component';
import { DatetimePipe } from './pipes/datetime.pipe';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    SidenavComponent,
    HeaderComponent,
    PatientComponent,
    NewPatientComponent,
    LenderComponent,
    NewLenderComponent,
    BenefitComponent,
    NewBenefitComponent,
    NewCheckupComponent,
    NewRequirementComponent,
    BenefitsPipe,    
    PatientNamesPipe, BenefitIdPipe, BenefitdetailComponent, CheckupdetailComponent, MapDialogComponent, UrlsafePipe, SplashScreenComponent, BenefitAssignedComponent, TariffHiComponent, NewTariffHiComponent, HealtInsuranceComponent, NewHiComponent, BillingHiComponent, BillingComponent, EditLenderComponent, EditPatientComponent, EditBenefitComponent, DatetimePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MatSliderModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,    
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatButtonToggleModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  exports:[
    MatSidenavModule,
    MatToolbarModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatSnackBarModule,
    MatSortModule,
    MatButtonToggleModule
  ],
  providers: [
    {       
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptortsService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-AR',}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
