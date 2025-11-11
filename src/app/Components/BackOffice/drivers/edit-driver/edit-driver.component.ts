import { Component, OnInit } from '@angular/core';
import { DriverService } from 'src/app/Core/driver.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-edit-driver',
  templateUrl: './edit-driver.component.html',
  styleUrls: ['./edit-driver.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class EditDriverComponent implements OnInit {
  driver: any = {};  // Store the driver details
  errorMessage: string = '';  // Store any error message
  successMessage: string = '';  // Store success message

  constructor(
    private driverService: DriverService, 
    private route: ActivatedRoute,  // To get the driverId from the URL
    private router: Router
  ) {}

  ngOnInit(): void {
  const driverId = this.route.snapshot.paramMap.get('id');
  if (driverId) {
    this.loadDriver(+driverId); // 👈 convert string to number using +
  }
}

loadDriver(driverId: number): void { // 👈 Change type to number
  this.driverService.getDriverById(driverId).subscribe(
    (driver) => {
      this.driver = driver;
    },
    (error) => {
      console.error('Error fetching driver:', error);
      this.errorMessage = 'Failed to load driver data. Please try again later.';
    }
  );
}


  // Method to update the driver information
  updateDriver(): void {
    // Ensure driver has a userId (driverId)
    if (this.driver.userId) {
      this.driverService.updateDriver(this.driver.userId, this.driver).subscribe(
        (response) => {
          this.successMessage = 'Driver updated successfully!';
          this.errorMessage = '';  // Clear any previous errors
          console.log('Driver updated successfully:', response);
          this.router.navigate(['/back-office/drivers']);  // Navigate back to the driver list
        },
        (error) => {
          this.errorMessage = 'Error updating driver. Please try again.';
          this.successMessage = '';  // Clear any previous success messages
          console.error('Error updating driver:', error);
        }
      );
    }
  }
}
