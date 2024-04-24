import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Alert, Constant } from 'src/app/constant';
import { MasterService } from '../master.service';
import { LoaderService } from 'src/app/loader.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css']
})
export class VehicleComponent implements OnInit, OnDestroy, Constant {

  public vehicleMasterTitle: String = "Vehicle Master";
  public currentPage: number = 1;
  public itemsPerPage: number = 10;

  public tableSizes: any = [5, 10, 15, 20];

  public vehicles: any = [];
  public companies: any = [];
  public alerts: Alert[] = [];
  public showMessageDialog: string = 'none';

  //public dtOptions: DataTables.Settings = {};
  public dtTrigger: Subject<any> = new Subject<any>();
  public formSubmit: Boolean = false;
  public vehicleForm!: FormGroup;
  public closeResult!: string;
  public isNewForm: boolean = true;
  public defaultCompany: any = null;

  constructor(private masterService: MasterService, private loaderService: LoaderService, private modalService: NgbModal) {
  }

  public isRequiredField(fieldName: String): boolean | undefined {
    return this.vehicleForm.get(fieldName.toString())?.hasError('required');
  }

  public isInvalidField(fieldName: String): boolean | undefined {
    return this.vehicleForm.get(fieldName.toString())?.invalid;
  }

  public hasErrors(fieldName: String): boolean | undefined {
    return this.vehicleForm.get(fieldName.toString())?.errors !== null;
  }

  public hasCategoryErrors(fieldName: String, category: string): boolean | undefined {
    return this.vehicleForm.get(fieldName.toString())?.hasError(category);
  }

  public isTouched(fieldName: String): boolean | undefined {
    return this.vehicleForm.get(fieldName.toString())?.touched;
  }

  public patternError(fieldName: String): boolean | undefined {
    return this.vehicleForm.get(fieldName.toString())?.hasError('pattern');
  }

  public ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
  }

  public ngOnInit(): void {

    this.defaultCompany = null;

    this.loadVehicles();

    this.vehicleForm = new FormGroup({
      vehicleId: new FormControl(null),
      vehicleCode: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
      vehicleName: new FormControl(null, [Validators.required, Validators.maxLength(25)]),
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

  public showNewForm(modalDialog: any, modalId: string): void {
    Constant.openDialog(modalDialog, modalId, this.modalService);
  }

  public saveVehicleDetail(): void {
    this.formSubmit = true;
    if (this.vehicleForm.valid) {
      if (this.isNewForm) {
        this._createVehicle();
      } else {
        this._updateVehicle();
      }
    }
  }

  private _createVehicle(): void {
    this.loaderService.setLoading(true);
    this.masterService.createVehicle(this.vehicleForm.value).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
          this.formReset(this.vehicleForm);
          this.modalService.dismissAll(response.body);
          Constant.showSweetAlert(response.body, 'success', 'Congratulations!');
          this.loadVehicles();
        }
      },
      error: (error: any) => {
        this.loaderService.setLoading(false);
        Constant.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  private _updateVehicle(): void {
    this.loaderService.setLoading(true);
    this.masterService.updateVehicle(this.vehicleForm.value).subscribe({
      next: (response: any) => {
        if (response) {
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
          Constant.showSweetAlert(response.body, 'success', 'Congratulations!');
          this.loadVehicles();
        }
      },
      error: (error: any) => {
        this.loaderService.setLoading(false);
        Constant.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }

  public modifyVehicle(vehicle: any, modalDialog: any, modalId: string): void {
    this.loaderService.setLoading(true);
    this.masterService.getVehicle(vehicle).subscribe({
      next: (response: any) => {
        if (response) {
          this.isNewForm = false;
          this.dtTrigger.next(response);
          this.loaderService.setLoading(false);
          this.vehicleForm.patchValue(vehicle);
          //this.defaultCompany = vehicle['company']['companyId'];
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

  public closeForm(formGroup: FormGroup): void {
    this.formSubmit = false;
    this.isNewForm = true;
    this.defaultCompany = null;
    Constant.closeForm(formGroup, this.modalService);
  }

  public formReset(formGroup: FormGroup): void {
    this.formSubmit = false;
    this.isNewForm = true;
    this.defaultCompany = null;
    Constant.formReset(formGroup);
  }

  public confirmRemove(vehicle: any): void {
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
        this.masterService.removeVehicle(vehicle).subscribe({
          next: (response: any) => {
            if (response) {
              this.dtTrigger.next(response);
              this.loaderService.setLoading(false);
              Constant.showSweetAlert(response.body, 'success', 'Removed!');
              this.loadVehicles();
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

}
