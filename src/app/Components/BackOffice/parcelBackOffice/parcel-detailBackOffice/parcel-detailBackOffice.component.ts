import { Component } from '@angular/core';
import { ParcelService } from 'src/app/Core/parcel.service';  // Assurez-vous que le service est bien importé
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
    selector: 'app-parcel-detail-back-office',
    templateUrl: './parcel-detailBackOffice.component.html',
    styleUrls: ['./parcel-detailBackOffice.component.css'],
    standalone: false
})
export class ParcelDetailBackOfficeComponent {
 
    damagedParcels: any[] = [];  // Tableau pour stocker les colis endommagés
    damagedPercentage: number = 0; // Pourcentage de colis endommagés
    undamagedPercentage: number = 100; // Pourcentage de colis non endommagés

    constructor(private parcelService: ParcelService) { }
  
    ngOnInit(): void {
      this.loadDamagedParcels();
      this.loadDamagedParcelStats  ;
    }
  
    // Méthode pour récupérer les colis endommagés
    loadDamagedParcels(): void {
      this.parcelService.getDamagedParcels().subscribe(
        (data) => {
          this.damagedParcels = data;  // Stocker les colis endommagés récupérés
        },
        (error) => {
          console.error('Erreur lors de la récupération des colis endommagés', error);
        }
      );
    }
    // Méthode pour récupérer les statistiques des colis endommagés
 // Méthode pour récupérer les statistiques des colis endommagés
 loadDamagedParcelStats(): void {
  this.parcelService.getDamagedParcelPercentage().subscribe({
    next: (percentage: number) => {
      this.damagedPercentage = percentage;
      this.undamagedPercentage = 100 - percentage;  // Le reste des colis
    },
    error: err => console.error('Erreur lors du chargement des statistiques :', err)
  });
}
 // Méthode pour calculer le fond du graphique circulaire (conic-gradient)
 getCircleBackground(damagedPercentage: number): string {
  return `conic-gradient(#e74c3c ${damagedPercentage}%,rgb(25, 41, 92) ${damagedPercentage}% 100%)`;
}

}
