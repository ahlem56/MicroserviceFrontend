import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParcelService } from 'src/app/Core/parcel.service';
import { TripService } from 'src/app/Core/trip.service';
import { UserService } from 'src/app/Core/user.service';
import { PaymentService } from 'src/app/Core/payment.service';
import { CarpoolService } from 'src/app/Core/carpool.service';
import { RatingService } from 'src/app/Core/rating.service';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef } from '@angular/core';
import { DriverService } from 'src/app/Core/driver.service';
import { SubscriptionService } from 'src/app/Core/subscription.service';
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
  subscriptionRemainingTime: number | null = null;
  subscriptionStartDate: Date | null = null;  // make sure this is set properly

  isRatingModalOpen = false;
  currentRating = 0;  // Store the selected rating
  ratingComment = ''; // Store the comment
  tripToRate: any = {};  // Add this line to define the tripToRate property
  predictedScore = 0; // Store the predicted score from sentiment analysis

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
  // Payment Data
  payments: any[] = [];
  isPaymentsVisible = false;
  
  // Carpool Data
  carpoolOffers: any[] = [];
  isCarpoolVisible = false;
  carpoolRatings: { [carpoolId: number]: any[] } = {}; // Notations des covoiturages

  // Rating Data
  ratingsReceived: any[] = [];
  ratingsGiven: any[] = [];
  averageRating = 0;
  isRatingsVisible = false;

  isAvailable: boolean = false; // Default to not available
