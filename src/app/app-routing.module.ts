import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CompanyComponent } from './masters/company/company.component';
import { VehicleComponent } from './masters/vehicle/vehicle.component';
import { InvoiceComponent } from './transactions/invoice/invoice.component';
import { InvoiceReportComponent } from './reports/invoice/invoice.component';
import { EnquiryComponent } from './masters/enquiry/enquiry.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', pathMatch: 'full', component: LoginComponent },
  { path: 'register', pathMatch: 'full', component: RegisterComponent, canActivate: [AuthGuardService] },
  { path: 'dashboard', pathMatch: 'full', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'masters/enquiry', pathMatch: 'full', component: EnquiryComponent, canActivate: [AuthGuardService] },
  { path: 'masters/company', pathMatch: 'full', component: CompanyComponent, canActivate: [AuthGuardService] },
  { path: 'masters/vehicle', pathMatch: 'full', component: VehicleComponent, canActivate: [AuthGuardService] },
  { path: 'transactions/invoice', pathMatch: 'full', component: InvoiceComponent, canActivate: [AuthGuardService] },
  { path: 'reports/invoice', pathMatch: 'full', component: InvoiceReportComponent, canActivate: [AuthGuardService] },
  //{ path: 'register', loadComponent: () => import('./auth/register/register.component').then(comp => comp.RegisterComponent) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
