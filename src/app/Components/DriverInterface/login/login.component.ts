import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [ReactiveFormsModule,CommonModule],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email field with required and email format validation
      password: ['', [Validators.required, Validators.minLength(6)]],  // Password field with required and min length validation
    });
  }

  onLogin(): void {
    if (this.loginForm.valid) {
      console.log('Login successful', this.loginForm.value);
      // Handle login logic here (e.g., call your authentication service)
    } else {
      console.log('Form is not valid');
    }
  }
}
