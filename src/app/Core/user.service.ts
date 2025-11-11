import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

interface KeycloakRealmAccess {
  roles?: string[];
}

interface KeycloakResourceAccess {
  roles?: string[];
  [client: string]: any;
}

interface JwtPayload {
  sub: string;
  role?: string;
  userId?: number;
  partnerId?: number;
  iat: number;
  exp: number;
  email?: string;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: KeycloakRealmAccess;
  resource_access?: { [clientId: string]: KeycloakResourceAccess };
  [key: string]: any;
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

  // Use Angular dev proxy for CORS-free calls in dev
  private signinUrl = `/auth/login`;
  private signupUrl = `/auth/register`;
  // Symfony user-service exposes profile endpoints under /api
  private apiUrl = `/api`;

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const loginData: any = { username: email, password, email }; // send both fields to satisfy either contract
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
        localStorage.setItem('token', token);

        const decoded = parseJwt(token);

        let normalizedRole = response.role || decoded.role;
        if (!normalizedRole) {
          const realmRole = decoded.realm_access?.roles?.[0];
          const resourceRoles = decoded.resource_access
            ? Object.values(decoded.resource_access)
                .flatMap(access => access.roles || [])
            : [];
          normalizedRole = realmRole || resourceRoles[0];
        }
        if (normalizedRole) {
          normalizedRole = normalizedRole.replace(/^ROLE_/i, '').toUpperCase();
        } else {
          normalizedRole = 'USER';
        }
        if (normalizedRole === 'USER') {
          normalizedRole = 'USER';
        }
        localStorage.setItem('userRole', normalizedRole);

        const responseUser = response.user ?? response ?? {};
        const tokenFullName = decoded.name || response.name;
        const splitName =
          tokenFullName && tokenFullName.includes(' ')
            ? {
                first: tokenFullName.split(' ')[0],
                last: tokenFullName.split(' ').slice(1).join(' ')
              }
            : null;
        const emailValue = responseUser.email ?? decoded.email ?? response.email ?? '';
        const usernameValue = decoded.preferred_username ?? response.preferred_username ?? '';

        const deriveFromEmail = (value: string, takeLast = false) => {
          if (!value) return undefined;
          const base = value.split('@')[0] || value;
          const parts = base.split(/[.\-_]/).filter(Boolean);
          if (parts.length === 0) return undefined;
          const selected = takeLast ? parts[parts.length - 1] : parts[0];
          return selected.charAt(0).toUpperCase() + selected.slice(1);
        };

        const tokenFirstName =
          response.user?.firstName ??
          response.user?.firstname ??
          response.firstName ??
          response.firstname ??
          decoded.given_name ??
          (splitName?.first || undefined) ??
          deriveFromEmail(usernameValue || emailValue);

        const tokenLastName =
          response.user?.lastName ??
          response.user?.lastname ??
          response.lastName ??
          response.lastname ??
          decoded.family_name ??
          (splitName?.last || undefined) ??
          deriveFromEmail(usernameValue || emailValue, true);

        const userToStore = {
          ...responseUser,
          firstName: tokenFirstName ?? '',
          lastName: tokenLastName ?? '',
          email: responseUser.email ?? decoded.email ?? '',
          preferred_username: usernameValue || emailValue,
          userProfilePhoto: responseUser.userProfilePhoto ?? null,
        };

        const resolveIdValue = (value: any) => {
          if (value === null || value === undefined) {
            return undefined;
          }
          const numeric = Number(value);
          if (typeof value !== 'object' && !Number.isNaN(numeric) && String(value).trim() !== '') {
            return numeric;
          }
          return value;
        };

        const resolvedId = resolveIdValue(responseUser.id ?? decoded.userId ?? decoded.sub);
        const resolvedUserId = resolveIdValue(responseUser.userId ?? resolvedId);
        const resolvedDriverId = resolveIdValue(responseUser.driverId ?? resolvedUserId);

        userToStore.id = resolvedId;
        userToStore.userId = resolvedUserId;
        userToStore.driverId = resolvedDriverId;

        localStorage.setItem('user', JSON.stringify(userToStore));

