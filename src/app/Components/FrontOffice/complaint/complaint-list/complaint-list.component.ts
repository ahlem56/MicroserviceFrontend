import { Component, OnInit } from '@angular/core';
import { ComplaintService } from 'src/app/Core/complaint.service';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/Core/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-complaint-list',
  templateUrl: './complaint-list.component.html',
  styleUrls: ['./complaint-list.component.css']
})
export class ComplaintListFrontOfficeComponent implements OnInit {
  complaints: any[] = [];
  errorMessage: string = '';
  
  constructor(
    private complaintService: ComplaintService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Récupérer l'utilisateur connecté depuis le localStorage
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const simpleUserId = currentUser.userId;
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    this.complaintService.getComplaintsByUser(simpleUserId, headers).subscribe(
      (complaints) => {
        this.complaints = complaints;
      },
      (error) => {
        this.errorMessage = 'Error fetching complaints.';
        console.error(error);
      }
    );
  }

  // Aller aux détails d'une réclamation
  goToComplaintDetail(complaintId: number) {
    this.router.navigate(['/complaints', complaintId]);
  }

  // Modifier une réclamation
  editComplaint(complaint: any) {
    const updatedDescription = prompt('Modifier la description:', complaint.complaintDescription);
    
    if (updatedDescription !== null && updatedDescription.trim() !== '') {
      const updatedComplaint = { ...complaint, complaintDescription: updatedDescription };

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      this.complaintService.updateComplaint(complaint.complaintId, currentUser.userId, updatedComplaint, headers)
        .subscribe(
          (response) => {
            complaint.complaintDescription = updatedDescription; // Mettre à jour localement
          },
          (error) => {
            console.error('Erreur lors de la mise à jour:', error);
            alert("Erreur lors de la modification !");
          }
        );
    }
  }

  // Supprimer une réclamation
  deleteComplaint(complaintId: number) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cette réclamation ?")) {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

      this.complaintService.deleteComplaint(complaintId, currentUser.userId, headers)
        .subscribe(
          () => {
            this.complaints = this.complaints.filter(c => c.complaintId !== complaintId);
          },
          (error) => {
            console.error('Erreur lors de la suppression:', error);
            alert("Erreur lors de la suppression !");
          }
        );
    }
  }
}
