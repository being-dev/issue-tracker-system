import { Component, OnDestroy, OnInit } from '@angular/core';
import { MasterService } from '../master.service';
import { LoaderService } from 'src/app/loader.service';
import { Alert, Constant } from 'src/app/constant';
import { Subject } from 'rxjs/internal/Subject';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.css']
})
export class CompanyComponent implements OnInit, OnDestroy {

  public companyTitle: String = "Company Master";
  public currentPage: number = 1;
  public itemsPerPage: number = 5;

  public tableSizes: any = [5, 10, 15, 20];

  public companies: any = [];
  public alerts: Alert[] = [];
  public showMessageDialog: string = 'none';

  //public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();
  public formSubmit: Boolean = false;
  public companyForm!: FormGroup;
  public closeResult!: string;
  public isNewForm: boolean = true;

  constructor(private masterService: MasterService, private loaderService: LoaderService, private modalService: NgbModal) {
    // this.dtOptions = {
    //   pagingType: 'full_numbers',
    //   pageLength: 5,
    //   dom: 'Bfrtip',
    //   processing: true,
    //   autoWidth: true,
    //   responsive: true,
    //   paging: false
    // };
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.companyForm = new FormGroup({
      companyId: new FormControl(null),
      companyCode: new FormControl(null, [Validators.required, Validators.maxLength(5)]),
      companyName: new FormControl(null, [Validators.required, Validators.min(5)]),
      gstNo: new FormControl(null, [Validators.required, Validators.maxLength(15), Validators.pattern(Constant.GSTNO_REGEXP)]),
      companyAddress: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      contactPersonName: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      ac: new FormControl(null, [Validators.required]),
      acVehicleBaseRate: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.pattern(Constant.FLOATING_REGEXP)]),
      nonAcVehicleBaseRate: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.pattern(Constant.FLOATING_REGEXP)]),
      acVehiclePerHourRate: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.pattern(Constant.FLOATING_REGEXP)]),
      nonAcVehiclePerHourRate: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.pattern(Constant.FLOATING_REGEXP)]),
      acVehiclePerKMRate: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.pattern(Constant.FLOATING_REGEXP)]),
      nonAcVehiclePerKMRate: new FormControl(null, [Validators.required, Validators.maxLength(255), Validators.pattern(Constant.FLOATING_REGEXP)])
    },
      {
        updateOn: 'submit'
      })
  }

  private loadCompanies(): void {
    this.loaderService.setLoading(true);
    this.masterService.getAllCompanies().subscribe({
      next: (response: any) => {
        if (response) {
          this.companies = response['body'];
          this.dtTrigger.next(response);
          //this.alerts = [];
          this.loaderService.setLoading(false);
        }
      },
      error: (error: any) => {
        this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        this.loaderService.setLoading(false);
      }
    });
  }

  public isRequiredField(fieldName: String): boolean | undefined {
    return this.companyForm.get(fieldName.toString())?.hasError('required');
  }

  public isInvalidField(fieldName: String): boolean | undefined {
    return this.companyForm.get(fieldName.toString())?.invalid;
  }

  public hasErrors(fieldName: String): boolean | undefined {
    return this.companyForm.get(fieldName.toString())?.errors !== null;
  }

  public hasCategoryErrors(fieldName: String, category: string): boolean | undefined {
    return this.companyForm.get(fieldName.toString())?.hasError(category);
  }

  public isTouched(fieldName: String): boolean | undefined {
    return this.companyForm.get(fieldName.toString())?.touched;
  }

  public patternError(fieldName: String): boolean | undefined {
    return this.companyForm.get(fieldName.toString())?.hasError('pattern');
  }

  public openDialog(modalDialog: any, modalId: string): void {
    this.modalService.open(modalDialog, { ariaLabelledBy: modalId, centered: true, modalDialogClass: 'modal-dialog modal-xl', backdrop: 'static', keyboard: false })
      .result.then((result) => {
        this.closeResult = 'Closed with: ${result}';
      }, (reason) => {
        this.closeResult = 'Dismissed ' + this.getDismissReason(reason);
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public saveCompanyDetail(): void {
    this.formSubmit = true;
    if (this.companyForm.valid) {
      if (this.isNewForm) {
        this._createCompany();
      } else {
        this._updateCompany();
      }
    }
  }

  private _createCompany(): void {
    this.loaderService.setLoading(true);
    this.masterService.createCompany(this.companyForm.value).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          //this.alerts = [{ type: 'success', message: response.body, cssClass: "alert-success", iconClass: "bi-check-circle" }];
          this.loaderService.setLoading(false);
          this.formReset(this.companyForm);
          this.modalService.dismissAll(response.body);
          this.showSweetAlert(response.body, 'success', 'Congratulations!');
          this.loadCompanies();
        }
      },
      error: (error: any) => {
        //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        this.loaderService.setLoading(false);
        this.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  private _updateCompany(): void {
    this.loaderService.setLoading(true);
    this.masterService.updateCompany(this.companyForm.value).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          //this.alerts = [{ type: 'success', message: response.body, cssClass: "alert-success", iconClass: "bi-check-circle" }];
          this.loaderService.setLoading(false);
          //this.formReset(this.companyForm);
          //this.modalService.dismissAll(response.body);
          this.showSweetAlert(response.body, 'success', 'Congratulations!');
          this.loadCompanies();
        }
      },
      error: (error: any) => {
        //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        this.loaderService.setLoading(false);
        this.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  public modifyCompany(company: any, modalDialog: any, modalId: string): void {
    this.loaderService.setLoading(true);
    this.masterService.getCompany(company).subscribe({
      next: (response: any) => {
        if (response) {
          this.isNewForm = false;
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
          this.companyForm.patchValue(company);
          this.openDialog(modalDialog, modalId);
        }
      },
      error: (error: any) => {
        //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        this.loaderService.setLoading(false);
        this.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  public confirmRemove(company: any): void {
    Swal.fire({
      icon: 'warning',
      title: 'Remove Company',
      text: 'Are you sure want to remove company?',
      allowEscapeKey: false,
      backdrop: false,
      showCancelButton: true,
      confirmButtonText: 'Yes,remove it',
      confirmButtonColor: '#dc3545',
      cancelButtonText: 'No,keep it',
      cancelButtonColor: '#212529',
      focusCancel: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.loaderService.setLoading(true);
        this.masterService.removeCompany(company).subscribe({
          next: (response: any) => {
            if (response) {
              this.dtTrigger.next(response);
              this.loaderService.setLoading(false);
              this.showSweetAlert(response.body, 'success', 'Removed!');
              this.loadCompanies();
            }
          },
          error: (error: any) => {
            //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
            this.loaderService.setLoading(false);
            this.showSweetAlert(error.error.body, 'error', 'Oops...!');
          }
        });
      }
    });
  }

  public formReset(formGroup: FormGroup): void {
    this.formSubmit = false;
    this.isNewForm = true;
    formGroup.reset();
    formGroup.clearValidators();
    formGroup.removeValidators;
    formGroup.markAsPristine();
    formGroup.markAsUntouched();
    formGroup.updateValueAndValidity();
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];
      control.markAsPristine();
      control.markAsUntouched();
    });
  }

  public closeForm(formGroup: FormGroup): void {
    this.formReset(formGroup);
    this.modalService.dismissAll();
  }

  private showSweetAlert(message: string, icon: SweetAlertIcon, title: string): Promise<SweetAlertResult<any>> {
    if (icon == null || !icon) {
      icon = 'info';
    }
    if (title == null || !title) {
      title = 'Information';
    }
    return Swal.fire({
      icon: icon,
      title: title,
      text: message,
      allowEscapeKey: false,
      backdrop: false,
      confirmButtonColor: '#198754'
    });
  }
}
