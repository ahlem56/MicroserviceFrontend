import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Vehicle } from './vehicle.service';

export interface Driver {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  availability?: boolean;
  address?: string;
  cin?: string;
  profileImageUrl?: string;
  licenseNumber?: string;
  insuranceDetails?: string;
  averageRating?: number;
  vehicule?: Vehicle;
}

@Injectable({
  providedIn: 'root'
})
export class DriverService {
  private readonly baseUrl = 'http://localhost:8090/user-service/driver';

  constructor(private http: HttpClient) {}

  // ✅ Public endpoint — no token required
  getAvailableDrivers(): Observable<Driver[]> {
    const headers = new HttpHeaders({ 'Accept': 'application/json' });
    return this.http.get<Driver[]>(`${this.baseUrl}/get-available-drivers`, { headers })
      .pipe(catchError(this.handleError));
  }

  // ✅ Secured endpoint — requires JWT
  getAllDrivers(): Observable<Driver[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
    return this.http.get<Driver[]>(`${this.baseUrl}/get-all-drivers`, { headers })
      .pipe(catchError(this.handleError));
  }

  // ✅ Create driver
  createDriver(driver: Driver): Observable<Driver> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Driver>(`${this.baseUrl}/create`, driver, { headers })
      .pipe(catchError(this.handleError));
  }

  // ✅ Update driver
  updateDriver(driverId: number, driver: Driver): Observable<Driver> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<Driver>(`${this.baseUrl}/update/${driverId}`, driver, { headers })
      .pipe(catchError(this.handleError));
  }

  // ✅ Delete driver
  deleteDriver(driverId: number): Observable<void> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete<void>(`${this.baseUrl}/delete/${driverId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // ✅ Get driver by ID
  getDriverById(driverId: number): Observable<Driver> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
    return this.http.get<Driver>(`${this.baseUrl}/get/${driverId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // ✅ Get driver profile
  getDriverProfile(driverId: number): Observable<Driver> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    });
    return this.http.get<Driver>(`${this.baseUrl}/profile/${driverId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // 🔧 Generic error handler
  private handleError(error: any) {
    console.error('❌ API Error:', error);
    return throwError(() => new Error(error.message || 'Server Error'));
  }
}
