import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ReclamationDTO {
  id?: number;
  // Extend these fields to match your backend DTO
  // example:
  // title?: string;
  // description?: string;
  // status?: 'PENDING' | 'RESOLVED' | 'IGNORED';
}

@Injectable({
  providedIn: 'root'
})
export class ReclamationService {

  private readonly baseUrl = environment.reclamationBaseUrl; // e.g., http://localhost:8090/reclamation-service/reclamations

  constructor(private http: HttpClient) {}

  // POST /reclamations
  create(dto: ReclamationDTO): Observable<ReclamationDTO> {
    return this.http.post<ReclamationDTO>(`${this.baseUrl}`, dto);
  }

  // GET /reclamations
  getAll(): Observable<ReclamationDTO[]> {
    return this.http.get<ReclamationDTO[]>(`${this.baseUrl}`);
  }

  // GET /reclamations/{id}
  getById(id: number): Observable<ReclamationDTO> {
    return this.http.get<ReclamationDTO>(`${this.baseUrl}/${id}`);
  }

  // PUT /reclamations/{id}
  update(id: number, dto: ReclamationDTO): Observable<ReclamationDTO> {
    return this.http.put<ReclamationDTO>(`${this.baseUrl}/${id}`, dto);
  }

  // DELETE /reclamations/{id}
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // GET /reclamations/welcome (for quick connectivity test)
  welcome(): Observable<string> {
    return this.http.get(`${this.baseUrl}/welcome`, { responseType: 'text' });
  }
}


