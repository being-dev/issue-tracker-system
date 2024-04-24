import { FormGroup } from "@angular/forms";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal, { SweetAlertIcon, SweetAlertResult } from "sweetalert2";
import { environment } from './../environments/environment';

export class Constant {

    public static AUTH_HEADER: String = 'Authorization';
    public static ACCESS_TOKEN: String = 'access_token';
    private static BASE_URI: String = environment.apiUrl;
    public static AUTHENTICATE_USER: String = this.BASE_URI + '/api/v1/user/auth';
    public static VALIDATE_USER: String = this.BASE_URI + '/api/v1/token/validate';
    public static LOGOUT_USER: String = this.BASE_URI + '/api/v1/user/logout';

    public static GET_ALL_COMPANIES: String = this.BASE_URI + '/api/v1/secure/master/company/getall';
    public static CREATE_COMPANY: String = this.BASE_URI + '/api/v1/secure/master/company/create';
    public static GET_COMPANY_BY_ID: String = this.BASE_URI + '/api/v1/secure/master/company/{companyId}';
    public static UDPATE_COMPANY: String = this.BASE_URI + '/api/v1/secure/master/company/update';
    public static REMOVE_COMPANY: String = this.BASE_URI + '/api/v1/secure/master/company/{companyId}/delete';

    public static GET_ALL_VEHICLES: String = this.BASE_URI + '/api/v1/secure/master/vehicle/getall';
    public static CREATE_VEHICLE: String = this.BASE_URI + '/api/v1/secure/master/vehicle/create';
    public static GET_VEHICLE_BY_ID: String = this.BASE_URI + '/api/v1/secure/master/vehicle/{vehicleId}';
    public static UDPATE_VEHICLE: String = this.BASE_URI + '/api/v1/secure/master/vehicle/update';
    public static REMOVE_VEHICLE: String = this.BASE_URI + '/api/v1/secure/master/vehicle/{vehicleId}/delete';

    public static GET_ALL_INVOICES: String = this.BASE_URI + '/api/v1/secure/billing/invoice/getall';
    public static CREATE_INVOICE: String = this.BASE_URI + '/api/v1/secure/billing/invoice/create';
    public static GET_INVOICE_BY_ID: String = this.BASE_URI + '/api/v1/secure/billing/invoice/{invoiceId}';
    public static DOWNLOAD_INVOICE_BY_ID: String = this.BASE_URI + '/api/v1/secure/billing/invoice/download/{invoiceId}';
    public static UPDATE_INVOICE: String = this.BASE_URI + '/api/v1/secure/billing/invoice/update';
    public static REMOVE_INVOICE: String = this.BASE_URI + '/api/v1/secure/billing/invoice/{invoiceId}/delete';

    public static GET_ALL_ENQUIRIES: String = this.BASE_URI + '/api/v1/secure/master/enquiry/getall';
    public static CREATE_ENQUIRY: String = this.BASE_URI + '/api/v1/secure/master/enquiry/create';
    public static GET_ENQUIRY_BY_ID: String = this.BASE_URI + '/api/v1/secure/master/enquiry/{enquiryId}';
    public static UDPATE_ENQUIRY: String = this.BASE_URI + '/api/v1/secure/master/enquiry/update';
    public static REMOVE_ENQUIRY: String = this.BASE_URI + '/api/v1/secure/master/enquiry/{enquiryId}/delete';

    public static NUMBER_REGEXP = /^([0-9]+)$/;
    public static FLOATING_REGEXP = /^([0-9]+([.][0-9]*)?|[.][0-9]+)$/;
    public static GSTNO_REGEXP = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

    public static openDialog(modalDialog: any, modalId: string, modalService: NgbModal): void {
        modalService.open(modalDialog, { ariaLabelledBy: modalId, centered: true, modalDialogClass: 'modal-dialog modal-xl', backdrop: 'static', keyboard: false })
            .result.then((result) => {
                //this.closeResult = 'Closed with: ${result}';
            }, (reason) => {
                //this.closeResult = 'Dismissed ' + this.getDismissReason(reason);
            });
    }

    private static getDismissReason(reason: any): string {
        if (reason === ModalDismissReasons.ESC) {
            return 'by pressing ESC';
        } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
            return 'by clicking on a backdrop';
        } else {
            return `with: ${reason}`;
        }
    }

    public static formReset(formGroup: FormGroup): void {
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

    public static closeForm(formGroup: FormGroup, modalService: NgbModal): void {
        Constant.formReset(formGroup);
        modalService.dismissAll();
    }

    public static showSweetAlert(message: string, icon: SweetAlertIcon, title: string): Promise<SweetAlertResult<any>> {
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

    public static dateTimeLocal(datetime: any): string {
        if (datetime == undefined || datetime == null || datetime === 0) {
            const dt = new Date();
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            return dt.toISOString().slice(0, 16);
        } else {
            const dt = new Date(datetime);
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            return dt.toISOString().slice(0, 16);
        }
    }

    public static toLocalDate(datetime: any): string {
        if (datetime == undefined || datetime == null || datetime === 0) {
            const dt = new Date();
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            return dt.toISOString().slice(0, 10);
        } else {
            const dt = new Date(datetime);
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            return dt.toISOString().slice(0, 10);
        }
    }

    public static dateTimeLocalDate(datetime: any): string {
        if (datetime == undefined || datetime == null || datetime === 0) {
            const dt = new Date();
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            return dt.toISOString().slice(0, 16);
        } else {
            const dt = new Date(datetime);
            dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
            return dt.toISOString().slice(0, 10);
        }
    }

    public static dateLocalTime(datetime: any): number {
        if (datetime == undefined || datetime == null || datetime === 0) {
            const dt = new Date();
            dt.setMinutes(dt.getMinutes());
            return dt.getTime();
        } else {
            const dt = new Date(datetime);
            dt.setMinutes(dt.getMinutes());
            return dt.getTime();
        }
    }
}


export interface Alert {
    type: string;
    message: string;
    cssClass: string;
    iconClass: string;
}
