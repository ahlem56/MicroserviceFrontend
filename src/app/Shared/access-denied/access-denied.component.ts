import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.scss']
})
export class AccessDeniedComponent {
  constructor(private router: Router) {}

  // Method to redirect the user to the login page
  goToLogin() {
    this.router.navigate(['/login']);
  }

  // Optionally, you can allow them to go back to the home page or dashboard
  goToHome() {
    this.router.navigate(['/']);
  }
}
