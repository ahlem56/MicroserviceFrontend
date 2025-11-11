import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Trip } from 'src/app/Models/trip.model';


@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly baseUrl = 'http://localhost:8090/trip';

  constructor(private http: HttpClient) {}

  // ----------------- BASIC CRUD -----------------

  getAllTrips(headers?: HttpHeaders): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/getAllTrips`, { headers });
  }

  createTrip(trip: Trip, token: string): Observable<Trip> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.post<Trip>(`${this.baseUrl}/createTrip`, trip, { headers });
  }

  updateTrip(tripId: number, trip: Trip, token: string): Observable<Trip> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    return this.http.put<Trip>(`${this.baseUrl}/updateTrip/${tripId}`, trip, { headers });
  }

  deleteTrip(tripId: number, headers?: HttpHeaders): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteTrip/${tripId}`, { headers });
  }

  getTripById(tripId: number, headers?: HttpHeaders): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/getTripById/${tripId}`, { headers });
  }

  // ----------------- FILTERED QUERIES -----------------

 getTripsForUser(userId: number, headers?: HttpHeaders): Observable<Trip[]> {
  const token = localStorage.getItem('token') || localStorage.getItem('authToken');
  const authHeaders = headers || new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.get<Trip[]>(`${this.baseUrl}/getTripsByUser/${userId}`, { headers: authHeaders });
}


  getTripsForDriver(driverId: number, headers?: HttpHeaders): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/getTripsByDriver/${driverId}`, { headers });
  }

  getTripsByVehicle(vehicleId: number, headers?: HttpHeaders): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/getTripsByVehicle/${vehicleId}`, { headers });
  }

  // ----------------- DRIVER ACTIONS -----------------

  acceptTrip(tripId: number, headers?: HttpHeaders): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/confirmTrip/${tripId}`, {}, { headers });
  }

  refuseTrip(tripId: number, headers?: HttpHeaders): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/declineTrip/${tripId}`, {}, { headers });
  }

  completeTrip(tripId: number, headers?: HttpHeaders): Observable<Trip> {
    return this.http.put<Trip>(`${this.baseUrl}/completeTrip/${tripId}`, {}, { headers });
  }

  reachNextCheckpoint(vehicleId: number, headers?: HttpHeaders): Observable<any> {
    return this.http.put(`${this.baseUrl}/reachNextCheckpoint/${vehicleId}`, {}, { headers });
  }
}
