import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-popup',
  imports: [],
  templateUrl: './login-popup.component.html',
  styleUrl: './login-popup.component.scss'
})
export class LoginPopupComponent {
  @Input() message: string = ''; // The message to display in the popup

  constructor(private router: Router) {}

  // Close the popup and redirect to the login page
  closeAndRedirect() {
    this.router.navigate(['/login']);
  }
}