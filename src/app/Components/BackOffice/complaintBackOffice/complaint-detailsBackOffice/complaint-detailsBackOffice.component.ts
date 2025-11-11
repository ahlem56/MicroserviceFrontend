import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ComplaintService } from 'src/app/Core/complaint.service';
import { HttpHeaders } from '@angular/common/http';
import { AccessDeniedComponent } from "../../../../Shared/access-denied/access-denied.component";

@Component({
  selector: 'app-complaint-details-backoffice',
  templateUrl: './complaint-detailsBackOffice.component.html',
  styleUrls: ['./complaint-detailsBackOffice.component.css'],
  imports: [AccessDeniedComponent]
})
export class ComplaintDetailsBackOfficeComponent implements OnInit {
  complaint: any | null = null;
  isLoading: boolean = false; // Pour afficher un indicateur de chargement

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private complaintService: ComplaintService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    const complaintId = id ? +id : null;

    if (complaintId) {
      this.loadComplaint(complaintId);
    } else {
      console.error('ID de réclamation non trouvé.');
    }
  }

  // Charger les détails d'une réclamation
  loadComplaint(complaintId: number): void {
    this.isLoading = true; // Afficher l'indicateur de chargement

    const headers = this.getAuthHeaders(); // Obtenir les en-têtes d'authentification

    this.complaintService.getComplaintById(complaintId, headers).subscribe({
      next: (response) => {
        this.complaint = response;
        this.isLoading = false; // Masquer l'indicateur de chargement
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la réclamation :', error);
        this.isLoading = false; // Masquer l'indicateur de chargement
        alert('Erreur lors du chargement de la réclamation.');
      }
    });
  }

  // Note: user lookup by complaint is not supported in Reclamation MS.

  // Ignorer une réclamation
  ignoreComplaint(): void {
    alert('Ignore action is not supported by the Reclamation microservice.');
  }

  // Répondre à une réclamation
  respondComplaint(responseText: string): void {
    alert('Respond action is not supported by the Reclamation microservice.');
  }

  // Méthode utilitaire pour obtenir les en-têtes d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('Utilisateur non authentifié.');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }
}