import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router'; // Import Router for navigation

@Component({
  selector: 'app-toast-notification',
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss'],
  imports: [CommonModule],
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  @Input() duration: number = 100000; // Duration of toast in ms
  isVisible = false;
  truncatedMessage: string = '';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.isVisible = true;
    // Truncate the message to show only the first 50 characters
    this.truncatedMessage = this.message.length > 50 ? `${this.message.slice(0, 50)}...` : this.message;

    setTimeout(() => {
      this.closeToast(); // Automatically close the toast after the duration
    }, this.duration);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  closeToast(): void {
    this.isVisible = false;  // Manually hide the toast
  }

  goToNotificationPage(): void {
    // Navigate to the notification page when "Read More" is clicked
    this.router.navigate(['/notifications']);
    this.closeToast();  // Optionally close the toast after navigating
  }
}