        if (decoded.role && decoded.role !== normalizedRole) {
          console.warn('JWT role mismatch:', decoded.role, normalizedRole);
        }
      }),
      catchError(this.handleError)
    );
  }

  signup(signupData: any): Observable<any> {
    return this.http
      .post(this.signupUrl, signupData, { responseType: 'text' as 'json' })
      .pipe(
        map((raw: any) => {
          // Backend sometimes returns HTML with status 200 on errors; surface it gracefully
          try {
            const parsed = JSON.parse(raw as unknown as string);
            console.log('Response from backend (JSON):', parsed);
            return parsed;
          } catch {
            console.warn('Response from backend (non-JSON):', raw);
            return { message: raw };
          }
        }),
        catchError(this.handleError)
      );
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private resolveUserServiceUrl(path: string): string {
    if (path.startsWith('http')) {
      return path;
    }
    return `${environment.apiUrl}${path}`;
  }

  getUserProfile(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/profile`, { headers }).pipe(
      catchError((error) => {
        if (error.status === 404) {
          const fallbackUrl = this.resolveUserServiceUrl('/api/profile');
          return this.http.get<any>(fallbackUrl, { headers });
        }
        return this.handleError(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
  }

  refreshUserProfile(): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }

    return this.getUserProfile().pipe(
      tap((profile) => {
        if (!profile) {
          return;
        }

        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        const resolveIdValue = (value: any) => {
          if (value === null || value === undefined) {
            return undefined;
          }
          const numeric = Number(value);
          if (typeof value !== 'object' && !Number.isNaN(numeric) && String(value).trim() !== '') {
            return numeric;
          }
          return value;
        };

        const profileId = resolveIdValue(profile.id);
        const mergedUser = {
          ...storedUser,
          ...profile,
          id: profileId ?? storedUser.id,
          userId: profileId ?? storedUser.userId ?? storedUser.id,
          driverId: resolveIdValue(profile.driverId ?? storedUser.driverId ?? profileId ?? storedUser.userId ?? storedUser.id),
        };

        localStorage.setItem('user', JSON.stringify(mergedUser));
        document.dispatchEvent(new Event('updateProfileImage'));
      }),
      catchError((error) => {
        console.error('Failed to refresh user profile:', error);
        return of(null);
      })
    );
  }

  uploadProfileImage(photoDataUrl: string): Observable<any> {
    return this.updateUserProfile({ profilePhoto: photoDataUrl });
  }

  updateUserProfile(user: any): Observable<any> {
    const token = localStorage.getItem('token');
    if (!token) {
      return throwError(() => new Error('User not authenticated'));
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const payload: any = {};

    if (user.firstName !== undefined) payload.firstName = user.firstName;
    if (user.lastName !== undefined) payload.lastName = user.lastName;
    if (user.email !== undefined) payload.email = user.email;
    if (user.address !== undefined) payload.address = user.address;
    if (user.birthDate !== undefined) payload.birthDate = user.birthDate;
    if (user.partnerId !== undefined) payload.partnerId = user.partnerId;
    if (user.profilePhoto !== undefined) payload.profilePhoto = user.profilePhoto;

    return this.http.put<any>(`${this.apiUrl}/updateProfile`, payload, { headers }).pipe(
      catchError((error) => {
        if (error.status === 404) {
          const fallbackUrl = this.resolveUserServiceUrl('/api/updateProfile');
          return this.http.put<any>(fallbackUrl, payload, { headers });
        }
        return this.handleError(error);
      })
    );
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
    console.error('User service error:', error);

    if (error.status === 409) {
      const backendMessage = error.error?.message || error.error?.error;
      return throwError(() => new Error(backendMessage ?? 'An account already exists for this email address.'));
    }

    if (error.error instanceof ErrorEvent) {
      return throwError(() => new Error(`Client error: ${error.error.message}`));
    }

    const backendMessage = error.error?.message || error.error?.error;
    const statusMessage = backendMessage ?? error.message ?? 'An error occurred while processing your request.';
    return throwError(() => new Error(statusMessage));
  }

  getAllSimpleUsers() {
    return this.http.get<any[]>('http://localhost:8089/examen/simpleUser');
  }
  
  
}