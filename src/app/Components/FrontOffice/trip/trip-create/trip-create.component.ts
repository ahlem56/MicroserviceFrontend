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
  imports: [FormsModule, CommonModule, GoogleMapsModule,RouterModule],
  standalone: true
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
    private ngZone: NgZone
  ) {}

  ngOnInit() {

    this.driverService.getAvailableDrivers().subscribe(
      (drivers) => {
        this.availableDrivers = drivers;
      },
      (error) => {
        this.errorMessage = 'Error fetching drivers. Please try again later.';
        console.error(error);
      }
    );

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
    this.loadDriversWithRatings(); // 👈 add this line to load drivers smartly

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
    const currentDate = new Date();
    const selectedDate = new Date(this.trip.tripDate);

    if (!this.trip.tripDeparture || !this.trip.tripDestination) {
      this.errorMessage = 'Departure and destination locations are required.';
      return;
    }

    if (!this.trip.tripType) {
      this.errorMessage = 'Trip type is required.';
      return;
    }

    if (!this.trip.tripDate || selectedDate <= currentDate) {
      this.errorMessage = 'Date of departure must be in the future.';
      return;
    }

    if (this.trip.numberOfPassengers < 1 || this.trip.numberOfPassengers > 4) {
      this.errorMessage = 'Number of people must be between 1 and 4.';
      return;
    }

    if (!this.selectedDriverId) {
      this.errorMessage = 'Please select a driver.';
      return;
    }

    if (!this.simpleUserId) {
      this.errorMessage = 'User ID is not available.';
      return;
    }


    if (!this.selectedDriverId) {
      this.errorMessage = 'Please select a driver.';
      return;
    }
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Create clean payload without driverId
  const tripPayload = {
    tripDeparture: this.trip.tripDeparture,
    tripDestination: this.trip.tripDestination,
    tripDate: this.trip.tripDate,
    tripDuration: this.trip.tripDuration,
    tripPrice: this.trip.tripPrice,
    tripType: this.trip.tripType,
    numberOfPassengers: this.trip.numberOfPassengers,
    reservationStatus: 'PENDING',
    latitude: this.trip.latitude,
    longitude: this.trip.longitude
  }; 
  console.log('Trip Payload being sent:', tripPayload);// trip-create.component.ts
this.tripService.createTrip(tripPayload, this.simpleUserId!, this.selectedDriverId, headers).subscribe(
  (createdTrip) => {
    console.log('Trip Created', createdTrip);
    this.successMessage = 'Your trip has been created successfully!';
    this.resetForm();
    const tripId = createdTrip.tripId; // Extract the dynamic tripId
    this.router.navigate(['/stripe'], { queryParams: { tripId: tripId } });   },
  (error) => {
    this.errorMessage = 'Failed to create trip. Please try again later.';
    console.error(error);
  }
);
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

  getRouteData(origin: string, destination: string, waypoints: string[] = []): void {
    if (!this.map) {
      console.error("Map is not initialized.");
      return;
    }
  
    const params: any = {
      origin,
      destination,
      departure_time: 'now',  // Ensures that traffic is included in the response
    };
  
    if (waypoints.length > 0) {
      params.waypoints = waypoints.join('|');
      params.optimize_waypoints = 'true';
    }
  
    // Make HTTP request to fetch directions
    this.http.get('http://localhost:8089/examen/maps/directions', { params }).subscribe(
      (response: any) => {
        if (response.routes && response.routes.length > 0) {
          const route = response.routes[0].legs[0];
          
          // Duration with traffic (in seconds)
          const durationInSeconds = route.duration_in_traffic ? route.duration_in_traffic.value : route.duration.value;
          
          this.trip.tripDuration = route.duration.text;  // Display duration as text
          this.trip.tripPrice = this.calculateDynamicPrice(durationInSeconds);  // Calculate the price
  
          // Polyline data for displaying the route
          const encodedPolyline = response.routes[0].overview_polyline.points;
          console.log('Encoded Polyline:', encodedPolyline);
          this.drawRoutePolyline(encodedPolyline);
        } else {
          console.error('No route found!');
          this.errorMessage = 'No route found!';
        }
      },
      (error) => {
        console.error('Error fetching route:', error);
        this.errorMessage = 'Error fetching route data. Please try again.';
      }
    );
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

calculateDynamicPrice(durationInSeconds: number): number {
  const basePrice = 3; // Base price for the trip
  const pricePerMinute = 0.2; // Additional price per minute of travel
  const durationInMinutes = durationInSeconds / 60; // Convert seconds to minutes

  // Basic price formula (adjust according to your business logic)
  return basePrice + (durationInMinutes * pricePerMinute);
}


loadDriversWithRatings() {
  this.driverService.getAvailableDrivers().subscribe(
    (drivers) => {
      // Rating service removed - set default rating to 0
      const driversWithRatings = drivers.map((driver) => {
        (driver as any).averageRating = 0;
        return driver;
      });

      Promise.resolve(driversWithRatings).then((driversWithRatings) => {
        // Sort drivers by average rating, highest first
        this.availableDrivers = driversWithRatings.sort((a: any, b: any) => b.averageRating - a.averageRating);
        console.log('Sorted Drivers:', this.availableDrivers);
      });
    },
    (error) => {
      this.errorMessage = 'Error fetching drivers. Please try again later.';
      console.error(error);
    }
  );
}

}
