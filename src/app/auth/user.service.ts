import { Injectable } from '@angular/core';
import {
  HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse
} from '@angular/common/http';
import { Observable, Subject,of, throwError } from 'rxjs';

import { LoggerService } from '../logger.service';
import { Constant } from '../constant';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private headers: HttpHeaders;

  constructor(private httpClient: HttpClient, private logger: LoggerService) {    
    this.headers = new HttpHeaders();
    this.headers = this.headers.set('content-type', 'application/json')    
  }

  public authenticateUser(userDetail: any): Observable<HttpResponse<any>> {
    return this.httpClient.post<any>(Constant.AUTHENTICATE_USER.toString(),
      userDetail, { headers: this.headers });
    //.pipe(catchError(this.handleError));
  }

  public logoutUser(): Observable<HttpResponse<any>> {
    var token = localStorage.getItem('access_token')!;
    this.headers = this.headers.set(Constant.AUTH_HEADER.toString(), token);
    return this.httpClient.post<any>(Constant.LOGOUT_USER.toString(), null, { headers: this.headers });
    //.pipe(catchError(this.handleError));
  }

  public isLoggedInUser(): Observable<boolean> {
    var token = localStorage.getItem('access_token');
    if (token && token.length > 0) {
      const reqHeaders = new HttpHeaders({
        'Content-Type': 'application/json; charset=utf-8',
        'Access-Control-Allow-Origin': '*'
      });

      const requestOptions = { headers: reqHeaders };
      return this.httpClient.post<any>(Constant.VALIDATE_USER.toString(), null,
        { headers: reqHeaders });
    }
    return of(false);
  }

  public isAllowUser(): boolean {
    var token = localStorage.getItem('access_token')!;
    return token !== null && token.length > 0 && !this.tokenExpired(token);
  }


  private tokenExpired(token: string) {
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong.
      console.error(
        `Backend returned code ${error.status}, body was: `, error.error);
    }
    // Return an observable with a user-facing error message.
    return throwError(() => new Error(error.message));
  }
}
