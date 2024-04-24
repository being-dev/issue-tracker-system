import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompanyComponent } from './company/company.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { DataTablesModule } from 'angular-datatables'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { EnquiryComponent } from './enquiry/enquiry.component';
import { Mypipe } from '../datepipe';




@NgModule({
  declarations: [
    CompanyComponent,
    VehicleComponent,
    EnquiryComponent,
    Mypipe
  ],
  imports: [
    CommonModule,
    DataTablesModule,
    NgxPaginationModule,
    ReactiveFormsModule,
    FormsModule,
    SweetAlert2Module
  ],
  exports: [Mypipe]
})
export class MastersModule { }
