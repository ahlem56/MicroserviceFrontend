import { CommonModule } from '@angular/common';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { RouterModule, Router, NavigationEnd } from '@angular/router';  
import { UserService } from 'src/app/Core/user.service';
import { filter } from 'rxjs/operators';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/Core/notification-service.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl:'./navigation.component.css',
  imports: [CommonModule, RouterModule, NgbDropdownModule],
})
export class NavigationComponent implements OnInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public isLoggedIn: boolean = false;
  public username: string = '';
  public profileImageUrl: string = 'assets/FrontOffice/images/users/user4.jpg'; // Default profile picture
  public hasNewNotification: boolean = false; // Add this property to track new notifications

  constructor(private userService: UserService, private router: Router,   
     private notificationService: NotificationService // Inject the service
  ) {}

  ngOnInit() {
    this.checkLoginStatus();  // Check login status when the component is initialized

    // Re-check login status on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)  // Only listen for NavigationEnd events
    ).subscribe(() => {
      this.checkLoginStatus();  // Re-check login status whenever the route changes
    });

    this.notificationService.getNewNotificationStatus().subscribe((isNew) => {
      this.hasNewNotification = isNew;
    });
    // ✅ Listen for profile picture updates
    document.addEventListener('updateProfileImage', () => {
      this.updateProfileImage();
    });
  }

  // ✅ Fetch User Data and Update Profile Picture
  checkLoginStatus() {
    const token = localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user) {
        const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
        this.username = fullName || user.email || user.preferred_username || '';
        this.profileImageUrl = this.resolveProfileImage(user.userProfilePhoto);
      }
    } else {
      this.isLoggedIn = false;
      this.username = '';
      this.profileImageUrl = 'assets/FrontOffice/images/users/user4.jpg'; // Reset to default
    }
  }

  // ✅ Update Profile Picture When User Uploads New One
  updateProfileImage() {
    const updatedUser = JSON.parse(localStorage.getItem('user') || '{}');
    this.profileImageUrl = this.resolveProfileImage(updatedUser.userProfilePhoto);
  }

  private resolveProfileImage(photo: string | null | undefined): string {
    if (!photo) {
      return 'assets/FrontOffice/images/users/user4.jpg';
    }
    if (typeof photo !== 'string' || photo === 'null') {
      return 'assets/FrontOffice/images/users/user4.jpg';
    }
    if (photo.startsWith('data:image')) {
      return photo;
    }
    if (photo.startsWith('http')) {
      return photo;
    }
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    const sanitized = photo.replace(/\s/g, '');
    if (base64Pattern.test(sanitized)) {
      return `data:image/jpeg;base64,${sanitized}`;
    }
    return 'assets/FrontOffice/images/users/user4.jpg';
  }

  // ✅ Logout Method
  logout() {
    this.userService.logout();
    this.isLoggedIn = false;
    this.username = '';
    this.profileImageUrl = 'assets/FrontOffice/images/users/user4.jpg'; // Reset on logout
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }
}
