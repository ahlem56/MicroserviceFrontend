import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ComplaintService } from 'src/app/Core/complaint.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-complaint-list-backoffice',
  templateUrl: './complaint-listBackOffice.component.html',
  styleUrls: ['./complaint-listBackOffice.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ComplaintListBackOfficeComponent implements OnInit {
  complaints: any[] = []; // Toutes les réclamations
  filteredComplaints: any[] = []; // Réclamations filtrées
  isLoading: boolean = false; // État de chargement
  complaintStatuses: string[] = ['ignored', 'pending', 'resolved']; // Statuts possibles
  filterType: string = 'all'; // Filtre actuel

  constructor(private complaintService: ComplaintService, private router: Router) {}

  ngOnInit(): void {
    this.loadComplaints();
  }

  // Charger les réclamations depuis l'API
  loadComplaints(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.isLoading = true;
    this.complaintService.getAllComplaints(headers).subscribe({
      next: (response) => {
        this.complaints = response;
        this.applyFilter(this.filterType); // Appliquer le filtre initial

        // Charger les informations de l'utilisateur pour chaque réclamation
        this.complaints.forEach((complaint) => {
          if (complaint?.complaintId) {
            this.getSimpleUserByComplaintId(complaint.complaintId, headers);
          }
        });

        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des réclamations :', error);
        this.isLoading = false;
        alert('Erreur lors du chargement des réclamations.');
      },
    });
  }

  // Appliquer un filtre en fonction du statut
  applyFilter(status: string): void {
    this.filterType = status;
    if (status === 'all') {
      this.filteredComplaints = [...this.complaints]; // Afficher toutes les réclamations
    } else {
      this.filteredComplaints = this.complaints.filter(
        (complaint) => complaint.complaintStatus === status
      );
    }
  }

  // Rediriger vers les détails de la réclamation
  viewDetails(complaintId: number): void {
    this.router.navigate(['back-office/complaints', complaintId]);
  }

  // Obtenir les informations du SimpleUser à partir de l'ID d'une réclamation
  getSimpleUserByComplaintId(complaintId: number, headers: HttpHeaders): void {
    this.complaintService.getUserByComplaintId(complaintId, headers).subscribe({
      next: (user) => {
        const complaint = this.complaints.find((c) => c.complaintId === complaintId);
        if (complaint) {
          complaint.simpleUser = user;
          // Update filteredComplaints to reflect user data
          const filteredComplaint = this.filteredComplaints.find((c) => c.complaintId === complaintId);
          if (filteredComplaint) {
            filteredComplaint.simpleUser = user;
          }
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des informations du SimpleUser :', error);
      },
    });
  }


// Calculate number of dots based on severity
getSeverityDots(severity: string): number {
  switch (severity?.toLowerCase()) {
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

// Determine dot color based on severity
getSeverityColor(severity: string): string {
  return severity?.toLowerCase() === 'high' ? 'red' : 'orange';
}

}