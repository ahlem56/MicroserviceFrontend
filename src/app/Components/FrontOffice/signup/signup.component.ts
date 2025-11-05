import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/Core/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule]
})
export class SignupComponent {
  signupForm: FormGroup;

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
  if (this.signupForm.valid) {
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

    this.userService.signup(signupPayload).subscribe(
      (response: any) => {
        console.log('Signup success:', response);
        alert('Signup successful! You can now log in.');
        this.router.navigate(['/login']);
      },
      (error: any) => {
        console.error('Signup error:', error);
        alert('Signup failed: ' + (error.message || 'Please try again.'));
      }
    );
  } else {
    alert('Please fill out the form correctly');
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