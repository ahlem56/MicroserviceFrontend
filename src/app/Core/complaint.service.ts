import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ComplaintService {

  private apiUrl = 'http://localhost:8089/examen/complaints/'; // Remplace par ton URL backend correcte

  constructor(private http: HttpClient) {}

  // Ajouter une réclamation
  addComplaint(complaintData: any, simpleUserId: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}add/${simpleUserId}`;
    return this.http.post(url, complaintData, { headers , responseType: 'json'});
  }

  // Mettre à jour une réclamation
  updateComplaint(complaintId: number, simpleUserId: number, updatedComplaint: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}update/${complaintId}/${simpleUserId}`;
    return this.http.put(url, updatedComplaint, { headers });
  }

  // Supprimer une réclamation
  deleteComplaint(complaintId: number, simpleUserId: number, headers: HttpHeaders): Observable<void> {
    const url = `${this.apiUrl}delete/${complaintId}/${simpleUserId}`;
    return this.http.delete<void>(url, { headers });
  }

  // Obtenir toutes les réclamations d'un utilisateur spécifique
  getComplaintsByUser(simpleUserId: number, headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}user/${simpleUserId}`;
    return this.http.get<any[]>(url, { headers });
  }

  // Répondre à une réclamation (Admin uniquement)
  respondToComplaint(complaintId: number, adminId: number, response: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}respond/${complaintId}/${adminId}`;
    return this.http.post(url, { response }, { headers , responseType: 'json'});
  }

  // Obtenir toutes les réclamations (Admin uniquement)
  getAllComplaints(headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

    // Ignorer une réclamation (Admin uniquement)
    ignoreComplaint(complaintId: number,adminId:number, headers: HttpHeaders): Observable<any> {
      const url = `${this.apiUrl}${complaintId}/ignore/${adminId}`;
      return this.http.put(url, {}, { headers });
    }

    getComplaintById(complaintId: number, headers: HttpHeaders): Observable<any> {
      const url = `${this.apiUrl}${complaintId}`;
      return this.http.get<any[]>(url, { headers });
    }
    


    // Obtenir les informations du SimpleUser à partir de l'ID d'une réclamation
    getUserByComplaintId(complaintId: number, headers: HttpHeaders): Observable<any> {
  const url = `${this.apiUrl}${complaintId}/user`;
  return this.http.get<any>(url, { headers });
}

}
