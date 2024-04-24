import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from 'src/app/constant';
import { LoggerService } from 'src/app/logger.service';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient, private logger: LoggerService) {
    this.headers = new HttpHeaders();
  }

  public getAllInvoices(): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set('content-type', 'application/json');
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.get<any>(Constant.GET_ALL_INVOICES.toString(), { headers: this.headers });
  }

  public createInvoice(invoice: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.CREATE_INVOICE.toString(), invoice, { headers: this.headers });
  }

  public updateInvoice(invoice: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.UPDATE_INVOICE.toString(), invoice, { headers: this.headers });
  }

  public getInvoice(invoice: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    var getInvoiceUri = Constant.GET_INVOICE_BY_ID.replace('{invoiceId}', invoice['invoiceId']);
    return this.httpClient.get<any>(getInvoiceUri, { headers: this.headers });
  }

  public deleteInvoice(invoice: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set('content-type', 'application/json');
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    var removeInvoiceUri = Constant.REMOVE_INVOICE.replace('{invoiceId}', invoice['invoiceId']);
    return this.httpClient.delete<any>(removeInvoiceUri, { headers: this.headers });
  }

  public downloadInvoice(invoiceId: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    //this.headers = this.headers.set('responseType', 'text');
    this.headers = this.headers.set('content-type', 'application/json');
    //this.headers = this.headers.set('Content-Type', 'application/text;application/html');
    var downloadInvoiceUri = Constant.DOWNLOAD_INVOICE_BY_ID.replace('{invoiceId}', invoiceId)
    return this.httpClient.get<any>(downloadInvoiceUri, { headers: this.headers });
  }
}
