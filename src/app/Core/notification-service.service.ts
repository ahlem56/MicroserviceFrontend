import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ToastNotificationComponent } from '../Shared/toast-notification/toast-notification.component';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private sseEmitter: EventSource | null = null;
  private toastSubject = new Subject<string>(); // Will emit toast messages
  private newNotificationSubject = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  public emitNewNotification(isNew: boolean) {
    this.newNotificationSubject.next(isNew);
  }

  // Connect to the SSE notifications
  public connectToNotifications(userId: string): Observable<any> {
    return new Observable<any>((observer) => {
      this.sseEmitter = new EventSource(`http://localhost:8089/examen/notifications/stream?userId=${userId}`);
  
      this.sseEmitter.onmessage = (event) => {
        if (event.data === 'Connected to SSE stream.') {
          return;
        }
  
        try {
          const messageData = JSON.parse(event.data);
          this.emitNewNotification(true);
           // Shiped Parcel notification
          if (messageData.parcelStatus) {
            this.toastSubject.next(
              `Parcel #${messageData.parcelId}: Status updated to ${messageData.parcelStatus}`
            );
          }
          // Handle trip refusal notification
          if (messageData.refused) {
            this.toastSubject.next(
              `Your trip from ${messageData.departure} to ${messageData.destination} has been refused.`
            );
          }
          // Handle event creation notification
          else if (messageData.eventDescription) {
            this.toastSubject.next(
              `New event: ${messageData.eventDescription}`
            );
          }
          // Handle confirmed trip notification (now checking details)
          else if (messageData.details) {
            const details = messageData.details;
            this.toastSubject.next(
              `Your trip from ${details.departure} to ${details.destination} has been confirmed! ` +
              `Departure: ${details.departure}, Price: ${details.price} TND, ` +
              `Passengers: ${details.passengers}`
            );
          }

          // Handle carpool joined notification
          else if (messageData.type === 'CARPOOL_JOINED' && messageData.details) {
            const details = messageData.details;
            this.toastSubject.next(
              `${messageData.message} (Carpool #${details.carpoolId})`
            );
          }
          // Handle carpool left notification
          else if (messageData.type === 'CARPOOL_LEFT' && messageData.details) {
            const details = messageData.details;
            this.toastSubject.next(
              `${messageData.message} (Carpool #${details.carpoolId})`
            );
          }
          // Handle carpool deleted notification
          else if (messageData.type === 'CARPOOL_DELETED' && messageData.details) {
            const details = messageData.details;
            this.toastSubject.next(
              `${messageData.message} (Carpool #${details.carpoolId})`
            );
          }
          // Handle recommended carpool notification
          else if (messageData.type === 'CARPOOL_RECOMMENDED' && messageData.details) {
            const details = messageData.details;
            this.toastSubject.next(
              `Recommended carpool: From ${details.departure} to ${details.destination} on ${details.date} at ${details.time} for ${details.price} TND`
            );
          }

          // Handle trip reminder notification
else if (messageData.type === 'TRIP_REMINDER') {
  this.toastSubject.next(
    `⏰ Reminder: Your trip from ${messageData.details.departure} to ${messageData.details.destination} starts at ${messageData.details.date}`
  );
}

  
          observer.next(messageData);
        } catch (e) {
          console.error('Error parsing message:', e, event.data);
        }
      };

      // Handle error event properly
      this.sseEmitter.onerror = (error) => {
        console.error('SSE connection error:', error);
        observer.error(error);
      };
  
      this.sseEmitter.onopen = () => {
        console.log('Connection opened');
      };
    });
  }

  public getNewNotificationStatus(): Observable<boolean> {
    return this.newNotificationSubject.asObservable();
  }

  // Method to subscribe to toast messages
  public getToastMessages(): Observable<string> {
    return this.toastSubject.asObservable();
  }

  // Close the SSE connection
  public closeConnection() {
    if (this.sseEmitter) {
      this.sseEmitter.close();
    }
  }

  public getStoredNotifications(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`http://localhost:8089/examen/notifications/all?userId=${userId}`);
  }
}