import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/Core/user.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule]
})
export class SignupComponent {
  signupForm: FormGroup;
  submitting = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]],
      cin: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      birthDate: ['', [Validators.required]]
    });
  }
  
onSignup(): void {
  console.log('Signup submit clicked', this.signupForm.value, 'valid=', this.signupForm.valid);
  if (this.signupForm.valid) {
    this.submitting = true;
    this.errorMessage = null;
    this.successMessage = null;
    const formData = this.signupForm.value;

    const signupPayload = {
      username: formData.email,       // use email as username
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      address: formData.address,
      role: 'USER'                    // default role
    };

    this.userService.signup(signupPayload).pipe(
      finalize(() => {
        this.submitting = false;
      })
    ).subscribe(
      (response: any) => {
        console.log('Signup success:', response);
        this.successMessage = 'Signup successful! Redirecting to login…';
        setTimeout(() => this.router.navigate(['/login']), 1200);
      },
      (error: any) => {
        console.error('Signup error:', error);
        this.errorMessage = error?.message || error?.error?.message || 'Signup failed. Please try again.';
      }
    );
  } else {
    this.signupForm.markAllAsTouched();
    this.errorMessage = 'Please fill out the form correctly.';
  }
}


  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get address() { return this.signupForm.get('address'); }
  get cin() { return this.signupForm.get('cin'); }
  get birthDate() { return this.signupForm.get('birthDate'); }
}