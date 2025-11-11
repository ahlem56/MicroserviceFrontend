import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CarpoolService } from 'src/app/Core/carpool.service';
import { HttpHeaders } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carpooling-detail',
  templateUrl: './carpooling-detail.component.html',
  styleUrls: ['./carpooling-detail.component.css'],
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true
})
export class CarpoolingDetailFrontOfficeComponent implements OnInit {
  carpoolDetails: any;
  carpoolId!: number;
  errorMessage: string = '';
  successMessage: string = '';
  offererDetails: any;
  numberOfPlaces: number = 1;
  hasJoined: boolean = false;
  joinedUsers: any[] = [];
  Math: any;

  readonly baseApiUrl = 'http://localhost:8089/examen/user';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private carpoolService: CarpoolService

  ) {}

  ngOnInit(): void {
    this.carpoolId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.carpoolId) {
      this.errorMessage = "❌ Carpool ID not found.";
      return;
    }

    this.loadCarpoolDetails();
    this.loadOffererDetails();
    this.loadJoinedUsers();
    this.checkIfUserJoined();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.errorMessage = "❌ No token found. Please log in.";
      this.router.navigate(['/login']);
      throw new Error('No token found');
    }
    return new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
  }

  loadCarpoolDetails(): void {
    const headers = this.getHeaders();
    this.carpoolService.getCarpoolById(this.carpoolId, headers).subscribe({
      next: (data) => {
        this.carpoolDetails = data;
        console.log("📥 Carpool details retrieved:", data);
        
      },
      error: (error) => {
        console.error("❌ API Error:", error);
        if (error.status === 401) {
          this.errorMessage = "Your session has expired. Please log in again.";
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = "Unable to load carpool details. Please try again later.";
        }
      }
    });
  }

  loadOffererDetails(): void {
    const headers = this.getHeaders();
    this.carpoolService.getCarpoolOfferer(this.carpoolId, headers).subscribe({
      next: (data) => {
        console.log("Offerer data:", data);
        console.log("Offerer profile photo:", data.userProfilePhoto || data.profilePhoto || 'missing');
        this.offererDetails = {
          ...data,
          firstName: data.firstName || data.userFirstName || 'Unknown',
          lastName: data.lastName || data.userLastName || 'User',
          profilePhoto: this.getProfilePhotoUrl(data.userProfilePhoto || data.profilePhoto)
        };
        console.log("Processed offererDetails:", this.offererDetails);
      },
      error: (error) => {
        console.error("❌ Error retrieving offerer:", error);
        this.errorMessage = "Unable to load offerer information.";
      }
    });
  }

  loadJoinedUsers(): void {
    const headers = this.getHeaders();
    this.carpoolService.getUsersWhoJoinedCarpool(this.carpoolId, headers).subscribe({
      next: (users) => {
        console.log("Users retrieved from getUsersWhoJoinedCarpool:", users);
        users.forEach((user: any) => {
          console.log(`User ${user.userId} profile photo:`, user.userProfilePhoto || user.profilePhoto || 'missing');
        });
        this.joinedUsers = users.map((user: any) => ({
          ...user,
          firstName: user.firstName || user.userFirstName || 'Unknown',
          lastName: user.lastName || user.userLastName || 'User',
          email: user.email || user.userEmail || 'N/A',
          profilePhoto: this.getProfilePhotoUrl(user.userProfilePhoto || user.profilePhoto)
        }));
        console.log("Processed joinedUsers:", this.joinedUsers);
      },
      error: (error) => {
        console.error("❌ Error retrieving participants:", error);
        this.errorMessage = "Unable to load participants list.";
      }
    });
  }

  checkIfUserJoined(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      return;
    }
    const user = JSON.parse(storedUser);
    const userId = user.userId;

    const headers = this.getHeaders();
    this.carpoolService.getCarpoolsJoinedByUser(userId, headers).subscribe({
      next: (joinedCarpools) => {
        this.hasJoined = joinedCarpools.some((carpool: any) => carpool.carpoolId === this.carpoolId);
        console.log("🔍 User has joined:", this.hasJoined);
      },
      error: (error) => {
        console.error("❌ Error checking status:", error);
      }
    });
  }

  joinCarpool(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.errorMessage = "❌ No logged-in user found. Please log in.";
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.userId;

    if (this.numberOfPlaces <= 0 || this.numberOfPlaces > this.carpoolDetails.carpoolCapacity) {
      this.errorMessage = `Please select between 1 and ${this.carpoolDetails.carpoolCapacity} places.`;
      return;
    }

    const headers = this.getHeaders();
    this.carpoolService.joinCarpool(this.carpoolId, userId, this.numberOfPlaces, headers).subscribe({
      next: () => {
        this.successMessage = `✅ You have joined this carpool with ${this.numberOfPlaces} place(s)!`;
        this.errorMessage = '';
        this.hasJoined = true;
        this.loadCarpoolDetails();
        this.loadJoinedUsers();
        setTimeout(() => {
          this.router.navigate([`/carpooling/join/${this.carpoolId}`]);
        }, 2000);
      },
      error: (error) => {
        console.error("❌ Error attempting to join:", error);
        if (error.status === 401) {
          this.errorMessage = "⛔ You cannot join this carpool!";
        } else if (error.status === 403) {
          this.errorMessage = "⛔ You cannot join your own carpool.";
        } else if (error.error && error.error.includes("already joined")) {
          this.errorMessage = "⛔ You have already joined this carpool.";
        } else if (error.error && error.error.includes("Not enough capacity")) {
          this.errorMessage = "⛔ Not enough places available.";
        } else {
          this.errorMessage = "❌ An error occurred.";
        }
      }
    });
  }

  leaveCarpool(): void {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      this.errorMessage = "❌ No logged-in user found. Please log in.";
      this.router.navigate(['/login']);
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.userId;

    const headers = this.getHeaders();
    this.carpoolService.leaveCarpool(this.carpoolId, userId, headers).subscribe({
      next: () => {
        this.successMessage = "✅ You have left the carpool.";
        this.errorMessage = '';
        this.hasJoined = false;
        this.loadCarpoolDetails();
        this.loadJoinedUsers();
        setTimeout(() => {
          this.router.navigate(['/carpooling']);
        }, 2000);
      },
      error: (error) => {
        console.error("❌ Error attempting to leave:", error);
        this.errorMessage = "❌ Error leaving carpool.";
      }
    });
  }

  private getProfilePhotoUrl(profilePhoto: string | null): string | null {
    if (!profilePhoto || profilePhoto === 'null') {
      console.warn("Profile photo is null or invalid, no photo will be displayed");
      return null;
    }
    if (profilePhoto.startsWith('data:image')) {
      console.log("Using base64 profile photo:", profilePhoto.substring(0, 30) + '...');
      return profilePhoto;
    }
    const fileName = profilePhoto.split('/').pop() || profilePhoto;
    if (!fileName || fileName === 'null') {
      console.warn("Invalid profile photo filename, no photo will be displayed");
      return null;
    }
    const url = `${this.baseApiUrl}/profile-photo/${fileName}`;
    console.log("Resolved profile photo URL:", url);
    return url;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    console.warn(`Image failed to load: ${imgElement.src}, hiding image`);
    imgElement.style.display = 'none';
  }

  ratings(rating: number, isPercentage: boolean = false): string[] {
    const normalizedRating = isPercentage ? rating / 20 : rating; // 100% = 5 stars
    const fullStars = Math.floor(normalizedRating);
    const halfStar = normalizedRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - (fullStars + halfStar);
    return [
      ...new Array(fullStars).fill('fas fa-star'),
      ...new Array(halfStar).fill('fas fa-star-half-alt'),
      ...new Array(emptyStars).fill('far fa-star'),
    ];
  }
}