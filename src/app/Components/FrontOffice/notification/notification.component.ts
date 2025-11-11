import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/Core/notification-service.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  imports: [CommonModule],
})
export class NotificationFrontOfficeComponent implements OnInit, OnDestroy {
  notifications: any[] = [];
  showRecommendedNotifications: boolean = true; // Default to showing recommended notifications
  errorMessage: string = '';

  constructor(
    private notificationService: NotificationService,
    private http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.userId;
    this.showRecommendedNotifications = localStorage.getItem('showRecommendedNotifications') !== 'false';

    // Load stored notifications first
    try {
      const storedNotifications = await this.notificationService
        .getStoredNotifications(userId)
        .toPromise();
      
      if (storedNotifications) {
        this.notifications = storedNotifications
          .map(notification => {
            try {
              const content = JSON.parse(notification.notificationContent);
              console.log('Stored notification for user', userId, ':', content); // Debug
              return this.mapNotification(content);
            } catch (e) {
              console.error('Error parsing notification content for user', userId, ':', e);
              return null;
            }
          })
          .filter(n => n !== null) as any[];
      } else {
        console.warn('No stored notifications for user', userId);
      }
    } catch (error) {
      console.error('Error loading stored notifications for user', userId, ':', error);
      this.errorMessage = 'Failed to load stored notifications';
    }

    // Subscribe to new notifications
    this.notificationService.connectToNotifications(userId).subscribe(
      (message: any) => {
        console.log('SSE notification for user', userId, ':', message); // Debug
        const newNotification = this.mapNotification(message);
        if (newNotification) {
          this.notifications.unshift(newNotification);
        } else if (message.parcelStatus) {
          this.notifications.push({
            type: 'parcel',
            parcelId: message.parcelId,
            status: message.parcelStatus,
            message: `Your parcel #${message.parcelId} is now marked as '${message.parcelStatus}'.`,
            timestamp: new Date()
          });
        }
      },
      (error) => {
        console.error('SSE connection error for user', userId, ':', error);
        this.errorMessage = 'Failed to connect to notifications';
      }
    );

    // Subscribe to toast messages
    this.notificationService.getToastMessages().subscribe(message => {
      console.log('Toast for user', userId, ':', message); // Replace with ToastNotificationComponent
    });
  }

  toggleRecommendedNotifications() {
    this.showRecommendedNotifications = !this.showRecommendedNotifications;
    localStorage.setItem('showRecommendedNotifications', this.showRecommendedNotifications.toString());
    console.log('Show recommended notifications:', this.showRecommendedNotifications);
  }

  private mapNotification(message: any): any {
    if (!message) {
      console.warn('Empty notification received');
      return null;
    }
    if (message.type === 'TRIP_REMINDER' && message.details) {
      const details = message.details;
      return {
        type: 'reminder',
        departure: details.departure || 'unknown',
        destination: details.destination || 'unknown',
        date: details.date || 'unknown',
        message: message.message || `Reminder: Your trip from ${details.departure} to ${details.destination} is starting soon!`,
        timestamp: new Date(message.timestamp || Date.now())
      };
    }
    
    // Reject carpool notifications with passengers
    if (message.type && ['CARPOOL_JOINED', 'CARPOOL_LEFT', 'CARPOOL_DELETED', 'CARPOOL_RECOMMENDED'].includes(message.type) && message.details?.passengers) {
      console.warn('Invalid carpool notification with passengers:', message);
      return null;
    }

    // Carpool notifications
    if (message.type === 'CARPOOL_JOINED' && message.details) {
      const details = message.details;
      return {
        type: 'CARPOOL_JOINED',
        carpoolId: details.carpoolId || 'unknown',
        departure: details.departure || 'unknown',
        destination: details.destination || 'unknown',
        date: details.date || 'unknown',
        time: details.time || 'unknown',
        message: message.message || `User has joined your carpool!`,
        timestamp: new Date(message.timestamp || Date.now())
      };
    } else if (message.type === 'CARPOOL_LEFT' && message.details) {
      const details = message.details;
      return {
        type: 'CARPOOL_LEFT',
        carpoolId: details.carpoolId || 'unknown',
        departure: details.departure || 'unknown',
        destination: details.destination || 'unknown',
        date: details.date || 'unknown',
        time: details.time || 'unknown',
        message: message.message || `User  has left your carpool!`,
        timestamp: new Date(message.timestamp || Date.now())
      };
    } else if (message.type === 'CARPOOL_DELETED' && message.details) {
      const details = message.details;
      return {
        type: 'CARPOOL_DELETED',
        carpoolId: details.carpoolId || 'unknown',
        departure: details.departure || 'unknown',
        destination: details.destination || 'unknown',
        date: details.date || 'unknown',
        time: details.time || 'unknown',
        message: message.message || `The carpool from ${details.departure || 'unknown'} to ${details.destination || 'unknown'} has been deleted.`,
        timestamp: new Date(message.timestamp || Date.now())
      };
    } else if (message.type === 'CARPOOL_RECOMMENDED' && message.details) {
      const details = message.details;
      return {
        type: 'CARPOOL_RECOMMENDED',
        carpoolId: details.carpoolId || 'unknown',
        departure: details.departure || 'unknown',
        destination: details.destination || 'unknown',
        date: details.date || 'unknown',
        time: details.time || 'unknown',
        price: details.price || 0,
        capacity: details.capacity || 'unknown',
        message: message.message || `Recommended carpool: From ${details.departure || 'unknown'} to ${details.destination || 'unknown'} on ${details.date || 'unknown'} at ${details.time || 'unknown'}`,
        timestamp: new Date(message.timestamp || Date.now())
      };
    }

    // Trip and other notifications
    if (message.refused) {
      return {
        type: 'refusal',
        departure: message.departure || 'unknown',
        destination: message.destination || 'unknown',
        message: `Your trip from ${message.departure || 'unknown'} to ${message.destination || 'unknown'} has been refused.`,
        timestamp: new Date(message.timestamp || Date.now())
      };
    } else if (message.eventDescription) {
      return {
        type: 'event',
        eventDescription: message.eventDescription || 'unknown',
        message: `A new event titled '${message.eventDescription || 'unknown'}' has been created!`,
        timestamp: new Date(message.timestamp || Date.now())
      };
    } if (message.type === 'TRIP_ACCEPTED' && message.details) {
      const details = message.details;
      return {
          type: 'acceptance',
          departure: details.departure || 'unknown',
          destination: details.destination || 'unknown',
          price: details.price || 0,
          passengers: details.passengers || 0,
          message: message.message || `Your trip from ${details.departure || 'unknown'} to ${details.destination || 'unknown'} has been confirmed!`,
          timestamp: new Date(message.timestamp || Date.now())
      };
  }
  if (message.parcelStatus) {
    return {
      type: 'parcel',
      parcelId: message.parcelId,
      status: message.parcelStatus,
      message: `Your parcel #${message.parcelId} is now ${message.parcelStatus}.`,
      timestamp: new Date(message.timestamp || Date.now())
    };
  }

    console.warn('Unmapped notification:', message);
    return null;
  }

  ngOnDestroy(): void {
    this.notificationService.closeConnection();
  }

    // New helper method to check if there are notifications of specific types
    hasNotifications(types: string[]): boolean {
      return this.notifications.some(notification => types.includes(notification.type));
    }
}