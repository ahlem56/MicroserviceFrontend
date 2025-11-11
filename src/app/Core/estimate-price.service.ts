import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class EstimatePriceService {

  // URL de l'API Python qui renvoie le prix estimé
  private apiUrl = 'http://localhost:5000/predict_price';

  constructor(private http: HttpClient) { }

 
  estimatePrice(weight: number, category: string): Observable<any> {
    const body = { weight, category };
    return this.http.post<any>(this.apiUrl, body);
  }}
