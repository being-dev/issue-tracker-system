import { Component, OnInit } from '@angular/core';
import { NgForm, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
//import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../user.service';
import { LoggerService } from 'src/app/logger.service';
import { LoaderService } from '../../loader.service';
import { Alert, Constant } from 'src/app/constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  //imports: [NgbAlertModule],
  providers: []
})
export class LoginComponent implements OnInit {

  public loginForm!: FormGroup;
  public formSubmit: Boolean = false;
  public alerts: Alert[] = [];

  constructor(private userService: UserService, private loggerService: LoggerService,
    private loaderService: LoaderService, private router: Router) {

    if (this.userService.isAllowUser()) {
      this.router.navigate(['/register']);
    }
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      userName: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    },
      {
        updateOn: 'submit'
      })
  }

  public authenticate(): void {
    this.formSubmit = true;
    if (this.loginForm.valid) {
      this.loggerService.log(this.loginForm.value);
      this.loaderService.setLoading(true);
      this.userService.authenticateUser(this.loginForm.value)
        .subscribe({
          next: (response: any) => {
            if (response) {
              var body = JSON.parse(response.body);
              localStorage.setItem(Constant.ACCESS_TOKEN.toString(), body['token']);
              this.alerts = [];
              this.loaderService.setLoading(false);
              this.router.navigate(['/dashboard']);
            }
          },
          error: (error: any) => {
            //this.alerts = [{ type: 'alert-danger', message: error.error.body,  cssClass: "", iconClass:"" }];
            Constant.showSweetAlert(error.error.body,'error','Unauthorised access');
            this.loggerService.error(error);
            this.loaderService.setLoading(false);
          }
        });
    }
  }

}
