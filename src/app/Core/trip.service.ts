import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TripService {

  private readonly proxyBase = '/trip/';
  private readonly fallbackBase = environment.gatewayUrl
    ? `${environment.gatewayUrl.replace(/\/$/, '')}/trip/`
    : null;

  constructor(private http: HttpClient) {
  }

  createTrip(tripData: any, simpleUserId: number, driverId: number, headers: HttpHeaders): Observable<any> {
    const segment = `createTrip/${simpleUserId}/${driverId}`;
    return this.requestWithFallback('post', segment, tripData, headers);
  }

  // Get all trips for a specific user
  getTripsForUser(userId: number, headers: HttpHeaders): Observable<any[]> {
    const segment = `getTripsForUser/${userId}`;
    return this.requestWithFallback('get', segment, undefined, headers);
  }

  getTripsByVehicle(vehicleId: number, headers: HttpHeaders): Observable<any[]> {
    const segment = `getTripsByVehicle/${vehicleId}`;
    return this.requestWithFallback('get', segment, undefined, headers);
  }

  // Delete a trip by tripId
  deleteTrip(tripId: number, headers: HttpHeaders): Observable<void> {
    const segment = `deleteTrip/${tripId}`;
    return this.requestWithFallback('delete', segment, undefined, headers);
  }

  // Get all trips for a specific driver
  getTripsForDriver(driverId: number, headers: HttpHeaders): Observable<any[]> {
    const token = localStorage.getItem('token');
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    const segment = `getTripsForDriver/${driverId}`;
    return this.requestWithFallback('get', segment, undefined, headers);
  }

  getAllTrips(headers: HttpHeaders): Observable<any[]> {
    const segment = 'getAllTrips';
    return this.requestWithFallback('get', segment, undefined, headers);
  }

  acceptTrip(tripId: number, headers: HttpHeaders) {
    const segment = `acceptTrip/${tripId}`;
    return this.requestWithFallback('put', segment, {}, headers);
  }

  refuseTrip(tripId: number, headers: HttpHeaders) {
    const segment = `refuseTrip/${tripId}`;
    return this.requestWithFallback('put', segment, {}, headers);
  }

  completeTrip(tripId: number, headers: HttpHeaders) {
    const segment = `completeTrip/${tripId}`;
    return this.requestWithFallback('put', segment, {}, headers);
  }

  getTripById(tripId: number, headers: HttpHeaders): Observable<any> {
    const segment = `getTrip/${tripId}`;
    return this.requestWithFallback('get', segment, undefined, headers);
  }

  reachNextCheckpoint(vehicleId: number, headers: HttpHeaders): Observable<any> {
    const segment = `vehicle/markNextArrived/${vehicleId}`;
    return this.requestWithFallback('put', segment, {}, headers);
  }
  
  private requestWithFallback<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    segment: string,
    body: any,
    headers: HttpHeaders
  ): Observable<T> {
    const primaryUrl = `${this.proxyBase}${segment}`;
    const fallbackUrl = this.fallbackBase ? `${this.fallbackBase}${segment}` : null;

    const primary$ = this.dispatchRequest<T>(method, primaryUrl, body, headers);

    if (!fallbackUrl) {
      return primary$.pipe(catchError(error => throwError(() => error)));
    }

    return primary$.pipe(
      catchError(error => {
        if (error.status === 404) {
          return this.dispatchRequest<T>(method, fallbackUrl, body, headers);
        }
        return throwError(() => error);
      })
    );
  }

  private dispatchRequest<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    body: any,
    headers: HttpHeaders
  ): Observable<T> {
    switch (method) {
      case 'get':
        return this.http.get<T>(url, { headers });
      case 'post':
        return this.http.post<T>(url, body ?? {}, { headers });
      case 'put':
        return this.http.put<T>(url, body ?? {}, { headers });
      case 'delete':
        return this.http.delete<T>(url, { headers });
      default:
        return throwError(() => new Error(`Unsupported HTTP method: ${method}`));
    }
  }
}
