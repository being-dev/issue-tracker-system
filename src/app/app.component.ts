import { Component } from '@angular/core';
import { UserService } from './auth/user.service';
import { ModalComponent } from './modal/modal.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'comodo-ui';

  public isLoggedInUser = false;
  constructor(private userService: UserService,private modalComponent: ModalComponent) {
    //this.isLoggedInUser = userService.isAllowUser();
  }

  openModal() {
    this.modalComponent.openModal();
  }
}
