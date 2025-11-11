import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { TripService } from 'src/app/Core/trip.service';
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-vehicle-travel-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './vehicle-travel-history.component.html',
  styleUrls: ['./vehicle-travel-history.component.scss']
})
export class VehicleTravelHistoryComponent implements OnInit {
  trips: any[] = [];
  filteredTrips: any[] = [];
  searchTerm: string = '';
  isLoading: boolean = true;
  errorMessage: string | null = null;
  vehicleId!: number;

  constructor(
    private tripService: TripService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.vehicleId = +this.route.snapshot.paramMap.get('id')!;
    this.loadTrips();
  }

  loadTrips(): void {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
    this.tripService.getTripsByVehicle(this.vehicleId, headers).subscribe({
      next: (data) => {
        this.trips = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading trips:', err);
        this.errorMessage = 'Failed to load trips. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.filteredTrips = this.trips.filter(trip =>
      trip.tripDeparture.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      trip.tripDestination.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  deleteTrip(tripId: number): void {
    if (confirm('Are you sure you want to delete this trip?')) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('authToken')}`);
      this.tripService.deleteTrip(tripId, headers).subscribe({
        next: () => {
          this.trips = this.trips.filter(trip => trip.tripId !== tripId);
          this.applyFilters();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete trip. Please try again.');
        }
      });
    }
  }
}
