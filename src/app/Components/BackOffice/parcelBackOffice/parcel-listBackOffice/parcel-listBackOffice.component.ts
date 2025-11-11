import { Component } from '@angular/core';
import { ParcelService } from 'src/app/Core/parcel.service';
import { DriverService } from 'src/app/Core/driver.service';  // Assurez-vous d'importer le service des conducteurs
import { HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-parcel-list',
    templateUrl: './parcel-listBackOffice.component.html',
    styleUrls: ['./parcel-listBackOffice.component.css'],
    standalone: false
})
export class ParcelListBackOfficeComponent {
  parcels: any[] = [];
  drivers: any[] = [];
  selectedDrivers: { [key: number]: number } = {}; // Stocke le driver sélectionné par colis
  afterDate: string = ''; // Date après laquelle les colis seront filtrés
  beforeDate: string = ''; // Date avant laquelle les colis seront filtrés
  categorySearch: string = ''; // Texte de recherche par catégorie
  statusFilter: string = '';  // Pour stocker le statut sélectionné

  constructor(private parcelService: ParcelService, private driverService: DriverService) {}

  ngOnInit(): void {
      this.loadParcels();
      this.loadDrivers();
  }

  // Charger la liste des colis
  loadParcels() {
      this.parcelService.getParcels().subscribe(
          (data) => { this.parcels = data; },
          (error) => { console.error('Erreur lors de la récupération des colis', error); }
      );
  }

  // Charger la liste des chauffeurs
  loadDrivers() {
      this.driverService.getAllDrivers().subscribe(
          (data) => { this.drivers = data; },
          (error) => { console.error('Erreur lors de la récupération des conducteurs', error); }
      );
  }
// Méthode de filtrage par date
// Filtrer les colis selon les dates
filterParcels() {
    if (this.afterDate && this.beforeDate) {
      // Si les deux dates sont définies, appliquer les deux filtres
      this.parcelService.getParcelsAfterDate(this.afterDate).subscribe(
        (afterData) => {
          this.parcelService.getParcelsBeforeDate(this.beforeDate).subscribe(
            (beforeData) => {
              this.parcels = afterData.filter(parcel =>
                beforeData.some(beforeParcel => beforeParcel.parcelId === parcel.parcelId)
              );
            },
            (error) => { console.error('Erreur lors du filtrage avant la date', error); }
          );
        },
        (error) => { console.error('Erreur lors du filtrage après la date', error); }
      );
    } else if (this.afterDate) {
      // Filtrer uniquement après une date
      this.parcelService.getParcelsAfterDate(this.afterDate).subscribe(
        (data) => { this.parcels = data; },
        (error) => { console.error('Erreur lors du filtrage des colis après date', error); }
      );
    } else if (this.beforeDate) {
      // Filtrer uniquement avant une date
      this.parcelService.getParcelsBeforeDate(this.beforeDate).subscribe(
        (data) => { this.parcels = data; },
        (error) => { console.error('Erreur lors du filtrage des colis avant date', error); }
      );
    } else {
      // Si aucune date n'est sélectionnée, recharge tous les colis
      this.loadParcels();
    }
  }
  
  // Assigner un chauffeur à un colis
  assignParcel(parcelId: number) {
      const driverId = this.selectedDrivers[parcelId];
      if (driverId) {
          this.parcelService.assignParcelToDriver(parcelId, driverId).subscribe(
              response => {
                  alert('Parcel assigned successfully!');
                  this.loadParcels();  // Rafraîchir la liste
              },
              error => {
                  alert('Failed to assign parcel');
                  console.error(error);
              }
          );
      } else {
          alert('Please select a driver!');
      }
  }
  deleteParcel(parcelId: number) {
    if (confirm('Are you sure you want to delete this parcel?')) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      });
      this.parcelService.deleteParcel(parcelId, headers).subscribe(
        () => {
          alert('Parcel deleted successfully!');
          this.loadParcels();
        },
        error => {
          alert('Failed to delete parcel');
          console.error(error);
        }
      );
    }
  }
 // Méthode de filtrage par statut
filterByStatus(): void {
  if (this.statusFilter) {
    // Si un statut est sélectionné, appeler l'API avec ce statut
    this.parcelService.getParcelsByStatus(this.statusFilter).subscribe(
      (data) => {
        this.parcels = data;  // Mettre à jour la liste des colis avec les résultats filtrés
      },
      (error) => {
        console.error('Erreur lors du filtrage des colis par statut', error);
      }
    );
  } else {
    // Si aucun statut n'est sélectionné, charger tous les colis
    this.loadParcels();
  }
}

  

}
