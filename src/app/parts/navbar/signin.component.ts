import { Component } from '@angular/core';

import { AuthService } from '../../core';

@Component({
  selector: 'app-signin',
  templateUrl: 'signin.component.html',
  styleUrls: ['signin.component.scss'],
})
export class SigninComponent {
  constructor(private authService: AuthService) { }

  googleSignin() {
    this.authService.googleSignin();
  }
}
