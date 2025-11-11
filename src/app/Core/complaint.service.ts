import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  // Direct base for DEV to avoid gateway 401/CORS
  private readonly baseUrl: string = (environment.reclamationBaseUrl || '').replace(/\/+$/, '');

  constructor(private http: HttpClient) {}

  private withBase<T>(path: string, op: (url: string) => Observable<T>): Observable<T> {
    const base = this.baseUrl;
    if (!base) {
      return throwError(() => new Error('Reclamation base URL not configured'));
    }
    return op(`${base}${path}`);
  }

  // Ajouter une réclamation
  addComplaint(complaintData: any, simpleUserId: number, headers: HttpHeaders): Observable<any> {
    // Reclamation MS: POST /reclamations
    return this.withBase('', (url) => this.http.post(url, complaintData, { headers, responseType: 'json' }));
  }

  // Mettre à jour une réclamation
  updateComplaint(complaintId: number, simpleUserId: number, updatedComplaint: any, headers: HttpHeaders): Observable<any> {
    return this.withBase(`/${complaintId}`, (url) => this.http.put(url, updatedComplaint, { headers, responseType: 'json' }));
  }

  // Supprimer une réclamation
  deleteComplaint(complaintId: number, simpleUserId: number, headers: HttpHeaders): Observable<void> {
    return this.withBase(`/${complaintId}`, (url) => this.http.delete<void>(url, { headers }));
  }

  // Obtenir toutes les réclamations d'un utilisateur spécifique
  getComplaintsByUser(simpleUserId: number, headers: HttpHeaders): Observable<any[]> {
    // Reclamation MS doesn't expose user-filtered endpoint; fallback to all
    return this.withBase('', (url) => this.http.get<any[]>(url, { headers }));
  }

  // Répondre à une réclamation (Admin uniquement)
  respondToComplaint(complaintId: number, adminId: number, response: string, headers: HttpHeaders): Observable<any> {
    // Not supported by Reclamation MS; return error observable
    throw new Error('respondToComplaint is not supported by the Reclamation microservice.');
  }

  // Obtenir toutes les réclamations (Admin uniquement)
  getAllComplaints(headers: HttpHeaders): Observable<any[]> {
    return this.withBase('', (url) => this.http.get<any[]>(url, { headers }));
  }

    // Ignorer une réclamation (Admin uniquement)
    ignoreComplaint(complaintId: number,adminId:number, headers: HttpHeaders): Observable<any> {
      // Not supported by Reclamation MS
      throw new Error('ignoreComplaint is not supported by the Reclamation microservice.');
    }

    getComplaintById(complaintId: number, headers: HttpHeaders): Observable<any> {
      return this.withBase(`/${complaintId}`, (url) => this.http.get<any[]>(url, { headers }));
    }
    


    // Obtenir les informations du SimpleUser à partir de l'ID d'une réclamation
    getUserByComplaintId(complaintId: number, headers: HttpHeaders): Observable<any> {
  // Not supported by Reclamation MS
  throw new Error('getUserByComplaintId is not supported by the Reclamation microservice.');
}

}
