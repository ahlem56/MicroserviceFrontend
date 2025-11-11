import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CarpoolService {

  private apiUrl = `http://localhost:8089/examen/carpools/`;

  constructor(private http: HttpClient) { }

  createCarpool(carpoolData: any, simpleUserId: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}add/${simpleUserId}`;
    return this.http.post(url, carpoolData, { headers, responseType: 'text' as 'json' });
  }
  getCarpoolsForUser(simpleUserId: number, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}getCarpoolsForUser/${simpleUserId}`;
    return this.http.get<any[]>(url, { headers });
  }

  deleteCarpool(carpoolId: number, offerId: number, headers: HttpHeaders): Observable<void> {
    const url = `${this.apiUrl}delete/${carpoolId}/${offerId}`;
    return this.http.delete<void>(url, { headers });
  }

  getAllCarpools(): Observable<any[]> {
    const token = localStorage.getItem('token');
    
    if (!token) {
      console.error("❌ Aucun token trouvé !");
      return new Observable(observer => {
        observer.error("No authentication token found");
        observer.complete();
      });
    }

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');

    console.log("🔍 Headers envoyés:", headers);
    const url = `${this.apiUrl}get`;
    return this.http.get<any[]>(url, { headers }).pipe(
      tap((data) => console.log("📥 Réponse API - Tous les Carpools:", data))
    );
  }

  joinCarpool(carpoolId: number, simpleUserId: number, numberOfPlaces: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}join/${carpoolId}/${simpleUserId}`;
    return this.http.post<any>(url, numberOfPlaces, { headers }).pipe(
      tap((data) => console.log("📥 Réponse API - Covoiturage rejoint:", data)),
      catchError(error => {
        console.error("Erreur lors de l'inscription au covoiturage", error);
        return throwError(() => error);
      })
    );
  }

  getFutureCarpools(userId: number, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}future?userId=${userId}`;
    return this.http.get<any[]>(url, { headers }).pipe(
      tap((data) => console.log("📥 Réponse API - Futurs Carpools:", data)),
      catchError(error => {
        console.error("Erreur lors du chargement des futurs covoiturages", error);
        return throwError(() => error);
      })
    );
  }

  getCarpoolById(carpoolId: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}get/${carpoolId}`;
    return this.http.get(url, { headers });
  }

  getCarpoolOfferer(carpoolId: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}${carpoolId}/offreur`;
    return this.http.get<any>(url, { headers });
  }

  getCarpoolsByUser(userId: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}user/${userId}`;
    return this.http.get<any>(url, { headers });
  }

  leaveCarpool(carpoolId: number, userId: number, headers: HttpHeaders): Observable<void> {
    const url = `${this.apiUrl}leave/${carpoolId}/${userId}`;
    return this.http.delete<void>(url, { headers });
  }

  updateCarpool(carpoolId: number, userId: number, carpoolData: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}update/${carpoolId}/${userId}`;
    return this.http.put(url, carpoolData, { headers }).pipe(
      catchError(error => {
        console.error("Update carpool failed", error);
        return throwError(() => error);
      })
    );
  }

  getUsersWhoJoinedCarpool(carpoolId: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}${carpoolId}/users`;
    return this.http.get<any>(url, { headers }).pipe(
      tap((data) => console.log("📥 Réponse API - Utilisateurs ayant rejoint le covoiturage:", data)),
      catchError(error => {
        console.error("Erreur lors de la récupération des utilisateurs ayant rejoint le covoiturage", error);
        return throwError(() => error);
      })
    );
  }

  getCarpoolsJoinedByUser(userId: number, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}joined/${userId}`;
    return this.http.get<any[]>(url, { headers }).pipe(
      tap((data) => console.log("📥 Réponse API - Covoiturages rejoints par l'utilisateur:", data)),
      catchError(error => {
        console.error("Erreur lors de la récupération des covoiturages rejoints par l'utilisateur", error);
        return throwError(() => error);
      })
    );
  }

  getRecommendedCarpools(userId: number, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}recommended/${userId}`;
    return this.http.get<any[]>(url, { headers });
  }

  rateCarpool(carpoolId: number, userId: number, liked: boolean, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}rate`;
    const body = { carpoolId, userId, liked };
    return this.http.post<any>(url, body, { headers }).pipe(
      tap((data) => console.log("📥 Réponse API - Notation soumise:", data)),
      catchError(error => {
        console.error("Erreur lors de la soumission de la note", error);
        return throwError(() => error);
      })
    );
  }

  getCarpoolRatings(carpoolId: number, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}${carpoolId}/ratings`;
    return this.http.get<any[]>(url, { headers }).pipe(
      tap((data) => console.log("📥 Réponse API - Notations du covoiturage:", data)),
      catchError(error => {
        console.error("Erreur lors de la récupération des notations du covoiturage", error);
        return throwError(() => error);
      })
    );
  }

  getOffererRating(offererId: number, headers: HttpHeaders): Observable<string> {
    const url = `${this.apiUrl}offerer/${offererId}/rating`;
    return this.http.get<string>(url, { headers }).pipe(
      tap((data) => console.log("📥 Réponse API - Note de l'offreur:", data)),
      catchError(error => {
        console.error("Erreur lors de la récupération de la note de l'offreur", error);
        return throwError(() => error);
      })
    );
  }

  
}