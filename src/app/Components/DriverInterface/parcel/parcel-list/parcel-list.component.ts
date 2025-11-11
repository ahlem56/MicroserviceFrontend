import { HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ParcelService } from 'src/app/Core/parcel.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from 'src/app/Core/user.service';

@Component({
    selector: 'app-parcel-list',
    templateUrl: './parcel-list.component.html',
    styleUrls: ['./parcel-list.component.css'],
    standalone: false
})
export class ParcelListDriverInterfaceComponent {
  parcels: any[] = [];  // Tableau pour stocker les colis du conducteur
  searchDeparture: string = '';
  searchDestination: string = '';
  filteredParcels: any[] = []; // Liste filtrée
  selectedStatus: string = 'ALL'; // Statut sélectionné pour le filtre (ALL, SHIPPED, DELIVERED)

  constructor(
    private parcelService: ParcelService,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.userService.refreshUserProfile().subscribe({
      next: () => this.loadParcels(),
      error: () => this.loadParcels()
    });
  }

  loadParcels(): void {
    // Récupérer l'objet utilisateur depuis le localStorage
    const userStr = localStorage.getItem('user');

    if (!userStr) {
      alert('Utilisateur non trouvé dans le localStorage. Veuillez vous connecter à nouveau !');
      return;
    }

    const user = JSON.parse(userStr);  // Analyser l'objet utilisateur depuis la chaîne
    const rawDriverId = user.driverId ?? user.userId ?? user.id; // Extraire l'ID du conducteur
    const driverId = rawDriverId !== undefined ? Number(rawDriverId) : NaN;

    console.log('ID du conducteur:', driverId);  // Afficher l'ID pour vérifier sa validité

    if (!driverId || Number.isNaN(driverId)) {  // Vérifier si l'ID est valide
      alert('ID du conducteur invalide !');
      return;
    }

    // Préparer les headers pour la requête
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`, // Utiliser le token d'authentification
    });

    // Appeler le service pour récupérer les colis du conducteur
    this.parcelService.getParcelForDriver(driverId, headers).subscribe(
      (response) => {
        this.parcels = response;  // Assignation des colis reçus dans le tableau
        this.filteredParcels = this.parcels; // Par défaut, on affiche tous les colis

      },
      (error) => {
        console.error('Erreur lors de la récupération des colis:', error);
        alert('Échec du chargement des colis!');
      }
    );
  }
 // Méthode pour marquer un colis comme expédié
 markAsShipped(parcelId: number): void {
  this.parcelService.markParcelAsShipped(parcelId).subscribe({
    next: (response) => {
      console.log("Parcel marked as SHIPPED:", response);
      // Mettre à jour localement le statut du colis après la mise à jour
      this.parcels = this.parcels.map(parcel =>
        parcel.parcelId === parcelId ? { ...parcel, status: 'SHIPPED' } : parcel
      );
    },
    error: (error) => {
      console.error("Error updating status:", error);
      alert("Une erreur est survenue lors de la mise à jour du statut.");
    }
  });
}
// Méthode pour marquer un colis comme expédié
markParcelAsDelivered(parcelId: number): void {
  this.parcelService.markParcelAsDelivered(parcelId).subscribe({
    next: (response) => {
      console.log("Parcel marked as DELIVERED:", response);
      // Mettre à jour localement le statut du colis après la mise à jour
      this.parcels = this.parcels.map(parcel =>
        parcel.parcelId === parcelId ? { ...parcel, status: 'DELIVERED' } : parcel
      );
    },
    error: (error) => {
      console.error("Error updating status:", error);
      alert("Une erreur est survenue lors de la mise à jour du statut.");
    }
  });
}
   // Méthode de filtrage
   filterParcels(): void {
    const depFilter = this.searchDeparture.toLowerCase();
    const destFilter = this.searchDestination.toLowerCase();

    this.filteredParcels = this.parcels.filter(parcel =>
      (!depFilter || parcel.parcelDeparture.toLowerCase().includes(depFilter)) &&
      (!destFilter || parcel.parcelDestination.toLowerCase().includes(destFilter)) &&
      (this.selectedStatus === 'ALL' || parcel.status === this.selectedStatus) // Filtrage par statut
    );
  }

  // Réinitialiser les filtres
  resetFilters(): void {
    this.searchDeparture = '';
    this.searchDestination = '';
    this.selectedStatus = 'ALL'; // Réinitialise le statut à "ALL"
    this.filteredParcels = this.parcels; // Réinitialise à la liste complète
  }

  // Méthode pour changer le statut du filtre
  changeStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.filterParcels(); // Appliquer le filtre après changement de statut
  }

}
