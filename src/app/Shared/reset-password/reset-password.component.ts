import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  imports: [CommonModule, ReactiveFormsModule],
})
export class ResetPasswordComponent {
  resetPasswordForm: FormGroup;
  token: string;
  successMessage: string = ''; // To hold success message
  errorMessage: string = ''; // To hold error message

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    // Retrieve the token from the query parameters
    this.token = this.route.snapshot.queryParamMap.get('token') as string;

    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      const newPassword = this.resetPasswordForm.get('newPassword')?.value;
      const resetData = { token: this.token, newPassword: newPassword };
      
      this.http.post('http://localhost:8089/examen/user/reset-password', resetData)
        .subscribe(
          (response) => {
            console.log('Password successfully reset');
            this.successMessage = 'Password successfully reset! You can now log in with your new password.';
            setTimeout(() => this.router.navigate(['/login']), 3000); // Redirect after 3 seconds
          },
          (error) => {
            console.error('Error resetting password', error);
            this.errorMessage = 'There was an error resetting your password. Please try again later.';
          }
        );
    }
  }
}
