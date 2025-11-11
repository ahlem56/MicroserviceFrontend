import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParcelService } from 'src/app/Core/parcel.service';
import { TripService } from 'src/app/Core/trip.service';
import { UserService } from 'src/app/Core/user.service';
import { CarpoolService } from 'src/app/Core/carpool.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { DriverService } from 'src/app/Core/driver.service';
import { LocalizedString } from '@angular/compiler';

import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  imports: [DatePipe, CommonModule,FormsModule]
})
export class ProfileComponent implements OnInit {
  // User Data
  user: any = {};
  userRole: string | null = null;
  
  // Profile Image
  defaultProfilePhoto = 'assets/FrontOffice/images/users/user4.jpg';
  profileImageUrl = '';

  // Trip Data
  trips: any[] = [];
  isTripsVisible = false;
  
  // Parcel Data
  parcels: any[] = [];
  isParcelsVisible = false;
  parcelsDelivered: any[] = [];

   // Variables pour gérer le modal de signalement de colis endommagé
 isDamageModalOpen = false;
 damageFile: File | null = null;
 selectedParcel: any = null;
 damageDescription: string = ''; // Description for the damage report 
  // Carpool Data
  carpoolOffers: any[] = [];
  isCarpoolVisible = false;
  carpoolRatings: { [carpoolId: number]: any[] } = {}; // Notations des covoiturages

