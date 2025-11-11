import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Core/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule, RouterModule]  // Import required standalone modules
})
export class LoginComponent {
  loginForm: FormGroup;
  submitting = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private userService: UserService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      this.submitting = true;
      this.errorMessage = null;
      const { email, password } = this.loginForm.value;

      this.userService.login(email, password).subscribe(
        (response) => {
          // Store auth token and user role
          const token = response.token?.startsWith('Bearer ')
            ? response.token.split(' ')[1]
            : response.token;
          localStorage.setItem('token', token);
          localStorage.setItem('userRole', response.role);
          localStorage.setItem('user', JSON.stringify(response.user));

          // Redirect based on user role (case-insensitive comparison)
          const role = response.role.toLowerCase();
          const navigateByRole = () => {
            if (role === 'admin') {
              this.router.navigate(['back-office/dashboard']);
            } else if (role === 'driver') {
              this.router.navigate(['driver-interface/trips']);
            } else {
              this.router.navigate(['landingPage']);
            }
          };

          this.userService.refreshUserProfile().subscribe({
            next: () => {
              navigateByRole();
              this.submitting = false;
            },
            error: () => {
              navigateByRole();
              this.submitting = false;
            }
          });
        },
        (error) => {
          console.error('Login error:', error);
          this.errorMessage = error?.error?.message || 'Invalid email or password!';
          this.submitting = false;
        }
      );
    } else {
      console.log('Form is not valid');
    }
  }
}
