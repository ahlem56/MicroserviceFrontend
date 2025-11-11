import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Driver } from './driver.service';

export interface Vehicle {
  vehiculeId?: number;
  vehicleType?: string;
  vehicleModel?: string;
  vehicleCapacity?: number;
  vehiculeMaintenanceDate?: Date;
  vehiculeInsuranceStatus?: boolean;
  vehiculeInsuranceDate?: Date;
  driver?: Driver;
  latitude?: number;
  longitude?: number;
  updateTime?: Date;
  vehicleSerialNumber?: number;
  travelHistory?: LocationRecord[];
  // Optional text versions from backend
  insuranceStatusText?: string;
  // Backend entity fields (from Vehicule model)
  model?: string;
  capacity?: number;
  serialNumber?: number;
  maintenanceDate?: Date;
  insuranceStatus?: string;
  driverId?: number;
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
  // Route via Angular proxy -> API Gateway -> vehicule-service
  // Matches VehiculeController @RequestMapping("/vehicules")
  private baseUrl = '/vehicule-service/vehicules';

  constructor(private http: HttpClient) { }

  private normalizeVehicle(raw: any): Vehicle {
    console.log('Normalizing raw vehicle:', raw);
    
    // Extract ID - prioritize backend field names
    const id = raw.vehiculeId ?? raw.id ?? raw.vehicleId ?? raw.vehicle_id ?? null;
    
    // Extract type - backend may not have this, default to UNKNOWN
    const type = raw.vehicleType ?? raw.vehiculeType ?? raw.type ?? raw.vehicle_type ?? raw.vehicletype ?? null;
    
    // Extract model - backend uses 'model', frontend uses 'vehicleModel'
    const model = raw.model ?? raw.vehicleModel ?? raw.modelName ?? raw.vehicle_model ?? null;
    const modelStr = model && String(model).trim() ? String(model).trim() : 'Unknown';
    
    // Extract capacity - backend uses 'capacity', frontend uses 'vehicleCapacity'
    const capacity = raw.capacity ?? raw.vehicleCapacity ?? raw.seats ?? raw.vehicle_capacity ?? null;
    const capacityNum = capacity != null ? (typeof capacity === 'string' ? parseInt(capacity, 10) : Number(capacity)) : 0;
    // Handle NaN
    const capacityFinal = isNaN(capacityNum) ? 0 : capacityNum;
    
    // Extract insurance status - backend uses 'insuranceStatus' (string), frontend uses 'vehiculeInsuranceStatus' (boolean)
    const insuranceStr = raw.insuranceStatus ?? raw.vehiculeInsuranceStatus ?? raw.insured ?? raw.vehicule_insurance_status ?? null;
    
    // Convert diverse insurance representations to boolean
    const insuranceBool = (() => {
      if (typeof insuranceStr === 'boolean') return insuranceStr;
      if (insuranceStr == null) return false;
      const s = String(insuranceStr).trim().toLowerCase();
      if (!s) return false;
      if (['valid', 'active', 'yes', 'true', 'insured', 'ok'].includes(s)) return true;
      if (['expired', 'no', 'false', 'uninsured', 'invalid'].includes(s)) return false;
      // Fallback: any non-empty string treated as true
      return true;
    })();

    // Extract other fields
    const serialNumber = raw.serialNumber ?? raw.vehicleSerialNumber ?? raw.serial_number ?? null;
    const maintenanceDate = raw.maintenanceDate ?? raw.vehiculeMaintenanceDate ?? raw.maintenance_date ?? null;
    const driverId = raw.driverId ?? raw.driver?.id ?? null;

    const normalized: Vehicle = {
      vehiculeId: id,
      vehicleType: type && String(type).trim() ? String(type).toUpperCase() : 'UNKNOWN',
      vehicleModel: modelStr,
      vehicleCapacity: capacityFinal,
      vehiculeInsuranceStatus: insuranceBool,
      insuranceStatusText: typeof insuranceStr === 'string' ? insuranceStr : (insuranceBool ? 'VALID' : 'EXPIRED'),
      vehiculeMaintenanceDate: maintenanceDate,
      vehiculeInsuranceDate: raw.vehiculeInsuranceDate ?? raw.insuranceDate ?? raw.insurance_date ?? null,
      driver: raw.driver ?? null,
      latitude: raw.latitude ?? null,
      longitude: raw.longitude ?? null,
      updateTime: raw.updateTime ?? raw.updatedAt ?? raw.updated_at ?? null,
      vehicleSerialNumber: serialNumber,
      travelHistory: raw.travelHistory ?? null,
      // Preserve original backend fields for fallback access
      model: raw.model ?? modelStr,
      capacity: capacityFinal,
      serialNumber: serialNumber,
      maintenanceDate: maintenanceDate,
      insuranceStatus: typeof insuranceStr === 'string' ? insuranceStr : (insuranceBool ? 'VALID' : 'EXPIRED'),
      driverId: driverId
    };
    
    console.log('Normalized result:', normalized);
    return normalized;
  }

