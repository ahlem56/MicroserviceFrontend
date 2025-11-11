// src/app/FrontOffice/event-listFrontOffice.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, AppEvent } from 'src/app/Core/event.service';

@Component({
  selector: 'app-event-list-front',
  templateUrl: 'event-list.component.html',
  styleUrls: ['event-list.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [DatePipe]
})
export class EventListFrontOfficeComponent implements OnInit {
  events: AppEvent[] = [];
  filteredEvents: AppEvent[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  selectedMonth: string = 'all';
  viewMode: 'grid' | 'list' = 'grid';
  months: { label: string; value: string }[] = [];
  private userId!: number;

  constructor(
    private eventService: EventService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.userId = user.userId;
    this.loadEvents();
  }

  private loadEvents(): void {
    this.loading = true;
    this.eventService.getAllEvents().subscribe({
      next: evts => {
        this.events = evts.map(e => ({
          ...e,
          currentParticipants: e.simpleUsers?.length ?? 0,
          registered: e.simpleUsers?.some(u => u.userId === this.userId) ?? false
        }));
        this.setupMonths();
        this.applyFilters();
        this.loading = false;
      },
      error: err => {
        this.error = typeof err === 'string' ? err : err.message;
        this.loading = false;
      }
    });
  }

  formatDate(dateStr: string): string {
    return this.datePipe.transform(dateStr, 'medium') || dateStr;
  }

  join(evt: AppEvent): void {
    this.eventService.register(evt.id, this.userId).subscribe({
      next: () => {
        evt.registered = true;
        evt.currentParticipants = (evt.currentParticipants ?? 0) + 1;
      },
      error: err => this.error = err.error?.message || err.message
    });
  }

  leave(evt: AppEvent): void {
    if (confirm("Are you sure you want to leave this event?")) {
      this.eventService.unregister(evt.id, this.userId).subscribe({
        next: () => {
          evt.registered = false;
          evt.currentParticipants = Math.max((evt.currentParticipants ?? 1) - 1, 0);
          alert('You have successfully left the event.');
          this.applyFilters();
        },
        error: err => this.error = err.error?.message || err.message
      });
    }
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onMonthChange(event: Event): void {
    const selectValue = (event.target as HTMLSelectElement | null)?.value ?? 'all';
    this.selectedMonth = selectValue;
    this.applyFilters();
  }

  toggleView(mode: 'grid' | 'list'): void {
    this.viewMode = mode;
  }

  trackByEventId(_: number, event: AppEvent): number {
    return event.id;
  }

  private applyFilters(): void {
    const query = this.searchQuery.trim().toLowerCase();
    this.filteredEvents = this.events.filter(event => {
      const matchesQuery =
        !query ||
        event.title?.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.location?.toLowerCase().includes(query);

      const matchesMonth =
        this.selectedMonth === 'all' ||
        (event.startDate && new Date(event.startDate).getMonth().toString() === this.selectedMonth);

      return matchesQuery && matchesMonth;
    });
  }

  private setupMonths(): void {
    const monthSet = new Set<number>();
    this.events.forEach(event => {
      if (event.startDate) {
        const month = new Date(event.startDate).getMonth();
        if (!isNaN(month)) {
          monthSet.add(month);
        }
      }
    });

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.months = [
      { label: 'All months', value: 'all' },
      ...Array.from(monthSet)
        .sort((a, b) => a - b)
        .map(monthIndex => ({
          label: monthNames[monthIndex],
          value: monthIndex.toString()
        }))
    ];
  }
}
