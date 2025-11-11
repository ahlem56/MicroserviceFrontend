import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'src/app/Core/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
  imports: [ReactiveFormsModule, CommonModule]
})
export class EditProfileComponent implements OnInit {
  editProfileForm: FormGroup;
  user: any;
  errorMessage: string = '';
  profileImageUrl: string | null = null;
  photoUploading = false;
  photoSuccessMessage: string | null = null;

  constructor(private userService: UserService, private fb: FormBuilder, private router: Router) {
    this.editProfileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: [''],
      cin: [''],
      birthDate: [''],
      profilePhoto: ['']
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.user = JSON.parse(userData);
      this.editProfileForm.patchValue({
        firstName: this.user.firstName,
        lastName: this.user.lastName,
        email: this.user.email,
        address: this.user.address,
        cin: this.user.cin,
        birthDate: this.user.birthDate,
        profilePhoto: this.user.userProfilePhoto ?? ''
      });
      this.profileImageUrl = this.resolveProfileImage();
    }
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.uploadProfilePhoto(file);
    }
  }

  private uploadProfilePhoto(file: File): void {
    this.photoUploading = true;
    this.photoSuccessMessage = null;
    this.errorMessage = '';

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.profileImageUrl = base64;
      this.editProfileForm.patchValue({ profilePhoto: base64 });

      this.userService
        .uploadProfileImage(base64)
        .pipe(finalize(() => (this.photoUploading = false)))
        .subscribe({
          next: (response) => {
            const updatedPhoto = response?.updated?.profilePhoto || base64;
            this.user = { ...this.user, userProfilePhoto: updatedPhoto };
            localStorage.setItem('user', JSON.stringify(this.user));
            this.profileImageUrl = this.resolveProfileImage();
            this.photoSuccessMessage = 'Profile photo updated successfully!';
            document.dispatchEvent(new Event('updateProfileImage'));
          },
          error: (error) => {
            console.error('Error uploading profile photo:', error);
            this.errorMessage =
              error.error?.message || error.message || 'Failed to upload profile photo. Please try again.';
          }
        });
    };
    reader.onerror = () => {
      this.photoUploading = false;
      this.errorMessage = 'Failed to read image file. Please try a different image.';
    };

    reader.readAsDataURL(file);
  }

  private resolveProfileImage(): string {
    const photo = this.user?.userProfilePhoto || this.editProfileForm.get('profilePhoto')?.value;
    if (photo) {
      if (typeof photo === 'string' && photo.startsWith('data:image')) {
        return photo;
      }
      if (typeof photo === 'string' && photo.startsWith('http')) {
        return photo;
      }
      const base64Pattern = /^[A-Za-z0-9+/=]+$/;
      if (typeof photo === 'string' && base64Pattern.test(photo.replace(/\s/g, ''))) {
        return `data:image/jpeg;base64,${photo}`;
      }
    }
    return 'assets/FrontOffice/images/users/user4.jpg';
  }

  /** ✅ Add this function to update profile */
  saveChanges(): void {
    if (this.editProfileForm.valid) {
      const formData = { ...this.editProfileForm.value };
      if (formData.birthDate) {
        const dateObj = new Date(formData.birthDate);
        formData.birthDate = dateObj.toISOString().split('T')[0];
      }
      if (this.editProfileForm.get('profilePhoto')?.value) {
        formData.profilePhoto = this.editProfileForm.get('profilePhoto')?.value;
      }

      this.userService.updateUserProfile(formData).subscribe({
        next: (response) => {
          alert(response.message || 'Profile updated successfully!');
          const updatedUser = { ...this.user, ...formData };
          this.user = updatedUser;
          localStorage.setItem('user', JSON.stringify(updatedUser));
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          console.error('Error updating profile:', error);
          this.errorMessage = error.error?.message || error.message || 'An unknown error occurred';
        }
      });
    }
  }

  cancelEdit(): void {
    this.router.navigate(['/profile']);
  }
}
