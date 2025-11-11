import { Component, OnInit } from '@angular/core';
import { CarpoolService } from 'src/app/Core/carpool.service';
import { HttpHeaders } from '@angular/common/http';


@Component({
    selector: 'app-carpooling-list-front-office',
    templateUrl: './carpooling-list.component.html',
    styleUrls: ['./carpooling-list.component.css'],
    standalone: false
})
export class CarpoolingListFrontOfficeComponent implements OnInit {
  futureCarpools: any[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;
  recommendedCarpools: any[] = [];
  hasRecommendations = false;
  

  constructor(private carpoolService: CarpoolService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    console.log("Token récupéré:", token); // Vérifie si un token est récupéré
    this.loadFutureCarpools();
    this.loadRecommendedCarpools();

  }
  
  

  loadFutureCarpools(): void {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (!token || !storedUser) {
      console.error("❌ Auth ou utilisateur non trouvé");
      this.errorMessage = "Authentification requise.";
      this.isLoading = false;
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const user = JSON.parse(storedUser);
    const userId = user.userId;
  
    this.carpoolService.getFutureCarpools(userId, headers).subscribe({
      next: (data) => {
        this.futureCarpools = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Erreur lors du chargement des covoiturages :", error);
        this.errorMessage = "Une erreur est survenue lors du chargement des covoiturages.";
        this.isLoading = false;
      }
    });
  }
  
  
  filters = {
    departure: '',
    destination: '',
    date: '',
    time: ''
  };
  
  get filteredCarpools() {
    return this.futureCarpools.filter(carpool => {
      return (
        (!this.filters.departure || carpool.carpoolDeparture.toLowerCase().includes(this.filters.departure.toLowerCase())) &&
        (!this.filters.destination || carpool.carpoolDestination.toLowerCase().includes(this.filters.destination.toLowerCase())) &&
        (!this.filters.date || carpool.carpoolDate === this.filters.date) &&
        (!this.filters.time || carpool.carpoolTime === this.filters.time)
      );
    });
  }
  



  loadRecommendedCarpools(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      console.error("❌ Aucun utilisateur connecté trouvé.");
      return;
    }
  
    const user = JSON.parse(storedUser);
    const userId = user.userId;
  
    const token = localStorage.getItem('token');
    if (!token) {
      console.error("❌ Aucun token trouvé.");
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.carpoolService.getRecommendedCarpools(userId, headers).subscribe({
      next: (data) => {
        this.recommendedCarpools = data;
        this.hasRecommendations = data.length > 0;
      },
      error: (err) => {
        console.error("❌ Erreur chargement des recommandations", err);
        this.hasRecommendations = false;
      }
    });
  }
  showRecommendations: boolean = false;

  
}