  isAvailable: boolean = false; // Default to not available
Object: any;



  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private tripService: TripService,
    private parcelService: ParcelService,
    private carpoolService: CarpoolService,
    private driverService: DriverService, // Assuming you have a driver service

  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadProfileData();
    this.checkAvailability(); // Check availability when the component is initialized
  
  }

  private loadUserData(): void {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      this.userRole = localStorage.getItem('userRole');
      this.profileImageUrl = this.getProfileImage();
    }
  }

  private loadProfileData(): void {
    if (this.userRole !== 'Admin' && this.userRole !== 'Driver') {
      this.fetchTrips();
      this.fetchParcels();
      this.fetchCarpoolHistory();
    }
  }

  // Profile Image Methods
  getProfileImage(): string {
    const photo = this.user?.userProfilePhoto;
    if (!photo) {
      return this.defaultProfilePhoto;
    }
    if (typeof photo !== 'string' || photo === 'null') {
      return this.defaultProfilePhoto;
    }
    if (typeof photo === 'string' && photo.startsWith('data:image')) {
      return photo;
    }
    if (typeof photo === 'string' && photo.startsWith('http')) {
      return photo;
    }
    const sanitized = photo.replace(/\s/g, '');
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    if (base64Pattern.test(sanitized)) {
      return `data:image/jpeg;base64,${sanitized}`;
    }
    return this.defaultProfilePhoto;
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) this.uploadProfileImage(file);
  }

  uploadProfileImage(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.userService.uploadProfileImage(base64).subscribe({
        next: (response) => {
          const updatedPhoto = response?.updated?.profilePhoto || base64;
          this.user.userProfilePhoto = updatedPhoto;
          localStorage.setItem('user', JSON.stringify(this.user));
          this.profileImageUrl = this.getProfileImage();
          document.dispatchEvent(new Event('updateProfileImage'));
        },
        error: (error) => {
          console.error('❌ Error uploading profile photo:', error);
          alert('Error: ' + (error.error?.message || error.message || 'Failed to upload profile photo'));
        }
      });
    };
    reader.onerror = () => {
      alert('Failed to read the selected file. Please try another image.');
    };
    reader.readAsDataURL(file);
  }

  // Data Fetching Methods
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchTrips(): void {
    const headers = this.getAuthHeaders();
    this.tripService.getTripsForUser(this.user.userId, headers).subscribe({
      next: (trips) => this.trips = trips,
      error: (error) => console.error('Error fetching trips:', error)
    });
  }

  fetchParcels(): void {
    const headers = this.getAuthHeaders();
    this.parcelService.getParcelsForUser(this.user.userId, headers).subscribe({
      next: (parcels) => this.parcels = parcels,
      error: (error) => console.error('Error fetching parcels:', error)
    });
  }


  fetchCarpoolHistory(): void {
    const headers = this.getAuthHeaders();
    this.carpoolService.getCarpoolsJoinedByUser(this.user.userId, headers).subscribe({
      next: (joinedCarpools) => {
        this.carpoolOffers = joinedCarpools;
        console.log('Covoiturages rejoints:', joinedCarpools);
        this.carpoolOffers.forEach(carpool => {
          this.loadCarpoolRatings(carpool.carpoolId);
        });
      },
      error: (error) => console.error('Erreur lors de la récupération des covoiturages:', error)
    });
  }


  loadCarpoolRatings(carpoolId: number): void {
    const headers = this.getAuthHeaders();
    this.carpoolService.getCarpoolRatings(carpoolId, headers).subscribe({
      next: (ratings) => {
        console.log(`Notations pour le covoiturage ${carpoolId}:`, ratings);
        this.carpoolRatings[carpoolId] = ratings;
      },
      error: (err) => {
        console.error(`Erreur lors du chargement des notations pour ${carpoolId}:`, err);
        this.carpoolRatings[carpoolId] = [];
      }
    });
  }

  // Utility Methods

  isCarpoolInPast(carpoolDate: string, carpoolTime: string): boolean {
    const now = new Date();
    const carpoolDateTime = new Date(`${carpoolDate}T${carpoolTime}`);
    return carpoolDateTime < now;
  }

  // Action Methods
  deleteTrip(tripId: number): void {
    const headers = this.getAuthHeaders();
    this.tripService.deleteTrip(tripId, headers).subscribe({
      next: () => this.trips = this.trips.filter(trip => trip.tripId !== tripId),
      error: (error) => console.error('Error deleting trip:', error)
    });
  }

  hasRatedCarpool(carpoolId: number): boolean {
    const ratings = this.carpoolRatings[carpoolId] || [];
    return ratings.some(rating => Object.keys(rating).includes(this.user.userId.toString()));
  }


  cancelCarpool(carpoolId: number): void {
    const headers = this.getAuthHeaders();
    this.carpoolService.leaveCarpool(carpoolId, this.user.userId, headers).subscribe({
      next: () => this.carpoolOffers = this.carpoolOffers.filter(offer => offer.carpoolId !== carpoolId),
      error: (error) => console.error('Error canceling carpool:', error)
    });
  }


  rateCarpool(carpoolId: number, liked: boolean): void {
    const headers = this.getAuthHeaders();
    this.carpoolService.rateCarpool(carpoolId, this.user.userId, liked, headers).subscribe({
      next: (response) => {
        console.log('Notation soumise pour le covoiturage:', response);
        this.loadCarpoolRatings(carpoolId);
      },
      error: (err) => {
        console.error('Erreur lors de la soumission de la note:', err);
        alert('Impossible de soumettre la note: ' + (err.error?.message || 'Erreur inconnue'));
      }
    });
  }

  // Toggle Methods
  toggleTripHistory(): void {
    this.isTripsVisible = !this.isTripsVisible;
  }

  toggleParcelHistory(): void {
    this.isParcelsVisible = !this.isParcelsVisible;
  }

  toggleCarpoolHistory(): void {
    this.isCarpoolVisible = !this.isCarpoolVisible;
  }

  // Navigation
  navigateToEditProfile(): void {
    this.router.navigate(['/edit-profile']);
    
  }














  

  // Method to toggle availability
  toggleAvailability(): void {
    this.isAvailable = !this.isAvailable;
    const updatedDriver = {
      ...this.user,
      availabilityD: this.isAvailable  // Update availability based on the toggle
    };

    // Call the backend to update the driver's availability
    this.driverService.updateDriver(this.user.userId, updatedDriver).subscribe({
      next: (response) => {
        console.log('Driver availability updated successfully:', response);
        this.user.availabilityD = this.isAvailable;  // Update the user object with new availability
        localStorage.setItem('user', JSON.stringify(this.user));  // Store the updated user object in localStorage
      },
      error: (error) => {
        console.error('Error updating driver availability:', error);
        alert('Error updating availability!');
      }
    });
  }

  // Existing methods like loadUserData(), fetchTrips(), etc.

  checkAvailability() {
    if (this.userRole === 'Driver') {
      this.isAvailable = this.user.availabilityD || false;
      }}  // If available, set true
    
  deleteParcel(parcelId: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.parcelService.deleteParcel(parcelId, headers).subscribe(
      () => {
        this.parcels = this.parcels.filter(parcel => parcel.parcelId !== parcelId); // Supprimer le colis de la liste
        console.log('Parcel deleted successfully');
      },
      (error) => {
        console.error('Error deleting parcel:', error);
      }
    );
  }

 
  


  
 



   // SOS Function
   triggerSOS(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
  
          // Prepare the trip data to send
          const tripData = {
            tripId: 0,  // You can set this to 0 if you don't have a tripId at the moment
            tripDeparture: "Unknown",  // Customize based on your use case
            tripDestination: "Unknown",  // Customize as needed
            tripDate: new Date().toISOString(),  // Use the current date and time
            latitude: latitude,
            longitude: longitude,
            simpleUser: {
              userId: this.user?.userId || 0,  // Ensure this is populated
              firstName: this.user?.firstName || "Unknown",
              lastName: this.user?.lastName || "Unknown",
              email: this.user?.email || "Unknown",
              emergencyContactEmail: this.user?.emergencyContactEmail || "Unknown"
            }
          };
  
          console.log("Emergency Contact Email:", this.user?.emergencyContactEmail);

          
          // Send SOS data to backend to trigger email alert
          this.sendSOSAlert(tripData);
        },
        (error) => {
          console.error('Error getting geolocation', error);
          alert("Unable to retrieve your location. Please ensure that location services are enabled.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  }
  
  // Sending SOS alert to the backend
  sendSOSAlert(sosData: any): void {
    this.http.post('http://localhost:8089/examen/emergency/send-sos-email', sosData)
      .subscribe(
        response => {
          console.log('SOS alert sent successfully', response);
          alert("SOS alert sent to your emergency contacts.");
        },
        error => {
          console.error('Error sending SOS alert', error);
          alert("There was an error sending the SOS alert. Please try again later.");
        }
      );
  }






 // Méthodes
openDamageModal(parcel: any): void {
  this.selectedParcel = parcel;
  this.isDamageModalOpen = true;
}

closeDamageModal(): void {
  this.isDamageModalOpen = false;
  this.selectedParcel = null;
  this.damageFile = null;
  this.damageDescription = '';
}

onDamageFileChange(event: any): void {
  const file = event.target.files[0];
  if (file) {
    this.damageFile = file;
  }
}

submitDamageReport(): void {
  if (this.selectedParcel && this.damageFile && this.damageDescription) {
    this.parcelService.reportDamagedParcel(
      this.selectedParcel.parcelId,
      this.damageFile,
      this.damageDescription
    ).subscribe({
      next: () => {
        alert('✅  Report sent successfully.');
        this.closeDamageModal();
      },
      error: (err) => {
        console.error('❌ Erreur :', err);
        alert(err.error?.message || 'Error during submission.');
      }
    });
  } else {
    alert('📌Please provide an image and a description.');
  }
}
//Parcel
downloadPdf(parcelId: number): void {
  this.parcelService.downloadParcelPdf(parcelId).subscribe(blob => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parcel-${parcelId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, error => {
    console.error('Erreur lors du téléchargement du PDF :', error);
  });
}
}