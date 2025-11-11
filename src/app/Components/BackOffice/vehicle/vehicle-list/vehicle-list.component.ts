import { Component } from '@angular/core';
import { Vehicle, VehicleService } from "../../../../Core/vehicle.service";
import { Router } from "@angular/router";

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.css'],
  standalone: false
})
export class VehicleListBackOfficeComponent {
  vehicles: Vehicle[] = [];
  filteredVehicles: Vehicle[] = [];
  searchTerm: string = '';
  selectedStatus: string = 'all';
  isLoading: boolean = true;
  errorMessage: string | null = null;

  // Types de véhicule basés sur l'enum back-end
  vehicleTypes = [
    { value: 'all', label: 'All Vehicles' },
    { value: 'CAR', label: 'Cars' },
    { value: 'TRUCK', label: 'Trucks' },
    { value: 'VAN', label: 'Vans' }
  ];

  constructor(
    private vehicleService: VehicleService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadVehicles();
  }

  loadVehicles(): void {
    this.vehicleService.getAllVehicles().subscribe({
      next: (data) => {
        console.log('Vehicles received from service:', data);
        console.log('First vehicle sample:', data.length > 0 ? data[0] : 'No vehicles');
        this.vehicles = data;
        this.filteredVehicles = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading vehicles:', err);
        this.errorMessage = 'Failed to load vehicles. Please try again later.';
        this.isLoading = false;
      }
    });
  }

  getVehicleModel(vehicle: Vehicle): string {
    return vehicle.vehicleModel || vehicle.model || 'Unknown';
  }

  getVehicleCapacity(vehicle: Vehicle): number {
    return vehicle.vehicleCapacity ?? vehicle.capacity ?? 0;
  }

  getVehicleType(vehicle: Vehicle): string {
    return vehicle.vehicleType || 'UNKNOWN';
  }

  getInsuranceStatus(vehicle: Vehicle): boolean {
    if (vehicle.vehiculeInsuranceStatus !== undefined) {
      return vehicle.vehiculeInsuranceStatus;
    }
    // Convert string status to boolean
    const status = vehicle.insuranceStatus?.toLowerCase() || '';
    return status === 'valid' || status === 'active' || status === 'insured';
  }

  getSerialNumber(vehicle: Vehicle): string {
    const serial = vehicle.vehicleSerialNumber ?? vehicle.serialNumber;
    return serial != null ? String(serial) : 'N/A';
  }

  applyFilters(): void {
    this.filteredVehicles = this.vehicles.filter(vehicle => {
      const model = this.getVehicleModel(vehicle).toLowerCase();
      const serial = this.getSerialNumber(vehicle).toLowerCase();
      const matchesSearch = model.includes(this.searchTerm.toLowerCase()) || 
                           serial.includes(this.searchTerm.toLowerCase());
      // Filter by type if not 'all' (though backend doesn't store type, this allows future expansion)
      const matchesType = this.selectedStatus === 'all' || this.getVehicleType(vehicle) === this.selectedStatus;
      return matchesSearch && matchesType;
    });
  }

  deleteVehicle(id: number): void {
    if (confirm('Are you sure you want to delete this vehicle?')) {
      this.vehicleService.deleteVehicle(id).subscribe({
        next: () => {
          this.vehicles = this.vehicles.filter(v => v.vehiculeId !== id);
          this.applyFilters();
        },
        error: (err) => {
          console.error('Delete failed:', err);
          alert('Failed to delete vehicle. Please try again.');
        }
      });
    }
  }

  editVehicle(id: number): void {
    this.router.navigate([`/back-office/vehicles/edit/${id}`]);
  }

  assignVehicle(id: number): void {
    this.router.navigate([`/back-office/vehicles/assign/${id}`]);
  }

  MapVehicle(id: number): void {
    this.router.navigate([`/back-office/vehicles/map/${id}`]);
  }

  consultTravelHistory(id: number): void {
    this.router.navigate([`/back-office/vehicles/travel-history/${id}`]);
  }
}
