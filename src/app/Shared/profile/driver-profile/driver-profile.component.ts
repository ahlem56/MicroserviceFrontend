import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DriverService } from 'src/app/Core/driver.service';
import { Driver } from 'src/app/Core/driver.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-driver-profile',
  templateUrl: './driver-profile.component.html',
  styleUrls: ['./driver-profile.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class DriverProfileComponent implements OnInit {
  driver: Driver | undefined;
  errorMessage: string = '';
  averageRating: number | undefined; // Variable to hold the average rating

  constructor(
    private route: ActivatedRoute,
    private driverService: DriverService
  ) {}

  ngOnInit(): void {
    const driverId = this.route.snapshot.paramMap.get('id');
    if (driverId) {
      this.driverService.getDriverProfile(+driverId).subscribe(
        (driver) => {
          this.driver = driver;
          // Rating service removed - average rating no longer available
          this.averageRating = undefined;
        },
        (error) => {
          this.errorMessage = 'Failed to load driver profile.';
          console.error(error);
        }
      );
    }
  }

  // Method to render star rating based on average rating
  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating); // Number of full stars
    const halfStar = rating % 1 >= 0.5 ? 1 : 0; // Half star if remainder is 0.5 or greater
    const emptyStars = 5 - (fullStars + halfStar); // Remaining empty stars

    return [
      ...new Array(fullStars).fill('full'),
      ...new Array(halfStar).fill('half'),
      ...new Array(emptyStars).fill('empty'),
    ];
  }
  
}
