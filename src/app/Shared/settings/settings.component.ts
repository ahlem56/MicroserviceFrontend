import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class SettingsComponent implements OnInit {
  darkMode: boolean = false;  // Default to false
  notifications: boolean = true;
  language: string = 'en';
  name: string = 'John Doe';
  email: string = 'johndoe@example.com';
  newPassword: string = '';
  confirmPassword: string = '';
  passwordMismatch: boolean = false;

  ngOnInit(): void {
    // Check if dark mode preference exists in localStorage
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    this.darkMode = savedDarkMode;

    // Apply dark mode if the preference is set
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  saveSettings() {
    // Validate password
    if (this.newPassword && this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.passwordMismatch = false;

    console.log('Settings saved:', {
      name: this.name,
      email: this.email,
      darkMode: this.darkMode,
      notifications: this.notifications,
      language: this.language,
    });

    alert('Settings updated successfully!');
    this.toggleDarkMode();
  }

  toggleDarkMode() {
    // Apply or remove dark mode class globally
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'true');  // Persist dark mode preference
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'false');  // Persist dark mode preference
    }
  }

  toggleNotifications() {
    console.log(`Notifications enabled: ${this.notifications}`);
  }

  changeLanguage() {
    console.log(`Language changed to: ${this.language}`);
  }
}
