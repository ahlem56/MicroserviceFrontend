import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParcelService {

  private apiUrl = 'http://localhost:8089/examen/parcel/'; // Assurez-vous que l'URL est correcte

  constructor(private http: HttpClient) {}

  createParcel(parcelData: any, simpleUserId: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}createParcel/${simpleUserId}`;
    return this.http.post(url, parcelData, { headers });
  }
  // Get all trips for a specific driver
  getParcelForDriver(driverId: number, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}driver/${driverId}`;
    const token = localStorage.getItem('token');  // Get token from localStorage
  
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);  // Attach token to the headers
    }
  
    return this.http.get<any[]>(url, { headers });
  }
  getParcels(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}get-all-parcels`);
  }
  assignParcelToDriver(parcelId: number, driverId: number) {
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    });
    return this.http.put(`${this.apiUrl}assign/${parcelId}/${driverId}`, {}, { headers });
}

  getParcelsForUser(userId: number, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}user/${userId}`;
    return this.http.get<any[]>(url, { headers });
  }
  deleteParcel(parcelId: number, headers: HttpHeaders): Observable<void> {
    const url = `${this.apiUrl}delete/${parcelId}`;
  return this.http.delete<void>(url, { headers });
  }
  // Filtrer les colis après une certaine date
  getParcelsAfterDate(afterDate: string): Observable<any[]> {
    const url = `${this.apiUrl}after?date=${afterDate}`;
    return this.http.get<any[]>(url);
  }

  // Filtrer les colis avant une certaine date
  getParcelsBeforeDate(beforeDate: string): Observable<any[]> {
    const url = `${this.apiUrl}before?date=${beforeDate}`;
    return this.http.get<any[]>(url);
  }
 // Nombre de livraisons par jour
 getDeliveredParcelsByDay(date: string): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}countDeliveredParcelsByDay?date=${date}`);
}

// Nombre de livraisons par semaine
getDeliveredParcelsByWeek(date: string): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}countDeliveredParcelsByWeek?date=${date}`);
}

// Nombre de livraisons par mois
getDeliveredParcelsByMonth(date: string): Observable<number> {
  return this.http.get<number>(`${this.apiUrl}countDeliveredParcelsByMonth?date=${date}`);
}
// Méthode pour marquer un colis comme expédié (SHIPPED)
// Méthode pour marquer un colis comme expédié (SHIPPED)
markParcelAsShipped(parcelId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}${parcelId}/shipped`, {});
}
// Méthode pour marquer un colis comme  (DELIVERED)
markParcelAsDelivered(parcelId: number): Observable<any> {
  return this.http.put(`${this.apiUrl}${parcelId}/delivered`, {});
}
 
getParcelsByStatus(status: string): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}byStatus?status=${status}`);
}
getRevenueByMonth(): Observable<any> {
  const url = `${this.apiUrl}get-revenue-by-month`;
  return this.http.get<any>(url); // On suppose que l'API renvoie un objet avec les revenus par mois
}
/*estimatePrice(weight: number, category: string): Observable<any> {
  const url = 'http://localhost:5000/predict_price'; // API Python
  const body = { weight, category };

  return this.http.post<any>(url, body);
}*/

//DAMAGED PARCEL
// Ajout de la méthode pour signaler un colis endommagé
  reportDamagedParcel(parcelId: number, image: File, description: string): Observable<any> {
    const url = `${this.apiUrl}${parcelId}/report-damage`;

    const formData = new FormData();
    formData.append('image', image);
    formData.append('description', description);

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(url, formData, {
      headers: headers,
      responseType: 'text' // Traitement de la réponse comme texte brut
    });  }

// Méthode pour récupérer tous les colis endommagés
getDamagedParcels(): Observable<any[]> {
  const url = `${this.apiUrl}damaged`; // L'URL pour récupérer les colis endommagés
  const token = localStorage.getItem('authToken');  // Récupérer le token depuis localStorage

  let headers = new HttpHeaders();
  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);  // Ajouter le token aux headers
  }

  return this.http.get<any[]>(url, { headers });
}

// Add this method to your ParcelService
getParcelStatistics(date: string): Observable<{daily: number, weekly: number, monthly: number}> {
  return this.http.get<{daily: number, weekly: number, monthly: number}>(
    `${this.apiUrl}statistics?date=${date}`
  ).pipe(
    catchError(error => {
      console.error('Error fetching parcel statistics:', error);
      // Return default values if there's an error
      return of({
        daily: 0,
        weekly: 0,
        monthly: 0
      });
    })
  );
}

getTotalParcels(): Observable<number> {
  const url = `${this.apiUrl}total`;
  return this.http.get<any>(url);
}
downloadParcelPdf(parcelId: number): Observable<Blob> {
  const url = `${this.apiUrl}${parcelId}/pdf`;

  const headers = new HttpHeaders({
    'Accept': 'application/pdf',
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
  });

  return this.http.get(url, {
    headers: headers,
    responseType: 'blob'
  });
}
getDamagedParcelPercentage(): Observable<number> {
  const url = `${this.apiUrl}statistics/damaged-percentage`;
  return this.http.get<number>(url);
}
getParcel(parcelId: number): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  const url = `${this.apiUrl}find-parcel/${parcelId}`;
  return this.http.get<any>(url, { headers });
}

}


