import { Component, OnInit } from '@angular/core';
import { CarpoolService } from 'src/app/Core/carpool.service';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-carpooling-list',
  templateUrl: './carpooling-listBackOffice.component.html',
  styleUrls: ['./carpooling-listBackOffice.component.css'],
  standalone: false
})
export class CarpoolingListBackOfficeComponent implements OnInit {
  allCarpools: any[] = []; // Tous les covoiturages
  filteredCarpools: any[] = []; // Covoiturages filtrés
  isLoading: boolean = true;
  errorMessage: string = '';
  filterType: string = 'all'; // Filtre par défaut : tous les covoiturages

  constructor(private carpoolService: CarpoolService,private router: Router) {}

  ngOnInit(): void {
    this.loadAllCarpools();
  }

  // Charger tous les covoiturages
  loadAllCarpools(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.carpoolService.getAllCarpools().subscribe({
      next: (data) => {
        this.allCarpools = data;
        this.filteredCarpools = data;
        this.isLoading = false;
  
        // Charger les informations de l'offreur pour chaque covoiturage
        this.allCarpools.forEach((carpool) => {
          if (carpool?.carpoolId) { // Vérifiez si carpoolId existe
            this.loadOffererDetails(carpool.carpoolId, headers);
          } else {
            console.warn("Covoiturage sans carpoolId détecté :", carpool);
          }
        });
      },
      error: (error) => {
        console.error("Erreur lors du chargement des covoiturages :", error);
        this.errorMessage = "Une erreur est survenue lors du chargement des covoiturages.";
        this.isLoading = false;
      }
    });
  }
  
  
  
  // Charger les informations de l'offreur
  loadOffererDetails(carpoolId: number, headers: HttpHeaders): void {
    console.log("🔍 Tentative de récupération de l'offreur pour le covoiturage ID :", carpoolId);
    if (!carpoolId) {
      console.warn("❌ carpoolId non valide :", carpoolId);
      return;
    }
  
    this.carpoolService.getCarpoolOfferer(carpoolId, headers).subscribe({
      next: (offerer) => {
        console.log(`🔍 Offreur récupéré pour le covoiturage ${carpoolId}:`, offerer);
        const carpool = this.allCarpools.find((c) => c.carpoolId === carpoolId); // Utilisez carpoolId ici
        if (carpool) {
          carpool.simpleUserOffer = offerer;
        }
      },
      error: (error) => {
        console.error("❌ Erreur lors du chargement de l'offreur :", error);
      }
    });
  }
  
  
  // Appliquer le filtre
  applyFilter(filterType: string): void {
    this.filterType = filterType;
    const now = new Date();

    switch (filterType) {
      case 'future':
        this.filteredCarpools = this.allCarpools.filter((carpool) => {
          const carpoolDate = new Date(carpool.carpoolDate);
          return carpoolDate > now; // Garder uniquement les covoiturages futurs
        });
        break;
      case 'past':
        this.filteredCarpools = this.allCarpools.filter((carpool) => {
          const carpoolDate = new Date(carpool.carpoolDate);
          return carpoolDate <= now; // Garder uniquement les covoiturages passés
        });
        break;
      default:
        this.filteredCarpools = this.allCarpools; // Afficher tous les covoiturages
        break;
    }
  }
  viewCarpoolDetails(carpoolId: number): void {
    this.router.navigate(['/back-office/carpool/', carpoolId]);
  }

  
}
