import { Component, OnInit } from '@angular/core';
import { TripService } from 'src/app/Core/trip.service';  // Import TripService
import { Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehicleService } from 'src/app/Core/vehicle.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.css'],
  imports: [DatePipe, CurrencyPipe, CommonModule, FormsModule]
})
export class TripListDriverInterfaceComponent implements OnInit {
  trips: any[] = [];  // Liste complète des voyages
  filteredTrips: any[] = [];  // Liste filtrée des voyages
  searchTerm: string = '';  // Terme de recherche
  selectedStatus: string = 'all';  // Statut sélectionné pour le filtrage
  isLoading: boolean = true;  // État de chargement
  errorMessage: string | null = null;  // Message d'erreur

  private checkpointData: {
    position: google.maps.LatLng;
    marker: google.maps.Marker;
    arrived: boolean;
  }[] = [];

  readonly checkpointCount = 9;
  readonly proximityThresholdMeters = 50;
  vehicleId!: number;
private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private subs = new Subscription();

  // Définir les statuts des voyages (adaptez-les à votre backend)
  tripStatuses = [
    { value: 'all', label: 'All Trips' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'CONFIRMED', label: 'Confirmed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  constructor(private tripService: TripService, private router: Router, private vehicleService : VehicleService) {}

  ngOnInit(): void {
    this.loadTrips();
  }

  // Charger les voyages depuis le backend
  loadTrips(): void {
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    this.errorMessage = 'User not found in localStorage. Please log in again!';
    this.isLoading = false;
    return;
  }

  const user = JSON.parse(userStr);
  const driverId = user.userId || user.id;  // ✅ support both keys

  if (!driverId || isNaN(driverId)) {
    this.errorMessage = 'Invalid driver ID!';
    this.isLoading = false;
    return;
  }

  console.log('Driver ID for trip fetch:', driverId);

  const token = localStorage.getItem('token');
  if (!token) {
    this.errorMessage = 'Missing token — please log in again!';
    this.isLoading = false;
    return;
  }

  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  this.tripService.getTripsForDriver(driverId, headers).subscribe({
    next: (response) => {
      console.log('✅ Trips received from backend:', response);
      this.trips = response || [];
      this.filteredTrips = this.trips;
      this.isLoading = false;
    },
    error: (error) => {
      console.error('❌ Error fetching trips:', error);
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
  
    // Sort trips by date in descending order (newest first)
    this.filteredTrips.sort((a, b) => new Date(b.tripDate).getTime() - new Date(a.tripDate).getTime());
  }
  

  // Accepter un voyage
  acceptTrip(trip: any): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  
    this.tripService.acceptTrip(trip.tripId, headers).subscribe({
      next: () => {
        trip.reservationStatus = 'CONFIRMED';  // Mettre à jour le statut du voyage
      },
      error: (error) => {
        console.error('Error accepting trip:', error);
        alert('Failed to accept trip. Please try again.');
      }
    });
  }
  
  // Refuser un voyage
  refuseTrip(trip: any): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  
    this.tripService.refuseTrip(trip.tripId, headers).subscribe({
      next: () => {
        this.trips = this.trips.filter(t => t.tripId !== trip.tripId);  // Supprimer le voyage de la liste
        this.applyFilters();  // Re-appliquer les filtres
      },
      error: (error) => {
        console.error('Error refusing trip:', error);
        alert('Failed to refuse trip. Please try again.');
      }
    });
  }

  completeTrip(trip: any): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  
    this.tripService.completeTrip(trip.tripId, headers).subscribe({
      next: () => {
        trip.reservationStatus = 'COMPLETED';  // Update the trip status to "COMPLETED"
        alert("Trip completed! The passenger will be notified to rate the driver.");
      },
      error: (error) => {
        console.error('Error completing trip:', error);
        alert('Failed to complete the trip. Please try again.');
      }
    });
  }
  reachNextCheckpoint(trip: any): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
  
    this.tripService.reachNextCheckpoint(trip.driver.vehicle.vehiculeId  , headers).subscribe({
      next: () => {
        alert('Next checkpoint reached ' );
      },
      error: (error) => {
        console.error('Error reaching next checkpoint:', error);
        alert('Failed to reach next checkpoint. Please try again.');
      }
    });
  }
  
  
}