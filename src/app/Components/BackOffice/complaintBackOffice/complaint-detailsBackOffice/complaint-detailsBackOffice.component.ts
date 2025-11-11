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

        // Charger les informations de l'utilisateur associé à la réclamation
        this.loadSimpleUserDetails(complaintId, headers);
      },
      error: (error) => {
        console.error('Erreur lors du chargement de la réclamation :', error);
        this.isLoading = false; // Masquer l'indicateur de chargement
        alert('Erreur lors du chargement de la réclamation.');
      }
    });
  }

  // Charger les informations de l'utilisateur (SimpleUser)
  loadSimpleUserDetails(complaintId: number, headers: HttpHeaders): void {
    this.complaintService.getUserByComplaintId(complaintId, headers).subscribe({
      next: (user) => {
        console.log('Informations du SimpleUser :', user);

        // Associer les informations de l'utilisateur à la réclamation
        if (this.complaint) {
          this.complaint.simpleUser = user;
        }
      },
      error: (error) => {
        console.error('Erreur lors de la récupération des informations du SimpleUser :', error);
      }
    });
  }

  // Ignorer une réclamation
  ignoreComplaint(): void {
    if (!this.complaint) return;

    // Récupérer l'objet utilisateur depuis localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('Utilisateur non authentifié.');
      alert("Erreur : utilisateur non authentifié.");
      return;
    }

    const user = JSON.parse(userString);
    if (!user.userId) {
      console.error("Admin ID introuvable dans l'objet utilisateur.");
      alert("Erreur : Admin non authentifié.");
      return;
    }
    const adminId = user.userId; // Récupération de l'ID de l'admin

    const headers = this.getAuthHeaders(); // Récupération des headers d'authentification

    this.isLoading = true;

    this.complaintService.ignoreComplaint(
      this.complaint.complaintId,
      adminId,
      headers
    ).subscribe({
      next: () => {
        alert('Complaint ignored successfully.');
       
        this.router.navigate(['/back-office/complaints']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur lors de l'ignorance de la réclamation :", error);
        this.isLoading = false;

        if (error.status === 401) {
          alert('Session expirée. Veuillez vous reconnecter.');
          this.router.navigate(['/login']); // Rediriger vers la page de connexion
        } else {
          alert("Erreur lors de l'ignorance de la réclamation.");
        }
      }
    });
  }

  // Répondre à une réclamation
  respondComplaint(responseText: string): void {
    if (!responseText) {
      alert('Please Enter A response before submitting.');
      return;
    }

    // Récupérer l'objet utilisateur depuis localStorage
    const userString = localStorage.getItem('user');
    if (!userString) {
      console.error('Utilisateur non authentifié.');
      alert("Erreur : utilisateur non authentifié.");
      return;
    }

    const user = JSON.parse(userString);
    if (!user.userId) {
      console.error("Admin ID introuvable dans l'objet utilisateur.");
      alert("Erreur : Admin non authentifié.");
      return;
    }
    const adminId = user.userId; // Récupération de l'ID de l'admin

    const headers = this.getAuthHeaders(); // Récupération des headers d'authentification

    this.isLoading = true;

    this.complaintService.respondToComplaint(
      this.complaint.complaintId,
      adminId,
      responseText,
      headers
    ).subscribe({
      next: () => {
        alert('Response Sent successfully.');
        this.router.navigate(['/back-office/complaints']);
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur lors de l'envoi de la réponse :", error);
        this.isLoading = false;
        alert("Erreur lors de l'envoi de la réponse.");
      }
    });
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