Object: any;



  constructor(
    private http: HttpClient,
    private userService: UserService,
    private router: Router,
    private tripService: TripService,
    private parcelService: ParcelService,
    private paymentService: PaymentService,
    private carpoolService: CarpoolService,
    private ratingService: RatingService,
    private driverService: DriverService, // Assuming you have a driver service
    private subscriptionService: SubscriptionService, // Assuming you have a subscription service

  ) {}

  ngOnInit() {
    this.loadUserData();
    this.loadProfileData();
    this.checkAvailability(); // Check availability when the component is initialized
    this.fetchSubscriptionDetails();  // Fetch subscription details
this.userRole = (localStorage.getItem('userRole') || '').toUpperCase();

    if (this.userRole === 'USER') {
      this.subscriptionStartDate = this.user.subscriptionStartDate;
      // Add fallback message
    }
  
  }

 private loadUserData(): void {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    this.user = JSON.parse(storedUser);
    this.userRole = (localStorage.getItem('userRole') || '').toUpperCase(); // 👈 normalize
    this.profileImageUrl = this.getProfileImage();
  }
}


  private loadProfileData(): void {
    if (this.userRole !== 'Admin' && this.userRole !== 'DRIVER') {
      this.fetchTrips();
      this.fetchParcels();
      this.fetchPayments();
      this.fetchCarpoolHistory();
    }
    if (this.userRole !== 'Admin') {
      this.loadRatings();
    }
  }

  // Profile Image Methods
  getProfileImage(): string {
    return this.user.userProfilePhoto
      ? `http://localhost:8089/examen/user/profile-photo/${this.user.userProfilePhoto}`
      : this.defaultProfilePhoto;
  }

  triggerFileInput(): void {
    document.getElementById('fileInput')?.click();
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) this.uploadProfileImage(file);
  }

  uploadProfileImage(file: File): void {
    const formData = new FormData();
    formData.append('profilePhoto', file, file.name);
  
    this.userService.uploadProfileImage(formData).subscribe({
      next: (response) => {
        this.user.userProfilePhoto = response.fileName;
        localStorage.setItem('user', JSON.stringify(this.user));
        this.profileImageUrl = this.getProfileImage();
      },
      error: (error) => {
        console.error('❌ Error uploading profile photo:', error);
        alert("Error: " + (error.error?.message || "Failed to upload profile photo"));
      }
    });
  }

  // Data Fetching Methods
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  fetchTrips(): void {
  const headers = this.getAuthHeaders();
  const userId = this.user.userId || this.user.id;

  if (!userId) {
    console.error('❌ No userId found in localStorage');
    return;
  }

  this.tripService.getTripsForUser(userId, headers).subscribe({
    next: (trips) => {
      console.log('✅ Trips loaded:', trips);
      this.trips = trips;
      this.isTripsVisible = true; // 👈 make sure container is "open"
    },
    error: (error) => console.error('❌ Error fetching trips:', error)
  });
}



  fetchParcels(): void {
    const headers = this.getAuthHeaders();
    this.parcelService.getParcelsForUser(this.user.userId, headers).subscribe({
      next: (parcels) => this.parcels = parcels,
      error: (error) => console.error('Error fetching parcels:', error)
    });
  }

  fetchPayments(): void {
    this.paymentService.getPaymentHistory().subscribe({
      next: (payments) => this.payments = payments,
      error: (err) => console.error('Failed to fetch payment history', err)
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

  loadRatings(): void {
    const headers = this.getAuthHeaders();
    const userId = this.user.userId;
  
    this.ratingService.getUserRatings(userId, headers).subscribe({
      next: (ratingsData) => {
        this.ratingsReceived = ratingsData.ratingsReceived || [];
        this.ratingsGiven = ratingsData.ratingsGiven || [];
        this.calculateAverageRating();
      },
      error: (error) => console.error('Error fetching ratings:', error)
    });
  }
  
  // Utility Methods
  calculateAverageRating(): void {
    if (this.ratingsReceived.length > 0) {
      this.averageRating = this.ratingsReceived.reduce((acc, rating) => acc + rating.score, 0) / this.ratingsReceived.length;
    }
  }

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

  togglePaymentHistory(): void {
    this.isPaymentsVisible = !this.isPaymentsVisible;
  }

  toggleCarpoolHistory(): void {
    this.isCarpoolVisible = !this.isCarpoolVisible;
  }

  toggleRatingHistory(): void {
    this.isRatingsVisible = !this.isRatingsVisible;
  }

  // Navigation
  navigateToEditProfile(): void {
    this.router.navigate(['/edit-profile']);
    
  }








   // This method is called when the user clicks on "Rate This Trip"
 // This method is called when the user clicks on "Rate This Trip"
 openRatingModal(trip: any): void {
  this.isRatingModalOpen = true;
  this.tripToRate = trip;  // Store the trip that the user is rating

  // Ensure `isRated` is initialized before using it
  if (typeof this.tripToRate.isRated === 'undefined') {
    this.tripToRate.isRated = false;  // Initialize if undefined
  }

  // Reset rating state to prepare for new rating
  this.currentRating = 0;
  this.ratingComment = '';  // Reset comment if any
  this.predictedScore = 0;  // Reset predicted score
}

// Close the rating modal
closeRatingModal(): void {
  this.isRatingModalOpen = false;
  this.currentRating = 0;  // Reset rating
  this.ratingComment = '';  // Reset comment
}

// Set the rating value when a star is clicked
setRating(rating: number): void {
  this.currentRating = rating;
  this.predictedScore = rating; // Allow users to adjust the rating
}

// Automatically rate based on the sentiment of the comment as the user types
autoRateFromComment(): void {
  if (this.ratingComment.trim().length > 0) {
    // ❌ WRONG : no saving here!!
    // ✅ CORRECT: only ask for sentiment prediction
    
    this.ratingService.getSentimentAnalysis(this.ratingComment).subscribe({
      next: (sentimentResponse) => {
        let score = Math.round(sentimentResponse.predicted_score || 3);
        if (isNaN(score) || score < 1 || score > 5) {
          score = 3;
        }
        this.predictedScore = score;
        this.currentRating = this.predictedScore;
      },
      error: (error) => {
        console.error('Error analyzing sentiment:', error);
        this.predictedScore = 3;
        this.currentRating = 3;
      }
    });
  }
}



// Submit the rating to the backend
submitRating(): void {
  if (this.currentRating === 0) {
    alert('Please provide a rating!');
    return;
  }

  const ratingData = {
    comment: this.ratingComment, // Only comment (Spring Boot will handle AI)
  };

  this.ratingService.createRating(ratingData, this.tripToRate.tripId, this.user.userId, this.tripToRate.driver.userId, this.getAuthHeaders()).subscribe({
    next: (response) => {
      console.log('Rating submitted successfully:', response);
      this.tripToRate.isRated = true;
      this.refreshTripData(this.tripToRate.tripId);
      this.closeRatingModal();
    },
    error: (error) => {
      console.error('Error submitting rating:', error);
    }
  });
}

hoverRating(rating: number): void {
  // If hovering over a star, temporarily set the displayed rating
  if (rating > 0) {
    this.currentRating = rating;
  } else {
    // When mouse leaves, reset to the selected rating (predictedScore)
    this.currentRating = this.predictedScore || 0;
  }
}


// Fetch updated trip data after rating submission
refreshTripData(tripId: number): void {
  this.tripService.getTripById(tripId, this.getAuthHeaders()).subscribe(
    (updatedTrip) => {
      // Find the trip in trips array and update it
      const index = this.trips.findIndex(t => t.tripId === tripId);
      if (index !== -1) {
        this.trips[index] = updatedTrip;  // ✅ Update trip inside the array
      }
      this.tripToRate = updatedTrip;  // ✅ Update tripToRate as well
    },
    (error) => {
      console.error('Error fetching trip data:', error);
    }
  );
}

// Helper method to check if the user can rate the trip
canRate(trip: any): boolean {
  return trip && trip.reservationStatus === 'COMPLETED' && !this.isTripRated(trip);
}

// Check if the trip has already been rated
isTripRated(trip: any): boolean {
  return trip.isRated;  // If the trip has been rated, the `isRated` flag will be true
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




  fetchSubscriptionDetails(): void {
    // Assuming this.user.userId is available and valid
    this.subscriptionService.getUserSubscription(this.user.userId).subscribe({
      next: (subscription) => {
        console.log("Fetched subscription:", subscription);

        this.user.subscription = subscription;
        this.calculateSubscriptionRemainingTime(subscription);
      },
      error: (error) => console.error('Error fetching subscription details:', error)
    });
  }
  
  calculateSubscriptionRemainingTime(subscription: any): void {
    const currentDate = new Date();
  
    // Ensure subscriptionStartDate is a Date object
    let startDate = new Date(this.user.subscriptionStartDate);
  
    // Check if startDate is invalid
    if (isNaN(startDate.getTime())) {
      console.error('Invalid subscription start date');
      return;
    }
  
    console.log("Subscription Start Date:", startDate);
  
    // Add the subscription duration (in months) to the start date
    const endDate = new Date(startDate);
    endDate.setMonth(startDate.getMonth() + subscription.durationInMonths);
  
    const timeDiff = endDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));  // Convert milliseconds to days
  
    this.subscriptionRemainingTime = daysLeft;
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