import { Component } from '@angular/core';
import { UserService } from '../auth/user.service';
import { LoaderService } from '../loader.service';
import { Constant } from '../constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public userService: UserService,private loaderService: LoaderService,private router: Router) {

  }

  public logout() : void {

    this.loaderService.setLoading(true);

    this.userService.logoutUser().subscribe({
      next: (response: any) => {
        if (response) {
          localStorage.removeItem('access_token');          
          this.loaderService.setLoading(false);
          this.router.navigate(['/login']);
        }
      },
      error: (error: any) => {
        this.loaderService.setLoading(false);
        Constant.showSweetAlert(error.error.body, 'error', 'Oops...!');
      }
    });
  }
}
