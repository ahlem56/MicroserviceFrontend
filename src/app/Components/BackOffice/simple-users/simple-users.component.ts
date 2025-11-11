import { Component } from '@angular/core';
import { UserService } from 'src/app/Core/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-simple-users',
  templateUrl: './simple-users.component.html',
  styleUrl: './simple-users.component.scss', 
  imports : [CommonModule, FormsModule], // If using standalone components
})
export class SimpleUsersComponent {
  simpleUsers: any[] = [];
  filteredSimpleUsers: any[] = [];
  searchTerm: string = '';
  isLoading = true;
  errorMessage = '';

  constructor(private userService: UserService, private router: Router) {}

  ngOnInit(): void {
    this.loadSimpleUsers();
  }

  loadSimpleUsers(): void {
    this.userService.getAllSimpleUsers().subscribe({
      next: (data) => {
        this.simpleUsers = data;
        this.filteredSimpleUsers = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching simple users:', error);
        this.errorMessage = 'Error loading users';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredSimpleUsers = this.simpleUsers.filter(user =>
      user.firstName.toLowerCase().includes(term) ||
      user.lastName.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term)
    );
  }
}
