import { Component, OnInit } from '@angular/core';
import { ComplaintService } from 'src/app/Core/complaint.service';
import { UserService } from 'src/app/Core/user.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-complaint-create',
  templateUrl: './complaint-creation.component.html',
  styleUrls: ['./complaint-creation.component.css'],
  imports: [FormsModule, CommonModule]
})
export class ComplaintCreationFrontOfficeComponent implements OnInit {
  complaint: any = {
    complaintDescription: null,
  };
  simpleUserId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  severity: string | null = null; // Store severity from backend
  constructor(
    private complaintService: ComplaintService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    // Retrieve the logged-in user from localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.simpleUserId = currentUser.userId;
    console.log("SimpleUser ID: ", this.simpleUserId);
  }

  createComplaint() {
    if (!this.simpleUserId) {
      this.errorMessage = 'User ID is not available.';
      return;
    }
  
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    // Align payload with Reclamation microservice (issueDescription + userId)
    const todayIso = new Date().toISOString().split('T')[0];
    const payload = {
      issueDescription: this.complaint?.complaintDescription ?? '',
      userId: this.simpleUserId,
      createdDate: todayIso
    };

    this.complaintService.addComplaint(payload, this.simpleUserId, headers).subscribe(
      (createdComplaint) => {
        console.log('Complaint Created', createdComplaint);
        this.successMessage = 'Your complaint has been created successfully!';
        this.errorMessage = '';
        this.severity = createdComplaint?.severity; // Store severity if backend computes it
        console.log('Severity:', this.severity);
        // Reset the form after successful creation
        this.complaint = {
          complaintDescription: '',
        };
      },
      (error) => {
        // Log the error and display a message
        console.error('Error:', error);
        if (error.status === 401 && !error.error) {
          this.errorMessage = 'An error occurred while creating the complaint.';
        } else {
          this.errorMessage = error.message || 'An error occurred while creating the complaint.';
        }
      }
    );
  }
  goToComplaintList() {
    this.router.navigate(['/complaints/list']);
  }




  getSeverityDots(): number {
    switch (this.severity?.toLowerCase()) {
      case 'low':
        return 1;
      case 'medium':
        return 2;
      case 'high':
        return 3;
      default:
        return 0; // No dots for 'unknown' or null
    }
  }

  // Helper to determine dot color
  getSeverityColor(): string {
    return this.severity?.toLowerCase() === 'high' ? 'red' : 'orange';
  }
  
  
}
