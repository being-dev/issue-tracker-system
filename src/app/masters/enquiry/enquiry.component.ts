import { Component, OnDestroy, OnInit } from '@angular/core';
import { MasterService } from '../master.service';
import { LoaderService } from 'src/app/loader.service';
import { Alert, Constant } from 'src/app/constant';
import { Subject } from 'rxjs/internal/Subject';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import Swal, { SweetAlertIcon, SweetAlertResult } from 'sweetalert2';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent {

  public pageTitle: String = "Enquiry Registration";
  public currentPage: number = 1;
  public itemsPerPage: number = 5;

  public tableSizes: any = [5, 10, 15, 20];

  public enquiries: any = [];
  public alerts: Alert[] = [];
  public showMessageDialog: string = 'none';

  //public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();
  public formSubmit: Boolean = false;
  public enquiryForm!: FormGroup;
  public closeResult!: string;
  public isNewForm: boolean = true;
  public defaultBirthDate: any = null;

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

  ngOnInit(): void {
    this.defaultBirthDate= null;
    this.loadEnquiries();
    this.enquiryForm = new FormGroup({
      id: new FormControl(null),
      personName: new FormControl(null, [Validators.required, Validators.maxLength(100)]),
      birthDate: new FormControl(null, [Validators.required,Validators.minLength(10),Validators.maxLength(10)]),
      address: new FormControl(null, [Validators.required, Validators.maxLength(500)]),      
      primaryContact: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
      alternateContact: new FormControl(null, [Validators.maxLength(25)]),
      enquiryCategory: new FormControl(null, [Validators.required,Validators.maxLength(25)]),
      enquiryDescription: new FormControl(null, [Validators.required,Validators.maxLength(1000)]),
      officerName: new FormControl(null, [Validators.required,Validators.maxLength(25)]),
      
    },
      {
        updateOn: 'submit'
      })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
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

  private loadEnquiries(): void {
    this.loaderService.setLoading(true);
    this.masterService.getAllEnquiries().subscribe({
      next: (response: any) => {
        if (response) {
          this.enquiries = response['body'];
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

  public confirmRemove(enquiry: any): void {
    Swal.fire({
      icon: 'question',
      title: 'Remove Enquiry',
      text: 'Are you sure want to remove enquiry?',
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
        this.masterService.removeCompany(enquiry).subscribe({
          next: (response: any) => {
            if (response) {
              this.dtTrigger.next(response);
              this.loaderService.setLoading(false);
              this.showSweetAlert(response.body, 'success', 'Removed!');
              this.loadEnquiries();
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

  public openDialog(modalDialog: any, modalId: string): void {
    this.modalService.open(modalDialog, { ariaLabelledBy: modalId, centered: true, modalDialogClass: 'modal-dialog modal-xl', backdrop: 'static', keyboard: false })
      .result.then((result) => {
        this.closeResult = 'Closed with: ${result}';
      }, (reason) => {
        this.closeResult = 'Dismissed ' + this.getDismissReason(reason);
      });
  }

  public modifyCompany(enquiry: any, modalDialog: any, modalId: string): void {
    this.loaderService.setLoading(true);
    this.masterService.getEnquiry(enquiry).subscribe({
      next: (response: any) => {
        if (response) {
          var body = response.body;
          this.isNewForm = false;
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
          this.enquiryForm.patchValue(body);
          this.defaultBirthDate = Constant.toLocalDate(body.birthDate);
          this.enquiryForm.controls['birthDate'].patchValue(this.defaultBirthDate);       
          console.log(this.defaultBirthDate);
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

  public saveEnquiryDetail(): void {
    this.formSubmit = true;
    if (this.enquiryForm.valid) {
      if (this.isNewForm) {
        this._createEnquiry();
      } else {
        this._updateEnquiry();
      }
    }
  }

  private _createEnquiry(): void {
    this.loaderService.setLoading(true);
    this.masterService.createEnquiry(this.enquiryForm.value).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          //this.alerts = [{ type: 'success', message: response.body, cssClass: "alert-success", iconClass: "bi-check-circle" }];
          this.loaderService.setLoading(false);
          this.formReset(this.enquiryForm);
          this.modalService.dismissAll(response.body);
          this.showSweetAlert(response.body, 'success', 'Congratulations!');
          this.loadEnquiries();
        }
      },
      error: (error: any) => {
        //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        this.loaderService.setLoading(false);
        this.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  private _updateEnquiry(): void {
    this.loaderService.setLoading(true);
    this.masterService.updateEnquiry(this.enquiryForm.value).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          //this.alerts = [{ type: 'success', message: response.body, cssClass: "alert-success", iconClass: "bi-check-circle" }];
          this.loaderService.setLoading(false);
          //this.formReset(this.companyForm);
          //this.modalService.dismissAll(response.body);
          this.showSweetAlert(response.body, 'success', 'Congratulations!');
          this.loadEnquiries();
        }
      },
      error: (error: any) => {
        //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        this.loaderService.setLoading(false);
        this.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  public closeForm(formGroup: FormGroup): void {
    this.formReset(formGroup);
    this.modalService.dismissAll();
  }

  public isRequiredField(fieldName: String): boolean | undefined {
    return this.enquiryForm.get(fieldName.toString())?.hasError('required');
  }

  public isInvalidField(fieldName: String): boolean | undefined {
    return this.enquiryForm.get(fieldName.toString())?.invalid;
  }

  public hasErrors(fieldName: String): boolean | undefined {
    return this.enquiryForm.get(fieldName.toString())?.errors !== null;
  }

  public hasCategoryErrors(fieldName: String, category: string): boolean | undefined {
    return this.enquiryForm.get(fieldName.toString())?.hasError(category);
  }

  public isTouched(fieldName: String): boolean | undefined {
    return this.enquiryForm.get(fieldName.toString())?.touched;
  }

  public patternError(fieldName: String): boolean | undefined {
    return this.enquiryForm.get(fieldName.toString())?.hasError('pattern');
  }
}
