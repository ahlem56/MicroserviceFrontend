import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Driver } from './driver.service';

export interface Vehicle {
  vehiculeId?: number;
  vehicleType: string;
  vehicleModel: string;
  vehicleCapacity: number;
  vehiculeMaintenanceDate: Date;
  vehiculeInsuranceStatus: boolean;
  vehiculeInsuranceDate: Date;
  driver?: Driver;
  latitude?: number;
  longitude?: number;
  updateTime?: Date;
  vehicleSerialNumber ?:number;
  travelHistory?: LocationRecord[];
}
export interface TripCoords {
  departure: string;
  destination: string;
}

export interface LocationRecord {
  latitude: number;
  longitude: number;
  arrived : boolean;
}

@Injectable({ providedIn: 'root' })
export class VehicleService {
  private baseUrl = 'http://localhost:8089/examen/vehicle';

  constructor(private http: HttpClient) { }

  // CREATE
  createVehicle(vehicleData: any): Observable<Vehicle> {
    const payload = {
      vehicleType: vehicleData.vehicleType,
      vehicleModel: vehicleData.vehicleModel,
      vehicleCapacity: vehicleData.vehicleCapacity,
      vehiculeMaintenanceDate: vehicleData.vehiculeMaintenanceDate.split('T')[0],
      vehiculeInsuranceStatus: vehicleData.vehiculeInsuranceStatus,
      vehiculeInsuranceDate: vehicleData.vehiculeInsuranceStatus
        ? vehicleData.vehiculeInsuranceDate.split('T')[0]
        : null
    };

    return this.http.post<Vehicle>(
      `${this.baseUrl}/createVehicle`,
      payload,
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
      }
    );
  }

  // READ
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/getAllVehicles`);
  }

  getVehicleById(id: number): Observable<Vehicle> {
    return this.http.get<Vehicle>(`${this.baseUrl}/getVehicle/${id}`);
  }

  // UPDATE
  updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
    return this.http.put<Vehicle>(`${this.baseUrl}/updateVehicle/${id}`, vehicle);
  }

  // DELETE
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteVehicle/${id}`);
  }

  // ASSIGN
  assignToDriver(vehicleId: number, driverId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}/assignVehicleToDriver/${vehicleId}/${driverId}`,
      {}
    );
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/getAvailableVehicles`);
  }

  updateLocation(vehicleId: number, latitude: number, longitude: number): Observable<Vehicle> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());

    return this.http.put<Vehicle>(
      `${this.baseUrl}/updateLocation/${vehicleId}`,
      null,
      { params }
    );
  }

  getCheckpointsStatus(vehicleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/checkpointsStatus/${vehicleId}`);
  }

  getTripDepartureAndDestination(tripId: number): Observable<TripCoords> {
    return this.http.get<TripCoords>(
      `${this.baseUrl}/trip-coordinates/${tripId}`
    );
  }

  // Fetch vehicles with expired insurance
  getVehiclesWithExpiredInsurance(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/vehicles/expired-insurance`);
  }

  saveCheckpoints(
    vehicleId: number,
    checkpoints: LocationRecord[]
  ): Observable<Vehicle> {
    return this.http.post<Vehicle>(
      `${this.baseUrl}/saveCheckpoints/${vehicleId}`,
      checkpoints
    );
  }

  markNextArrived(vehicleId: number): Observable<Vehicle> {
    return this.http.put<Vehicle>(
      `${this.baseUrl}/markNextArrived/${vehicleId}`,
      {}
    );
  }

}
