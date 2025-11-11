import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService } from './Core/notification-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'speedyGoFrontend';
  notifications: string[] = [];  // Declare the notifications array

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Retrieve userId from localStorage after the user logs in
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user.userId; // Assuming the user object contains the 'id' field.

    if (userId) {
      // Subscribe to toast messages
      this.notificationService.getToastMessages().subscribe((message: string) => {
        this.notifications.push(message);  // Add the new message to notifications
      });

      // Connect to notifications stream by passing the dynamic userId
      this.notificationService.connectToNotifications(userId).subscribe(
        (response) => {
          console.log('SSE connection established successfully');
        },
        (error) => {
          console.error('Error connecting to SSE stream:', error);
        }
      );
    } else {
      console.log('User is not logged in');
    }
  }

  ngOnDestroy(): void {
    // Close the SSE connection when the component is destroyed
    this.notificationService.closeConnection();
  }
}
