import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DriverService } from 'src/app/Core/driver.service';
import { Vehicle, VehicleService } from 'src/app/Core/vehicle.service'; // Assuming you have a service to fetch vehicles

@Component({
  selector: 'app-create-driver',
  templateUrl: './create-driver.component.html',
  styleUrls: ['./create-driver.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class CreateDriverBackOfficeComponent implements OnInit {
  
  driver: { 
    firstName: string; 
    lastName: string; 
    email: string; 
    password: string; 
    availabilityD: boolean; 
    cin: string; 
    address: string; 
    vehicle: Vehicle | null;  // Here it can be either a Vehicle or null
    licenseNumberD: string;  // Added licenseNumberD
    insuranceDetailsD: string;  // Added insuranceDetailsD
  } = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    availabilityD: false,
    cin: '',    // Added contact field
    address: '',     // Added address field
    vehicle: null , // Initialize with null
    licenseNumberD: '',  // Initialize licenseNumberD
  insuranceDetailsD: ''  // Initialize insuranceDetailsD
  };
  availableVehicles: Vehicle[] = []; // Specify the type of availableVehicles as Vehicle[]
  successMessage = '';  // Variable to store success message
  errorMessage = '';    // Variable to store error message
  
  constructor(private driverService: DriverService, private vehicleService: VehicleService) { }

  ngOnInit(): void {
    // Fetch available vehicles when the component initializes
    this.fetchAvailableVehicles();
  }

  // Fetch the available vehicles from the backend
  fetchAvailableVehicles() {
    this.vehicleService.getAvailableVehicles().subscribe(
      (vehicles) => {
        this.availableVehicles = vehicles;
      },
      (error) => {
        console.error('Error fetching available vehicles:', error);
      }
    );
}


createDriver() {
  // Fetch the selected vehicle using the vehiculeId
  const selectedVehicle = this.availableVehicles.find(vehicle => vehicle.vehiculeId === this.driver.vehicle?.vehiculeId);
  
  if (selectedVehicle) {
    // Add the selected vehicle to the driver object
    this.driver.vehicle = selectedVehicle;
  }

  this.driverService.createDriver(this.driver).subscribe(
    (response) => {
      this.successMessage = 'Driver created successfully!';
      this.errorMessage = '';  // Clear any previous errors
      console.log('Driver created successfully!', response);
    },
    (error) => {
      this.errorMessage = 'Error creating driver. Please try again.';
      this.successMessage = '';  // Clear any previous success messages
      console.error('Error creating driver:', error);
    }
  );
}

}