  // CREATE
  createVehicle(vehicleData: any): Observable<Vehicle> {
    console.log('createVehicle - Input vehicleData:', vehicleData);
    
    // Format date to YYYY-MM-DD if it's a Date object or includes time
    const formatDate = (dateValue: any): string | null => {
      if (!dateValue) return null;
      if (typeof dateValue === 'string') {
        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;
        // If it includes time, extract just the date part
        return dateValue.split('T')[0];
      }
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
      }
      return null;
    };
    
    // Map frontend fields to backend Vehicule fields
    const payload: any = {
      model: vehicleData.vehicleModel ?? vehicleData.model ?? null,
      capacity: vehicleData.vehicleCapacity ?? vehicleData.capacity ?? null,
      serialNumber: vehicleData.vehicleSerialNumber ?? vehicleData.serialNumber ?? null,
      maintenanceDate: formatDate(vehicleData.vehiculeMaintenanceDate ?? vehicleData.maintenanceDate),
      insuranceStatus: (() => {
        const v = vehicleData.vehiculeInsuranceStatus ?? vehicleData.insuranceStatus;
        if (typeof v === 'string') return v.toUpperCase();
        if (v === true || v === 'true') return 'VALID';
        if (v === false || v === 'false') return 'EXPIRED';
        return 'EXPIRED'; // default
      })(),
      driverId: vehicleData.driverId ?? vehicleData.driver?.id ?? null
    };
    
    // Remove null values that might cause issues (except driverId which can be null)
    Object.keys(payload).forEach(key => {
      if (payload[key] === null && key !== 'driverId') {
        delete payload[key];
      }
    });
    
    console.log('createVehicle - Payload being sent to backend:', payload);

