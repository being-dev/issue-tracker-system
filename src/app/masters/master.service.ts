import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Constant } from '../constant';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root'
})
export class MasterService {

  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient, private logger: LoggerService) {
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('content-type', 'application/json');
    //this.headers = this.headers.set('Access-Control-Allow-Origin', '*');
  }

  public getAllCompanies(): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.get<any>(Constant.GET_ALL_COMPANIES.toString(), { headers: this.headers });
  }

  public getCompany(company: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    var getCompanyUri = Constant.GET_COMPANY_BY_ID.replace('{companyId}', company['companyId']);
    return this.httpClient.get<any>(getCompanyUri, { headers: this.headers });
  }

  public createCompany(company: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.CREATE_COMPANY.toString(), company, { headers: this.headers });
  }

  public updateCompany(company: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.UDPATE_COMPANY.toString(), company, { headers: this.headers });
  }

  public removeCompany(company: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    var removeCompanyUri = Constant.GET_COMPANY_BY_ID.replace('{companyId}', company['companyId']);
    return this.httpClient.delete<any>(removeCompanyUri, { headers: this.headers });
  }

  public getAllVehicles(): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.get<any>(Constant.GET_ALL_VEHICLES.toString(), { headers: this.headers });
  }

  public getVehicle(vehicle: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    var getVehicleUri = Constant.GET_VEHICLE_BY_ID.replace('{vehicleId}', vehicle['vehicleId']);
    return this.httpClient.get<any>(getVehicleUri, { headers: this.headers });
  }

  public createVehicle(vehicle: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.CREATE_VEHICLE.toString(), vehicle, { headers: this.headers });
  }

  public updateVehicle(vehicle: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.UDPATE_VEHICLE.toString(), vehicle, { headers: this.headers });
  }

  public removeVehicle(vehicle: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    var removeVehicleUri = Constant.GET_VEHICLE_BY_ID.replace('{vehicleId}', vehicle['vehicleId']);
    return this.httpClient.delete<any>(removeVehicleUri, { headers: this.headers });
  }

  public getAllEnquiries(): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.get<any>(Constant.GET_ALL_ENQUIRIES.toString(), { headers: this.headers });
  }

  public getEnquiry(enquiry: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    var getEnquiryUri = Constant.GET_ENQUIRY_BY_ID.replace('{enquiryId}', enquiry['id']);
    return this.httpClient.get<any>(getEnquiryUri, { headers: this.headers });
  }

  public createEnquiry(enquiry: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.CREATE_ENQUIRY.toString(), enquiry, { headers: this.headers });
  }

  public updateEnquiry(enquiry: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.UDPATE_ENQUIRY.toString(), enquiry, { headers: this.headers });
  }

  public removeEnquiry(enquiry: any): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    var removeCompanyUri = Constant.REMOVE_ENQUIRY.replace('{enquiryId}', enquiry['id']);
    return this.httpClient.delete<any>(removeCompanyUri, { headers: this.headers });
  }
}
