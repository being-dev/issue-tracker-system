import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { Alert, Constant } from 'src/app/constant';
import { LoaderService } from 'src/app/loader.service';
import { MasterService } from 'src/app/masters/master.service';
import { InvoiceService } from 'src/app/transactions/invoice/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent implements OnInit, OnDestroy {

  public invoiceTitle: string = "Invoice";
  public alerts: Alert[] = [];
  public currentPage: number = 1;
  public itemsPerPage: number = 5;

  public tableSizes: any = [5, 10, 15, 20];

  public dtTrigger: Subject<any> = new Subject<any>();
  public formSubmit: Boolean = false;
  public invoiceForm!: FormGroup;
  public invoices: any = [];

  public vehicles: any = [];
  public companies: any = [];

  public isNewForm: boolean = true;
  public defaultCompany: any = null;
  public defaultVehicle: any = null;
  public defaultStartTime: any = null;
  public defaultEndTime: any = null;
  public defaultInvoiceDate: any = null;

  constructor(private masterService: MasterService, private invoiceService: InvoiceService, private loaderService: LoaderService, private modalService: NgbModal) {
  }

  private loadInvoices(): void {
    this.loaderService.setLoading(true);
    this.invoiceService.getAllInvoices().subscribe({
      next: (response: any) => {
        if (response) {
          this.invoices = response['body'];
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

  private loadVehicles(): void {
    this.loaderService.setLoading(true);
    this.masterService.getAllVehicles().subscribe({
      next: (response: any) => {
        if (response) {
          this.vehicles = response['body'];
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
        }
      },
      error: (error: any) => {
        this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        this.loaderService.setLoading(false);
      }
    });
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
    return this.invoiceForm.get(fieldName.toString())?.hasError('required');
  }

  public isInvalidField(fieldName: String): boolean | undefined {
    return this.invoiceForm.get(fieldName.toString())?.invalid;
  }

  public hasErrors(fieldName: String): boolean | undefined {
    return this.invoiceForm.get(fieldName.toString())?.errors !== null;
  }

  public hasCategoryErrors(fieldName: String, category: string): boolean | undefined {
    return this.invoiceForm.get(fieldName.toString())?.hasError(category);
  }

  public isTouched(fieldName: String): boolean | undefined {
    return this.invoiceForm.get(fieldName.toString())?.touched;
  }

  public patternError(fieldName: String): boolean | undefined {
    return this.invoiceForm.get(fieldName.toString())?.hasError('pattern');
  }

  public ngOnInit(): void {

    this.defaultCompany = null;
    this.defaultVehicle = null;
    this.defaultStartTime = null;
    this.defaultInvoiceDate = null;

    this.loadCompanies();
    this.loadVehicles();

    this.loadInvoices();

    this.invoiceForm = new FormGroup({
      invoiceId: new FormControl(null),
      company: new FormControl(null, [Validators.required]),
      vehicle: new FormControl(null, [Validators.required]),
      fromLocation: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      toLocation: new FormControl(null, [Validators.required, Validators.maxLength(255)]),
      startKilometer: new FormControl(null, [Validators.required, Validators.maxLength(15), Validators.pattern(Constant.NUMBER_REGEXP)]),
      endKilometer: new FormControl(null, [Validators.required, Validators.maxLength(15), Validators.pattern(Constant.NUMBER_REGEXP)]),
      startTime: new FormControl(null, [Validators.required]),
      endTime: new FormControl(null, [Validators.required]),
      invoiceDate: new FormControl(null),
      tollTax: new FormControl(null, [Validators.pattern(Constant.FLOATING_REGEXP)]),
      parkingTax: new FormControl(null, [Validators.pattern(Constant.FLOATING_REGEXP)])
    },
      {
        updateOn: 'submit'
      })
  }

  public ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public showNewForm(modalDialog: any, modalId: string): void {
    Constant.openDialog(modalDialog, modalId, this.modalService);
  }

  public closeForm(formGroup: FormGroup): void {
    this.formSubmit = false;
    this.isNewForm = true;
    this.defaultCompany = null;
    this.defaultVehicle = null;
    Constant.closeForm(formGroup, this.modalService);
  }

  public formReset(formGroup: FormGroup): void {
    this.formSubmit = false;
    this.isNewForm = true;
    this.defaultCompany = null;
    this.defaultVehicle = null;
    Constant.formReset(formGroup);
  }

  public saveInvoiceDetail(): void {
    this.formSubmit = true;
    if (this.invoiceForm.valid) {
      var invoice = {
        'invoiceId': this.invoiceForm.value.invoiceId,
        'vehicle': { 'vehicleId': this.invoiceForm.value.vehicle }, 'company': { 'companyId': this.invoiceForm.value.company },
        'fromLocation': this.invoiceForm.value.fromLocation, 'toLocation': this.invoiceForm.value.toLocation,
        'startKilometer': this.invoiceForm.value.startKilometer, 'endKilometer': this.invoiceForm.value.endKilometer,
        'startTime': Constant.dateLocalTime(this.invoiceForm.value.startTime), 'endTime': Constant.dateLocalTime(this.invoiceForm.value.endTime),
        'invoiceDate': Constant.dateLocalTime(this.invoiceForm.value.invoiceDate), 'tollTax': this.invoiceForm.value.tollTax,
        'parkingTax': this.invoiceForm.value.parkingTax,
      };
      console.log(invoice);
      if (this.isNewForm) {
        this._createInvoice(invoice);
      } else {
        this._updateInvoice(invoice);
      }
    }
  }

  private _createInvoice(invoice: any): void {
    this.loaderService.setLoading(true);
    this.invoiceService.createInvoice(invoice).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
          this.formReset(this.invoiceForm);
          this.modalService.dismissAll(response.body);
          Constant.showSweetAlert(response.body, 'success', 'Congratulations!');
          this.loadInvoices();
        }
      },
      error: (error: any) => {
        this.loaderService.setLoading(false);
        Constant.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  private _updateInvoice(invoice: any): void {
    this.loaderService.setLoading(true);
    this.invoiceService.updateInvoice(invoice).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
          Constant.showSweetAlert(response.body, 'success', 'Congratulations!');
          this.loadInvoices();
        }
      },
      error: (error: any) => {
        this.loaderService.setLoading(false);
        Constant.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  public confirmRemove(invoice: any): void {
    Swal.fire({
      icon: 'warning',
      title: 'Remove Vehicle',
      text: 'Are you sure want to remove vehicle?',
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
        this.invoiceService.deleteInvoice(invoice).subscribe({
          next: (response: any) => {
            if (response) {
              this.dtTrigger.next(response);
              this.loaderService.setLoading(false);
              Constant.showSweetAlert(response.body, 'success', 'Removed!');
              this.loadInvoices();
            }
          },
          error: (error: any) => {
            //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
            this.loaderService.setLoading(false);
            Constant.showSweetAlert(error.error.body, 'error', 'Oops...!');
          }
        });
      }
    });
  }

  public modifyInvoice(invoice: any, modalDialog: any, modalId: string): void {
    this.loaderService.setLoading(true);
    this.invoiceService.getInvoice(invoice).subscribe({
      next: (response: any) => {
        if (response) {
          var body = response.body;
          this.isNewForm = false;
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
          this.invoiceForm.patchValue(body);
          this.defaultStartTime = Constant.dateTimeLocal(body.startTime);
          this.defaultEndTime = Constant.dateTimeLocal(body.endTime);
          this.defaultInvoiceDate = Constant.dateTimeLocalDate(body.invoiceDate);
          this.defaultCompany = body['company']['companyId'];
          this.defaultVehicle = body['vehicle']['vehicleId'];
          Constant.openDialog(modalDialog, modalId, this.modalService);
        }
      },
      error: (error: any) => {
        //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        this.loaderService.setLoading(false);
        Constant.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }


  public downloadInvoice(invoice: any): void {
    this.loaderService.setLoading(true);
    this.invoiceService.downloadInvoice(invoice['invoiceId']).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          //var blob = new Blob([response], {type: 'application/text'});
          // IE doesn't allow using a blob object directly as link href
          // instead it is necessary to use msSaveOrOpenBlob
          // if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          //   window.navigator.msSaveOrOpenBlob(blob, fileName);
          //   return;
          // }         
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(new Blob([atob(response.body.content)], { type: response.body.contentType }));
          const contentDisposition = response.body['Content-Disposition'];
          var fileName = invoice['invoiceDate'] + '_' + invoice['companyName'] + ".html"; //contentDisposition.split(';')[1].split('filename')[1].trim();          
          downloadLink.download = fileName;
          this.loaderService.setLoading(false);
          downloadLink.click();
        }
      },
      error: (error: any) => {
        console.log(error);
        //this.alerts = [{ type: 'danger', message: error.error.body, cssClass: "alert-danger", iconClass: "bi-x-circle" }];
        Constant.showSweetAlert(error.error.body, 'error', 'Downloading Error');
        this.loaderService.setLoading(false);
      }
    });
  }

}
