import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { TripService } from 'src/app/Core/trip.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-listBackOffice.component.html',
  styleUrls: ['./trip-listBackOffice.component.css'],
  standalone: false
})
export class TripListBackOfficeComponent implements OnInit {
  trips: any[] = []; // Liste complète des voyages
  filteredTrips: any[] = []; // Liste filtrée des voyages
  searchTerm: string = ''; // Terme de recherche
  selectedStatus: string = 'all'; // Statut sélectionné pour le filtrage
  isLoading: boolean = true; // État de chargement
  errorMessage: string | null = null; // Message d'erreur

  // Définir les statuts des voyages (adaptez-les à votre backend)
  tripStatuses = [
    { value: 'all', label: 'All Trips' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(
    private tripService: TripService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  // Charger les voyages depuis le backend
  loadTrips(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.tripService.getAllTrips(headers).subscribe({
      next: (data) => {
        this.trips = data;
        this.filteredTrips = data; // Initialiser la liste filtrée
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trips:', err);
        this.errorMessage = 'Failed to load trips. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  // Appliquer les filtres (recherche et statut)
  applyFilters(): void {
    this.filteredTrips = this.trips.filter(trip => {
      const matchesSearch = trip.tripDeparture.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                            trip.tripDestination.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus === 'all' || trip.reservationStatus === this.selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }

  // Supprimer un voyage
  deleteTrip(tripId: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
      this.tripService.deleteTrip(tripId, headers).subscribe({
        next: () => {
          this.trips = this.trips.filter(trip => trip.tripId !== tripId); // Mettre à jour la liste
          this.applyFilters(); // Re-appliquer les filtres
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete trip. Please try again.');
        }
      });
    }
  }
}
