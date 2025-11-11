import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { TripService } from 'src/app/Core/trip.service';
import { DriverService, Driver } from 'src/app/Core/driver.service';
import { UserService } from 'src/app/Core/user.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-trip-create',
  templateUrl: './trip-create.component.html',
  styleUrls: ['./trip-create.component.css'],
  imports: [FormsModule, CommonModule, GoogleMapsModule,RouterModule]
})
export class TripCreateFrontOfficeComponent implements OnInit, AfterViewInit {
  @ViewChild(GoogleMap) googleMap!: GoogleMap;

  availableDrivers: Driver[] = [];
  trip: any = {
    tripDeparture: '',
    tripDestination: '',
    tripDate: '',
    tripDuration: null,
    tripPrice: null,
    tripType: '',
    numberOfPassengers: 1,  // <-- Match backend field name
    reservationStatus: 'PENDING',
    latitude: null,  // Store latitude
    longitude: null, // Store longitude
  };
  selectedDriverId: number | null = null;

  simpleUserId: number | null = null;
  errorMessage: string = '';
  successMessage: string = '';
  mapCenter: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 };
  mapZoom = 8;
  markerPosition: google.maps.LatLngLiteral = { lat: 36.8065, lng: 10.1815 };
  minDate = new Date().toISOString().split('T')[0];
  map: google.maps.Map | undefined;

  constructor(
    private driverService: DriverService,
    private tripService: TripService,
    private userService: UserService,
    private router: Router,
    private http: HttpClient, 
    private ngZone: NgZone ,
  ) {}

 ngOnInit() {
  this.driverService.getAvailableDrivers().subscribe({
    next: (drivers) => {
      console.log('✅ Available drivers from API:', drivers);
      this.availableDrivers = drivers;
    },
    error: (error) => {
      this.errorMessage = 'Error fetching drivers. Please try again later.';
      console.error('❌ Driver loading error:', error);
    }
  });

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  this.simpleUserId = currentUser.userId;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.mapCenter = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.markerPosition = this.mapCenter;
        this.getAddressFromLatLng(this.mapCenter, 'departure');
      },
      (error) => {
        console.error("Geolocation error:", error);
        this.errorMessage = "Could not detect your location.";
      }
    );
  }
}


  ngAfterViewInit() {
    if (this.googleMap) {
      // The map is already initialized by the Angular component
      this.map = this.googleMap.googleMap; // Access the underlying Google Maps object
      
      // Add click listener
      this.googleMap.mapClick.subscribe((event: google.maps.MapMouseEvent) => {
        this.onMapClick(event);
      });
  
      // Only set center if map is available
      if (this.map && this.mapCenter) {
        this.map.setCenter(this.mapCenter);
      }
    }
    
    this.initAutocomplete();
  }
  
 

  initAutocomplete() {
    const destinationInput = document.getElementById('destinationInput') as HTMLInputElement;
    if (destinationInput) {
      const autocomplete = new google.maps.places.Autocomplete(destinationInput, {
        types: ['geocode'],
        componentRestrictions: { country: "tn" }
      });
  
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            this.trip.tripDestination = place.formatted_address;
            console.log('Destination selected:', this.trip.tripDestination);
  
            // Ensure departure is set before making the request
            if (this.trip.tripDeparture) {
              // Fetch the route immediately when both departure and destination are set
              this.getRouteData(this.trip.tripDeparture, this.trip.tripDestination);
            } else {
              this.errorMessage = 'Departure location must be set first.';
            }
          }
        });
      });
    }
  }
  
  
  
  

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng) {
      this.markerPosition = event.latLng.toJSON();
      this.getAddressFromLatLng(this.markerPosition, 'destination');
      this.trip.latitude = this.markerPosition.lat.toString(); // Save latitude
      this.trip.longitude = this.markerPosition.lng.toString(); // Save longitude
    }
  }

  getAddressFromLatLng(latLng: google.maps.LatLngLiteral, type: 'departure' | 'destination') {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: latLng }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        if (type === 'departure') {
          this.trip.tripDeparture = results[0].formatted_address;
          console.log("Departure set:", this.trip.tripDeparture);
  
          // After setting departure, check if destination is available to fetch the route
          if (this.trip.tripDestination) {
            this.getRouteData(this.trip.tripDeparture, this.trip.tripDestination);
          }
        } else {
          this.trip.tripDestination = results[0].formatted_address;
          console.log("Destination set:", this.trip.tripDestination);
  
          // After setting destination, fetch the route if departure is already set
          if (this.trip.tripDeparture) {
            this.getRouteData(this.trip.tripDeparture, this.trip.tripDestination);
          }
        }
      } else {
        this.errorMessage = 'Could not retrieve address. Please try again.';
      }
    });
  }
  

 createTrip() {
  this.errorMessage = '';

  // Basic validation
  if (!this.trip.tripDeparture || !this.trip.tripDestination) {
    this.errorMessage = 'Departure and destination are required.';
    return;
  }

  if (!this.trip.tripDate) {
    this.errorMessage = 'Please select a departure date.';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    this.errorMessage = 'You must be logged in to create a trip.';
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  this.trip.userId = currentUser.id;
  this.trip.driverId = this.selectedDriverId;

  const payload = {
    ...this.trip,
    reservationStatus: 'PENDING',
    numberOfPassengers: this.trip.numberOfPassengers || 1,
    latitude: Number(this.trip.latitude) || 36.8,
    longitude: Number(this.trip.longitude) || 10.1
  };

  console.log('🚀 Sending trip payload:', payload);

  // Ensure you're sending the correct token
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  // Log the headers to check if Authorization is sent
  console.log('Authorization Header:', headers);

  this.tripService.createTrip(payload, token).subscribe({
    next: (response) => {
      console.log('✅ Trip created:', response);
      this.successMessage = 'Your trip has been created successfully!';
      this.resetForm();
    },
    error: (err) => {
      console.error('❌ Trip creation failed:', err);
      this.errorMessage = 'Failed to create trip. Please try again.';
    }
  });
}



resetForm() {
  this.trip = {
    tripDeparture: '',
    tripDestination: '',
    tripDate: '',
    tripDuration: null,
    tripPrice: null,
    tripType: '',
    numberOfPassengers: 1,
    latitude: null,
    longitude: null
  };
  this.selectedDriverId = null;
}

getRouteData(origin: string, destination: string): void {
  if (!this.map) {
    console.error("Map is not initialized.");
    return;
  }

  const params = { origin, destination };

  this.http.get<any>('http://localhost:8090/trip/maps/directions', { params })
    .subscribe({
      next: (response) => {
        console.log('📦 Directions response:', response);

        if (response.duration) {
          this.trip.tripDuration = response.duration;
        }

        if (response.distance) {
          // Extract numeric value from "6.7 km"
          const distanceKm = parseFloat(response.distance.replace(' km', '').trim());
          this.trip.tripPrice = this.calculateDynamicPrice(distanceKm);
        }

        if (response.polyline) {
          this.drawRoutePolyline(response.polyline);
        } else {
          console.error('No polyline in response!');
          this.errorMessage = 'No route found!';
        }
      },
      error: (error) => {
        console.error('❌ Error fetching route:', error);
        this.errorMessage = 'Error fetching route data. Please try again.';
      }
    });
}


  


private currentPolyline: google.maps.Polyline | null = null;

drawRoutePolyline(encodedPolyline: string) {
  if (!this.map) {
    console.error("Map is not initialized.");
    return;  // Ensure the map is loaded
  }

  if (this.currentPolyline) {
    // Remove the old polyline from the map
    this.currentPolyline.setMap(null);
    this.currentPolyline = null; // Clear the reference
  }

  if (!encodedPolyline) {
    console.error("Polyline data is empty.");
    return;  // Ensure the encoded polyline is available
  }

  // Decode the polyline into path coordinates
  const path = google.maps.geometry.encoding.decodePath(encodedPolyline);

  console.log('Decoded Path:', path); // Log the decoded path for debugging

  if (path.length > 0) {
    // Create a new Polyline using the decoded path
    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    // Set the polyline on the map
    polyline.setMap(this.map);

    // Store the new polyline so it can be removed later
    this.currentPolyline = polyline;

    console.log("Polyline drawn on the map.");
  } else {
    console.error('No valid path to display!');
    this.errorMessage = 'Failed to display the route. Please try again.';
  }
}

calculateDynamicPrice(distanceKm: number): number {
  const basePrice = 3; // Base fare (TND)
  const perKmRate =
    this.trip.tripType === 'EXPRESS_TRIP' ? 0.35 : 0.25; // Cheaper for long-distance

  const total = basePrice + (distanceKm * perKmRate);

  // Round to 2 decimals
  return Math.round(total * 100) / 100;
}



loadDrivers() {
  this.driverService.getAvailableDrivers().subscribe(
    (drivers) => {
      this.availableDrivers = drivers;
      console.log('✅ Loaded Drivers:', this.availableDrivers);
    },
    (error) => {
      this.errorMessage = 'Error fetching drivers. Please try again later.';
      console.error('❌ Error fetching drivers:', error);
    }
  );
}


}
