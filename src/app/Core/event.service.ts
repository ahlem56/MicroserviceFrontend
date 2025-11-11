import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';

export interface AppEvent {
  id: number;  // Matches backend EventResponse.id (Long)
  title: string;  // Matches backend EventResponse.title
  description: string;  // Matches backend EventResponse.description
  location: string;  // Matches backend EventResponse.location
  startDate: string;  // Matches backend EventResponse.startDate (LocalDateTime)
  endDate: string;  // Matches backend EventResponse.endDate (LocalDateTime)
  published: boolean;  // Matches backend EventResponse.published

  // Frontend-only/optional fields
  currentParticipants?: number;
  registered?: boolean;
  maxParticipants?: number;
  simpleUsers?: { userId: number }[];
  photo?: string | null;
}

export interface EventPayload {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  published: boolean;
  photo?: string | null;
}

@Injectable({ providedIn: 'root' })
export class EventService {
  private apiUrl = '/event-service/events';
  private gatewayEventUrl = 'http://localhost:8090/event-service/events';
  private eventsSubject = new BehaviorSubject<AppEvent[]>([]);
  public events$ = this.eventsSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Don't load events on service initialization - wait for user to be authenticated
    // this.loadInitialEvents();
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000; // Convert to milliseconds
      const now = Date.now();
      // Check if token expires in less than 1 minute
      return exp < (now + 60000);
    } catch {
      return true; // If we can't parse, assume expired
    }
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('No authentication token found. Please log in.');
    }
    
    // Check if token is expired or about to expire
    if (this.isTokenExpired(token)) {
      console.warn('Token expired or about to expire. Please log in again.');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      this.router.navigate(['/login']);
      throw new Error('Token expired. Please log in again.');
    }
    
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  private loadInitialEvents(): void {
    try {
      const headers = this.getAuthHeaders();
      this.http.get<AppEvent[]>(this.apiUrl, { headers }).pipe(
        tap(events => this.eventsSubject.next(events)),
        catchError(this.handleError)
      ).subscribe();
    } catch (error) {
      console.warn('Cannot load events: User not authenticated');
    }
  }

  getAllEvents(): Observable<AppEvent[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<AppEvent[]>(this.apiUrl, { headers }).pipe(
      tap(events => this.eventsSubject.next(events)),
      catchError(this.handleError)
    );
  }

  private enhanceEvent(event: AppEvent): AppEvent {
    if (!event) {
      throw new Error('Event payload is empty.');
    }
    return {
      ...event,
      currentParticipants: event.currentParticipants ?? (event.simpleUsers?.length ?? 0)
    };
  }

  private gatewayHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  createEvent(event: EventPayload): Observable<AppEvent> {
    const headers = this.getAuthHeaders();
    return this.http.post<AppEvent>(this.apiUrl, event, { headers }).pipe(
      tap(() => this.loadInitialEvents()),
      catchError(this.handleError)
    );
  }

  updateEvent(id: number, event: EventPayload): Observable<AppEvent> {
    const headers = this.getAuthHeaders();
    return this.http.put<AppEvent>(`${this.apiUrl}/${id}`, event, { headers }).pipe(
      tap(() => this.loadInitialEvents()),
      catchError(err => {
        console.warn('Primary event update failed, attempting gateway fallback…', err);
        return this.http.put<AppEvent>(`${this.gatewayEventUrl}/${id}`, event, {
          headers: this.gatewayHeaders()
        }).pipe(
          tap(() => this.loadInitialEvents()),
          catchError(innerErr => this.handleError(innerErr))
        );
      })
    );
  }

  deleteEvent(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers }).pipe(
      tap(() => this.loadInitialEvents()),
      catchError(this.handleError)
    );
  }

  // ⚠️ WARNING: Register/unregister endpoints are NOT in the backend EventController
  // These methods will return 404 until endpoints are added to the backend:
  // @PostMapping("/{eventId}/register/{userId}") in EventController
  // @PostMapping("/{eventId}/unregister/{userId}") in EventController
  register(eventId: number, userId: number): Observable<AppEvent> {
    console.warn('⚠️ Register endpoint not implemented in backend EventController');
    const headers = this.getAuthHeaders();
    return this.http.post<AppEvent>(`${this.apiUrl}/${eventId}/register/${userId}`, {}, { headers }).pipe(
      tap(() => this.loadInitialEvents()),
      catchError(this.handleError)
    );
  }

  unregister(eventId: number, userId: number): Observable<AppEvent> {
    console.warn('⚠️ Unregister endpoint not implemented in backend EventController');
    const headers = this.getAuthHeaders();
    return this.http.post<AppEvent>(`${this.apiUrl}/${eventId}/unregister/${userId}`, {}, { headers }).pipe(
      tap(() => this.loadInitialEvents()),
      catchError(this.handleError)
    );
  }

  getEventById(id: number): Observable<AppEvent> {
    const cached = this.eventsSubject.value.find(evt => evt.id === id);
    const headers = this.getAuthHeaders();
    return this.http.get<AppEvent>(`${this.apiUrl}/${id}`, { headers }).pipe(
      map(evt => this.enhanceEvent(evt)),
      catchError(err => {
        console.warn('Primary event fetch failed, attempting gateway fallback…', err);
        return this.http.get<AppEvent>(`${this.gatewayEventUrl}/${id}`, {
          headers: this.gatewayHeaders()
        }).pipe(
          map(evt => this.enhanceEvent(evt)),
          catchError(innerErr => {
            if (cached) {
              console.warn('Gateway fetch failed, falling back to cached event payload', innerErr);
              return of(this.enhanceEvent(cached));
            }
            return this.handleError(innerErr);
          })
        );
      })
    );
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error instanceof HttpErrorResponse && error.status === 401) {
      console.warn('Authentication failed. Token may be expired. Redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('user');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return throwError(() => 'Session expired. Please log in again.');
    }
    
    return throwError(() => error.error?.message || error.message || 'Server error');
  }

  joinEvent(eventId: number, userId: number): Observable<AppEvent> {
    return this.register(eventId, userId);
  }

  leaveEvent(eventId: number, userId: number): Observable<AppEvent> {
    return this.unregister(eventId, userId);
  }


  getFeaturedEvent(): Observable<AppEvent | null> {
    return this.getAllEvents().pipe(
      map(events => {
        if (events.length === 0) {
          return null;
        }
        const now = Date.now();
        const enhance = (event: AppEvent) => ({
          ...event,
          currentParticipants: event.currentParticipants ?? (event.simpleUsers?.length ?? 0)
        });
        const enhancedEvents = events.map(enhance);
        const upcoming = enhancedEvents
          .filter(evt => {
            const start = evt.startDate ? new Date(evt.startDate).getTime() : NaN;
            return !isNaN(start) && start >= now;
          })
          .sort((a, b) => {
            const aDate = new Date(a.startDate).getTime();
            const bDate = new Date(b.startDate).getTime();
            return aDate - bDate;
          });
        if (upcoming.length > 0) {
          return upcoming[0];
        }
        return enhancedEvents
          .sort((a, b) => {
            const aDate = a.startDate ? new Date(a.startDate).getTime() : 0;
            const bDate = b.startDate ? new Date(b.startDate).getTime() : 0;
            return bDate - aDate;
          })[0];
      }),
      catchError(this.handleError)
    );
  }
}
