import { Injectable, OnInit } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LoggerService } from '../logger.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  private isLoggedInUser = true;

  constructor(private logger: LoggerService, private userService: UserService, private router: Router) {
    // var subscriber = this.userService.isLoggedInUser();
    // subscriber.subscribe({
    //   next: (value) => this.isLoggedInUser = value,
    //   error: (error) => this.isLoggedInUser = false
    // });
  }

  public canActivate(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {      
    //Business logic to verify user request.
    if (this.userService.isAllowUser() == false) {
      this.router.navigate(['/login']);
      return false;
    }    
    return true;
  }
}
