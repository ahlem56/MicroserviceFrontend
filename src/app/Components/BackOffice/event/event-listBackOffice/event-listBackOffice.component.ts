import { Component, OnInit } from '@angular/core';
import { EventService, AppEvent} from "../../../../Core/event.service";
import {CommonModule, DatePipe} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-event-list-backoffice',
  templateUrl: 'event-listBackOffice.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  styleUrls: ['event-listBackOffice.component.css'],
  providers: [DatePipe]
})
export class EventListBackOfficeComponent implements OnInit {
  events: AppEvent[] = [];
  loading = true;
  error: string | null = null;
  searchQuery = '';
  showDeleteModal = false;
  deleting = false;
  deleteError: string | null = null;
  eventPendingDelete: AppEvent | null = null;

  constructor(
    private eventService: EventService,
    private datePipe: DatePipe,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    console.log('Initiating events load...');

    this.eventService.getAllEvents().subscribe({
      next: (events) => {
        console.log('Events received:', events);
        this.events = events;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading events:', err);
        this.error = typeof err === 'string' ? err : err.message;
        this.loading = false;
      },
      complete: () => console.log('Events loading complete')
    });
  }

  formatDate(dateString: string | null | undefined): string {
    if (!dateString) {
      return 'N/A';
    }
    return this.datePipe.transform(dateString, 'medium') || 'Invalid date';
  }

  openDeleteModal(event: AppEvent) {
    console.log('[Delete Modal] opening for event', event);
    this.eventPendingDelete = event;
    this.deleteError = null;
    this.showDeleteModal = true;
  }

  cancelDelete() {
    console.log('[Delete Modal] cancel clicked');
    if (this.deleting) {
      return;
    }
    this.showDeleteModal = false;
    this.eventPendingDelete = null;
    this.deleteError = null;
  }

  confirmDelete() {
    console.log('[Delete Modal] confirm clicked', this.eventPendingDelete);
    if (!this.eventPendingDelete || this.deleting) {
      return;
    }

    const eventId = this.eventPendingDelete.id;
    console.log('[Delete Modal] using eventId', eventId);
    if (eventId == null) {
      this.deleteError = 'Selected event is missing an identifier.';
      return;
    }

    this.deleting = true;
    this.deleteError = null;

    this.eventService.deleteEvent(eventId).subscribe({
      next: () => {
        console.log('[Delete Modal] delete succeeded, removing event');
        this.events = this.events.filter(event => event.id !== eventId);
        this.deleting = false;
        this.showDeleteModal = false;
        this.eventPendingDelete = null;
      },
      error: (err) => {
        console.error('[Delete Modal] delete failed', err);
        this.deleteError = typeof err === 'string' ? err : err?.message || 'Failed to delete event. Please try again.';
        this.deleting = false;
      }
    });
  }

  get filteredEvents() {
    if (!this.searchQuery) return this.events;
    const query = this.searchQuery.toLowerCase();
    return this.events.filter(event =>
      (event.title?.toLowerCase().includes(query) || event.description?.toLowerCase().includes(query)) ||
      event.location?.toLowerCase().includes(query)
    );
  }

  navigateToEdit(eventId: number) {
    // Use absolute path with route parameter
    this.router.navigate(['/back-office/events', eventId]);
  }

  navigateToCreate(){
    this.router.navigate(['/back-office/events/create']);
  }

  get totalEvents(): number {
    return this.events.length;
  }

  get publishedCount(): number {
    return this.events.filter(evt => evt.published).length;
  }

  get draftCount(): number {
    return this.events.filter(evt => !evt.published).length;
  }

  get upcomingCount(): number {
    const now = new Date().getTime();
    return this.events.filter(evt => {
      if (!evt.startDate) return false;
      const start = new Date(evt.startDate).getTime();
      return !isNaN(start) && start > now;
    }).length;
  }
}
