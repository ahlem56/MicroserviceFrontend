import { Component } from '@angular/core';
import {Vehicle, VehicleService} from "../../../../Core/vehicle.service";
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-vehicle-create',
    templateUrl: './vehicle-create.component.html',
    styleUrls: ['./vehicle-create.component.css'],
    standalone: false
})
export class VehicleCreateBackOfficeComponent {

  vehicle: Partial<Vehicle> = {
    vehicleType: 'Car',
    vehiculeInsuranceStatus: false
  };

  isLoading = false;
  errorMessage: string | null = null;
  minDate = new Date().toISOString().split('T')[0];

  constructor(
    private vehicleService: VehicleService,
    public router: Router
  ) {
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    // Log the payload for debugging
    console.log('Raw form data:', this.vehicle);

    this.vehicleService.createVehicle(this.vehicle).subscribe({
      next: () => this.router.navigate(['/back-office/vehicles']),
      error: (err) => {
        console.error('Full error:', err);
        if (err.error) {
          console.error('Server response:', err.error);
          this.errorMessage = err.error.message || JSON.stringify(err.error);
        }
      }
    });
  }
}