    return this.http.post<any>(`${this.baseUrl}`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(raw => {
        console.log('createVehicle - Backend response:', raw);
        const normalized = this.normalizeVehicle(raw);
        console.log('createVehicle - Normalized result:', normalized);
        return normalized;
      })
    );
  }

  // READ
  getAllVehicles(): Observable<Vehicle[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(res => {
        console.log('Raw backend response:', res);
        const items =
          Array.isArray(res) ? res :
          Array.isArray(res?.data) ? res.data :
          Array.isArray(res?.content) ? res.content :
          Array.isArray(res?._embedded?.vehicules) ? res._embedded.vehicules :
          [];
        console.log('Extracted items array:', items);
        if (items.length > 0) {
          console.log('First raw vehicle from backend:', items[0]);
        }
        const normalized = items.map((v: any) => {
          const normalized = this.normalizeVehicle(v);
          console.log('Normalized vehicle:', normalized);
          return normalized;
        });
        return normalized;
      })
    );
  }

  getVehicleById(id: number): Observable<Vehicle> {
    // Backend doesn't have GET by ID endpoint, so fetch all and filter
    // TODO: Backend should add @GetMapping("/{id}") endpoint
    return this.getAllVehicles().pipe(
      map(vehicles => {
        const vehicle = vehicles.find(v => v.vehiculeId === id);
        if (!vehicle) {
          throw new Error(`Vehicle with id ${id} not found`);
        }
        return vehicle;
      })
    );
  }

  // UPDATE
  updateVehicle(id: number, vehicle: Vehicle): Observable<Vehicle> {
    console.log('updateVehicle - Input id:', id, 'vehicle:', vehicle);
    
    // Format date to YYYY-MM-DD if it's a Date object or includes time
    const formatDate = (dateValue: any): string | null => {
      if (!dateValue) return null;
      if (typeof dateValue === 'string') {
        // If it's already in YYYY-MM-DD format, return as is
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) return dateValue;
        // If it includes time, extract just the date part
        return dateValue.split('T')[0];
      }
      if (dateValue instanceof Date) {
        return dateValue.toISOString().split('T')[0];
      }
      return null;
    };
    
    // Map frontend fields to backend Vehicule fields (same as create)
    const payload: any = {
      model: vehicle.vehicleModel ?? vehicle.model ?? null,
      capacity: vehicle.vehicleCapacity ?? vehicle.capacity ?? null,
      serialNumber: vehicle.vehicleSerialNumber ?? vehicle.serialNumber ?? null,
      maintenanceDate: formatDate(vehicle.vehiculeMaintenanceDate ?? vehicle.maintenanceDate),
      insuranceStatus: (() => {
        const v = vehicle.vehiculeInsuranceStatus ?? vehicle.insuranceStatus;
        if (typeof v === 'string') return v.toUpperCase();
        if (v === true) return 'VALID';
        if (v === false) return 'EXPIRED';
        if (v === 'true') return 'VALID';
        if (v === 'false') return 'EXPIRED';
        return 'EXPIRED'; // default
      })(),
      driverId: vehicle.driverId ?? (vehicle.driver as any)?.id ?? null
    };
    
    // Remove null values that might cause issues (except driverId which can be null)
    Object.keys(payload).forEach(key => {
      if (payload[key] === null && key !== 'driverId') {
        delete payload[key];
      }
    });
    
    console.log('updateVehicle - Payload being sent to backend:', payload);

    return this.http.put<any>(`${this.baseUrl}/${id}`, payload, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }).pipe(
      map(raw => {
        console.log('updateVehicle - Backend response:', raw);
        const normalized = this.normalizeVehicle(raw);
        console.log('updateVehicle - Normalized result:', normalized);
        return normalized;
      })
    );
  }

  // DELETE
  deleteVehicle(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // ASSIGN
  assignToDriver(vehicleId: number, driverId: number): Observable<Vehicle> {
    // Backend doesn't have /assign endpoint, so update the vehicle's driverId via PUT
    // First get the vehicle, then update it with the driverId
    console.log('assignToDriver - vehicleId:', vehicleId, 'driverId:', driverId);
    return this.getVehicleById(vehicleId).pipe(
      switchMap(vehicle => {
        // Update vehicle with driverId
        const updatedVehicle: Vehicle = {
          ...vehicle,
          driverId: driverId
        };
        console.log('assignToDriver - Updated vehicle:', updatedVehicle);
        // Use the update endpoint to set driverId
        return this.updateVehicle(vehicleId, updatedVehicle);
      })
    );
  }

  getAvailableVehicles(): Observable<Vehicle[]> {
    // Backend doesn't have /available endpoint, so fetch all and filter for unassigned vehicles
    // TODO: Backend should add @GetMapping("/available") endpoint
    return this.getAllVehicles().pipe(
      map(vehicles => vehicles.filter(v => !v.driverId || v.driverId === null))
    );
  }

  updateLocation(vehicleId: number, latitude: number, longitude: number): Observable<Vehicle> {
    const params = new HttpParams()
      .set('latitude', latitude.toString())
      .set('longitude', longitude.toString());

    return this.http.put<Vehicle>(
      `${this.baseUrl}/${vehicleId}/location`,
      null,
      { params }
    );
  }

  getCheckpointsStatus(vehicleId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/${vehicleId}/checkpointsStatus`);
  }

  getTripDepartureAndDestination(tripId: number): Observable<TripCoords> {
    return this.http.get<TripCoords>(`${this.baseUrl}/trip-coordinates/${tripId}`);
  }

  // Fetch vehicles with expired insurance
  getVehiclesWithExpiredInsurance(): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.baseUrl}/expired-insurance`);
  }

  saveCheckpoints(
    vehicleId: number,
    checkpoints: LocationRecord[]
  ): Observable<Vehicle> {
    return this.http.post<Vehicle>(
      `${this.baseUrl}/${vehicleId}/saveCheckpoints`,
      checkpoints
    );
  }

  markNextArrived(vehicleId: number): Observable<Vehicle> {
    return this.http.put<Vehicle>(
      `${this.baseUrl}/${vehicleId}/markNextArrived`,
      {}
    );
  }

}
