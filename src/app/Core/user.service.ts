import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface JwtPayload {
  sub: string;
  role: string;
  userId?: number;
  partnerId?: number;
  iat: number;
  exp: number;
}

function parseJwt(token: string): JwtPayload {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    throw new Error('Invalid JWT');
  }
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private signinUrl = `${environment.apiUrl}/auth/login`;
private signupUrl = `${environment.apiUrl}/auth/register`;
  private apiUrl = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
const loginData = { username: email, password };
    return this.http.post(this.signinUrl, loginData).pipe(
      tap((response: any) => {
        console.log('Response from server:', response);
        let token = response.token;
        if (token && token.startsWith('Bearer ')) {
          token = token.split(' ')[1]; // Extract raw token
        } else if (!token) {
          console.error('No token in response:', response);
          throw new Error('No token provided by server');
        } else {
          console.warn('Token format unexpected, using as-is:', token);
        }
        console.log('Storing token:', token);
// Replace this
localStorage.setItem('token', token);

// Add this line too (so all code paths work)
localStorage.setItem('authToken', token);

        let normalizedRole = response.role;
        if (normalizedRole) {
          normalizedRole = normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1).toLowerCase();
          if (normalizedRole.toLowerCase() === 'user') {
            normalizedRole = 'USER';
          }
        }
        localStorage.setItem('userRole', normalizedRole);
        localStorage.setItem('user', JSON.stringify(response.user));


        const decoded = parseJwt(token);
        if (decoded.role !== normalizedRole) {
          console.warn('JWT role mismatch:', decoded.role, normalizedRole);
        }
      }),
      catchError(this.handleError)
    );
  }

  signup(signupData: any): Observable<any> {
    return this.http.post<any>(this.signupUrl, signupData).pipe(
      map(response => {
        console.log('Response from backend:', response);
        return response;
      }),
      catchError(this.handleError)
    );
  }



  getUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers }).pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  }

  uploadProfileImage(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(`${this.apiUrl}/upload-profile-photo`, formData, { headers }).pipe(catchError(this.handleError));
  }

  updateUserProfile(user: any): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put<any>(`${this.apiUrl}/update-profile`, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      address: user.address,
      birthDate: user.birthDate,
      partnerId: user.partnerId || null
    }, { headers }).pipe(catchError(this.handleError));
  }

  sendSOS(): Observable<any> {
    const phoneNumber = '50695322';
    const carrierGateway = 'vtext.com';
    const message = 'SOS Alert! My location is: https://www.google.com/maps?q=LAT,LONG';
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.id) {
      return this.http.post(`${environment.apiUrl}/sos/sendSos`, {
        phoneNumber,
        carrierGateway,
        message,
        userId: user.id
      }).pipe(catchError(this.handleError));
    } else {
      return throwError(() => new Error('User not found'));
    }
  }

  private handleError(error: any): Observable<never> {
    let errorMessage = 'An error occurred while processing your request.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      errorMessage = `Server error: ${error.status} - ${error.error?.message || error.message}`;
    }
    console.error('User service error:', error);
    return throwError(() => new Error(errorMessage));
  }

  getAllSimpleUsers() {
    return this.http.get<any[]>('http://localhost:8089/examen/simpleUser');
  }
  
  
}