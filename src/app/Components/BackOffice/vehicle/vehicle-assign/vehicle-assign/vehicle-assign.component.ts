import {Component, OnInit} from '@angular/core';
import {Driver, DriverService} from "../../../../../Core/driver.service";
import {Vehicle, VehicleService} from "../../../../../Core/vehicle.service";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-vehicle-assign',
  imports: [ReactiveFormsModule],
  templateUrl: './vehicle-assign.component.html',
  styleUrl: './vehicle-assign.component.scss'
})
export class VehicleAssignComponent implements OnInit{
  vehicle!: Vehicle;
  drivers: Driver[] = [];
  assignForm: FormGroup;
  isLoading = true;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehicleService,
    private driverService: DriverService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.assignForm = this.fb.group({
      userId: [null]
    });
  }

  ngOnInit(): void {
    console.log('Component initialized'); // Add this
    const vehicleId = +this.route.snapshot.params['id'];
    this.loadData(vehicleId);
  }

  private loadData(vehicleId: number): void {
    console.log('Loading vehicle data for ID:', vehicleId); // Add this
    this.vehicleService.getVehicleById(vehicleId).subscribe({
      next: (vehicle) => {
        console.log('Vehicle loaded:', vehicle); // Add this
        this.vehicle = vehicle;
        this.loadDrivers();
      },
      error: (err) => {
        console.error('Vehicle load error:', err); // Enhanced logging
        this.handleError(err, 'Failed to load vehicle details');
      }
    });
  }

  private loadDrivers(): void {
    this.driverService.getAvailableDrivers().subscribe({
      next: (drivers) => {
        console.log('Loaded drivers:', drivers); // Debug log
        this.drivers = drivers;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading drivers:', err); // Detailed error
        this.errorMessage = 'Failed to load available drivers';
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.assignForm.invalid || this.isLoading) return;

    this.isLoading = true;
    const userId = this.assignForm.value.userId;

    this.vehicleService.assignToDriver(this.vehicle.vehiculeId!, userId).subscribe({
      next: () => this.router.navigate(['/back-office/vehicles', this.vehicle.vehiculeId]),
      error: (err) => this.handleError(err, 'Failed to assign vehicle')
    });
  }

  private handleError(error: any, message: string): void {
    console.error(error);
    this.errorMessage = message;
    this.isLoading = false;
  }

  cancel(): void {
    this.router.navigate(['/back-office/vehicles']);
  }
}
