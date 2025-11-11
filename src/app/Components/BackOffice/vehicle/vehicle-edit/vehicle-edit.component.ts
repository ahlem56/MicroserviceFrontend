import { Component } from '@angular/core';
import {Vehicle, VehicleService} from "../../../../Core/vehicle.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-vehicle-edit',
    templateUrl: './vehicle-edit.component.html',
    styleUrls: ['./vehicle-edit.component.css'],
    standalone: false
})
export class VehicleEditBackOfficeComponent {
  vehicleForm: FormGroup;
  isLoading = true;
  errorMessage: string | null = null;
  vehicleId!: number;
  vehicleTypes = ['CAR', 'TRUCK', 'VAN'];

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.vehicleForm = this.fb.group({
      vehicleType: ['', Validators.required],
      vehicleModel: ['', Validators.required],
      vehicleCapacity: ['', [Validators.required, Validators.min(1)]],
      vehiculeMaintenanceDate: ['', Validators.required],
      vehiculeInsuranceStatus: [false],
      vehiculeInsuranceDate: ['']
    });
  }

  ngOnInit(): void {
    this.vehicleId = +this.route.snapshot.params['id'];
    this.loadVehicle();
  }

  loadVehicle(): void {
    this.vehicleService.getVehicleById(this.vehicleId).subscribe({
      next: (vehicle) => {
        this.vehicleForm.patchValue({
          ...vehicle,
          vehiculeMaintenanceDate: this.formatDate(vehicle.vehiculeMaintenanceDate),
          vehiculeInsuranceDate: this.formatDate(vehicle.vehiculeInsuranceDate)
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vehicle:', err);
        this.errorMessage = 'Failed to load vehicle details';
        this.isLoading = false;
      }
    });
  }

  private formatDate(dateString: any): string {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) return;

    // Correct way to create the updated vehicle object
    const updatedVehicle: Vehicle = {
      ...this.vehicleForm.value,  // Spread operator to include form values
      vehiculeId: this.vehicleId  // Add the vehicleId separately
    };

    this.vehicleService.updateVehicle(this.vehicleId, updatedVehicle).subscribe({
      next: () => {
        this.router.navigate(['/back-office/vehicles']);
      },
      error: (err) => {
        console.error('Update failed:', err);
        this.errorMessage = 'Failed to update vehicle. Please try again.';
      }
    });
  }
  deleteVehicle(): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(this.vehicleId).subscribe({
        next: () => {
          this.router.navigate(['/back-office/vehicles']);
        },
        error: (err) => {
          console.error('Delete failed:', err);
          this.errorMessage = 'Failed to delete vehicle. Please try again.';
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/back-office/vehicles']);
  }
}

