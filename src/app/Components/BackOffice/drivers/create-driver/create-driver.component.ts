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
  // Store the selected vehicle ID before creating driver
  const selectedVehicleId = this.driver.vehicle?.vehiculeId;
  
  // Create driver payload without vehicle (vehicle assignment happens separately)
  const driverPayload = {
    firstName: this.driver.firstName,
    lastName: this.driver.lastName,
    email: this.driver.email,
    password: this.driver.password,
    availabilityD: this.driver.availabilityD,
    cin: this.driver.cin,
    address: this.driver.address,
    licenseNumberD: this.driver.licenseNumberD,
    insuranceDetailsD: this.driver.insuranceDetailsD
  };

  this.driverService.createDriver(driverPayload).subscribe(
    (response) => {
      this.successMessage = 'Driver created successfully!';
      this.errorMessage = '';  // Clear any previous errors
      console.log('Driver created successfully!', response);
      
      // If a vehicle was selected, assign it to the newly created driver
      if (selectedVehicleId) {
        const fallbackId = (response as any)?.userId ?? (response as any)?.id ?? (response as any)?.driverId;
        const normalizedDriverId = fallbackId !== undefined && fallbackId !== null ? Number(fallbackId) : NaN;

        if (!Number.isNaN(normalizedDriverId)) {
          this.assignVehicleToDriver(selectedVehicleId, normalizedDriverId);
        } else {
          console.warn('Driver created but no numeric driverId returned. Skipping automatic vehicle assignment.', response);
        }
      }
    },
    (error) => {
      this.errorMessage = 'Error creating driver. Please try again.';
      this.successMessage = '';  // Clear any previous success messages
      console.error('Error creating driver:', error);
    }
  );
}

assignVehicleToDriver(vehicleId: number, driverId: number) {
  this.vehicleService.assignToDriver(vehicleId, driverId).subscribe(
    () => {
      console.log('Vehicle assigned to driver successfully');
      this.successMessage += ' Vehicle assigned successfully!';
    },
    (error) => {
      console.error('Error assigning vehicle to driver:', error);
      this.errorMessage = 'Driver created but vehicle assignment failed. You can assign it manually later.';
    }
  );
}

}
