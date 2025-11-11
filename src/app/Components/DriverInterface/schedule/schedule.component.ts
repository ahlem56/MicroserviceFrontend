import { Component } from '@angular/core';
import { ParcelService } from 'src/app/Core/parcel.service';
import { TripService } from 'src/app/Core/trip.service';
import { CommonModule } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import { UserService } from 'src/app/Core/user.service';

@Component({
  selector: 'app-schedule',
  imports: [CommonModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleDriverInterfaceComponent {
  groupedTasks: { [date: string]: any[] } = {};
  constructor(
    private parcelService: ParcelService,
    private tripService: TripService,
    private userService: UserService
  ) {}
  ngOnInit(): void {
    this.userService.refreshUserProfile().subscribe({
      next: () => this.loadTasks(),
      error: () => this.loadTasks()
    });
  }
  

  loadTasks(): void {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      alert('Utilisateur non trouvé !');
      return;
    }
  
    const user = JSON.parse(userStr);
    const rawDriverId = user.driverId ?? user.userId ?? user.id;
    const driverId = rawDriverId !== undefined ? Number(rawDriverId) : NaN;

    if (!driverId || Number.isNaN(driverId)) {
      alert('ID du conducteur invalide !');
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('token')}`
    });
  
    this.parcelService.getParcelForDriver(driverId, headers).subscribe(
      parcels => {
        this.tripService.getTripsForDriver(driverId, headers).subscribe(
          trips => {
            const tasks = [
              ...parcels.map(p => ({ ...p, type: 'parcel' })),
              ...trips.map(t => ({ ...t, type: 'trip' }))
            ];
            this.groupedTasks = this.groupByDate(tasks);
          },
          err => {
            console.error('Erreur lors du chargement des trips', err);
          }
        );
      },
      err => {
        console.error('Erreur lors du chargement des parcels', err);
      }
    );
  }
  private groupByDate(tasks: any[]): { [date: string]: any[] } {
    const groups: { [date: string]: any[] } = {};
  
    tasks.forEach(task => {
      let rawDate: string | Date | null = null;
  
      if (task.type === 'parcel') {
        rawDate = task.parcelDate;
      } else if (task.type === 'trip') {
        rawDate = task.tripDate;
      }
  
      if (rawDate) {
        const dateObj = new Date(rawDate);
        const dateKey = dateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
  
        if (!groups[dateKey]) groups[dateKey] = [];
        groups[dateKey].push(task);
      }
    });
  
    return groups;
  }
  
  
}
