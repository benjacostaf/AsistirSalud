import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * imports components.
 */
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { PatientComponent } from './components/patient/patient.component';
import { NewPatientComponent } from './components/new-patient/new-patient.component';
import { LenderComponent } from './components/lender/lender.component';
import { NewLenderComponent } from './components/new-lender/new-lender.component';
import { BenefitComponent } from './components/benefit/benefit.component';
import { NewBenefitComponent } from './components/new-benefit/new-benefit.component';
import { NewCheckupComponent } from './components/lenders/new-checkup/new-checkup.component';
import { BenefitAssignedComponent } from './components/lenders/benefit-assigned/benefit-assigned.component';
import { TariffHiComponent } from './components/tariff/tariff-hi/tariff-hi.component';
import { NewTariffHiComponent } from './components/tariff/tariff_hi/new-tariff-hi/new-tariff-hi.component';
import { HealtInsuranceComponent } from './components/healt-insurance/healt-insurance.component';
import { NewHiComponent } from './components/healt_insurance/new-hi/new-hi.component';
import { BillingComponent } from './components/billing/billing.component';
import { BillingHiComponent } from './components/billing/billing-hi/billing-hi.component';
import { EditLenderComponent } from './components/lender/edit-lender/edit-lender.component';
import { EditPatientComponent } from './components/patient/edit-patient/edit-patient.component';
import { EditBenefitComponent } from './components/benefit/edit-benefit/edit-benefit.component';

const routes: Routes = [
  { path: 'login', pathMatch: 'full',component: LoginComponent },
  // Patients
  { path: 'pacientes', pathMatch: 'full',component:PatientComponent},
  { path: 'nuevo-paciente', pathMatch: 'full', component:NewPatientComponent},
  { path: 'editar-paciente', pathMatch: 'full', component:EditPatientComponent},
  // Lenders
  { path: 'prestadores', pathMatch: 'full', component:LenderComponent},
  { path: 'nuevo-prestador', pathMatch: 'full', component:NewLenderComponent},
  { path: 'editar-prestador', pathMatch: 'full', component:EditLenderComponent},
  // Benefits
  { path: 'prestaciones', pathMatch: 'full', component:BenefitComponent},
  { path: 'nueva-prestacion', pathMatch: 'full', component:NewBenefitComponent},
  { path: 'editar-prestacion', pathMatch: 'full', component: EditBenefitComponent},
  //Healt Insurance Routes
  {path: 'obras-sociales', pathMatch:'full', component:HealtInsuranceComponent},
  {path: 'obras-sociales/nueva', pathMatch:'full', component:NewHiComponent},
  // Tariff Routes
  {path: 'tarifas/obras-sociales', pathMatch: 'full', component:TariffHiComponent},
  {path: 'tarifas/nueva/obras-social', pathMatch: 'full', component:NewTariffHiComponent},
  // Billing Routes
  {path: 'facturacion', pathMatch:'full', component:BillingComponent},
  {path: 'facturacion/obras-sociales', pathMatch:'full', component:BillingHiComponent},

  // Lenders Routes
    // Lenders -> Patients
    // Lenders -> Benefits
    { path: 'nuevo-checkup', pathMatch: 'full', component:NewCheckupComponent},
    { path: 'prestaciones-asignadas', pathMatch: 'full', component:BenefitAssignedComponent},
  // Universal Routes
  { path: '', pathMatch: 'full', component: HomeComponent},
  { path: '**', pathMatch: 'full', redirectTo: ''}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
