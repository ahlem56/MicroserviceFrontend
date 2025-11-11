import { Component } from '@angular/core';
import { DriverService } from 'src/app/Core/driver.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-drivers',
  imports: [CommonModule, FormsModule],
  standalone: true,  // If standalone is used
  templateUrl: './drivers.component.html',
  styleUrls: ['./drivers.component.scss'],
})
export class DriversBackOfficeComponent {
  drivers: any[] = [];  // Store all drivers
  filteredDrivers: any[] = [];  // Store the filtered drivers based on search and status
  searchTerm: string = '';  // User input for searching
  selectedStatus: string = '';  // Selected status filter for availability
  driverStatuses = [
    { value: '', label: 'All Statuses' },
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
  ];
  successMessage: string = '';
  errorMessage: string = '';
  isLoading: boolean = true;  // Show loading indicator while fetching data

  constructor(private driversService: DriverService,private router :Router) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  // Method to fetch the list of drivers from the service
  loadDrivers(): void {
    this.driversService.getAllDrivers().subscribe(
      (data) => {
        console.log('Drivers data:', data); // Check if the data is fetched correctly
        this.drivers = data;
        this.filteredDrivers = data; // Initialize filtered list with all drivers
        this.isLoading = false; // Hide loading spinner
      },
      (error) => {
        console.error('Error fetching drivers:', error);
        this.isLoading = false; // Hide loading spinner
        this.errorMessage = 'Failed to load drivers. Please try again later.';
      }
    );
  }

  // Method to filter drivers based on search term and status
  applyFilters(): void {
    this.filteredDrivers = this.drivers.filter((driver) => {
      const matchesSearchTerm = driver.firstName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                driver.lastName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                                driver.email.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.selectedStatus ? (this.selectedStatus === 'available' ? driver.availibilityD : !driver.availibilityD) : true;
      return matchesSearchTerm && matchesStatus;
    });
  }

  // Method to delete a driver
  deleteDriver(driverId: number): void {
    if (confirm('Are you sure you want to delete this driver?')) {
      this.driversService.deleteDriver(driverId).subscribe(
        () => {
          this.successMessage = 'Driver deleted successfully!';
          this.loadDrivers(); // Reload the drivers list after deletion
        },
        (error) => {
          this.errorMessage = 'Error deleting driver. Please try again.';
          console.error('Error deleting driver:', error);
        }
      );
    }
  }

  editDriver(driverId: number): void {
    this.router.navigate([`/back-office/drivers/edit/${driverId}`]); // Navigate to the edit driver page with driverId
  }

  // New method to handle the add driver action

  openAddDriverForm(): void {
    this.router.navigate(['/back-office/drivers/create']);  // Navigate to the add driver page
  }

  viewDriver(driverId: number): void {
    this.router.navigate([`/driver-profile/${driverId}`]);
  }
  
}
