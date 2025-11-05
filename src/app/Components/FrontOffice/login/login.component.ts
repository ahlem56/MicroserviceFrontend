import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/Core/user.service';
import { Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule, CommonModule],
  standalone: true
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.userService.login(email, password).subscribe(
        (response: { token: string; role: string; user: any }) => {
          console.log('Login successful, response:', response);
          const role = response.role.toLowerCase();
          const user = response.user;
          if (role === 'admin') {
            this.router.navigate(['back-office/dashboard']);
          } else if (role === 'driver') {
            this.router.navigate(['driver-interface/trips']);
          } else if (role === 'USER' && user.partner && user.partner.partnerId) {
            this.router.navigate(['partner/commissions']);
          } else {
            this.router.navigate(['landingPage']);
          }
          alert('Login successful');
        },
        (error: any) => {
          console.error('Login error:', error);
          alert('Invalid email or password!');
        }
      );
    } else {
      console.log('Form is not valid');
      alert('Please fill out the form correctly');
    }
  }
}