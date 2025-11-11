import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GoogleMapsModule } from '@angular/google-maps';
import { ParcelService } from 'src/app/Core/parcel.service';
import { Vehicle, VehicleService } from 'src/app/Core/vehicle.service';
import { AdminService } from 'src/app/Core/admin.service';
import { Chart, ChartConfiguration, ArcElement, CategoryScale, Tooltip, Legend, PieController } from 'chart.js';
import { EventService, AppEvent } from 'src/app/Core/event.service';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject } from 'rxjs';
import { addMonths, subMonths, isSameDay, isSameMonth } from 'date-fns';

// Register the required components
Chart.register(ArcElement, CategoryScale, Tooltip, Legend, PieController);

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: false,
})
export class DashboardComponent implements OnInit {
  totalUsers: number = 0;
  totalTrips: number = 0;
  totalCarpools: number = 0; // Added for carpool count
  totalParcels: number = 0; // Added
  featuredEvent: any;  // Variable to store highlighted event
  chart: any; // Chart.js instance

  trips: any[] = [];
  center: google.maps.LatLngLiteral = { lat: 33.8869, lng: 9.5375 };
  zoom: number = 7;
  mapOptions: google.maps.MapOptions = {
    styles: [
      {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{"visibility": "off"}]
      },
      {
        "featureType": "poi",
        "stylers": [{"visibility": "off"}]
      },
      {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{"visibility": "off"}]
      },
      {
        "featureType": "transit",
        "stylers": [{"visibility": "off"}]
      }
    ]
  };
  maxTrips: number = 1; // Will be calculated based on actual data
  topRatedDrivers: any[] = [];
  vehiclesWithExpiredInsurance: Vehicle[] = [];
  totalDeliveredToday: number = 0;
  totalDeliveredThisWeek: number = 0;
  totalDeliveredThisMonth: number = 0;
  topRatedOfferers: any[] = []; // Added
  readonly baseApiUrl = 'http://localhost:8089/examen/user';
  currentDate: Date = new Date();
  CalendarView = CalendarView;
  calendarView: CalendarView = CalendarView.Month;
  viewDate: Date = new Date();
  calendarEvents: CalendarEvent[] = [];
  calendarRefresh: Subject<void> = new Subject<void>();
  activeDayIsOpen = false;
  selectedDate: Date | null = null;
  selectedDayEvents: CalendarEvent[] = [];


  constructor(
    private http: HttpClient,
    private parcelService: ParcelService, 
    private vehicleService: VehicleService,
    private adminService: AdminService,    
    private eventService: EventService // Inject EventService

  ) {}

  ngOnInit(): void {
    this.getTotalUsers();
    this.getTotalTrips();
    this.getTripsByLocation();
    this.getStatistics();
    // this.getTopRatedDrivers(); // Removed - rating service no longer available
    this.getVehiclesWithExpiredInsurance();
    this.getTotalCarpools();
    this.getTopRatedOfferers();
    this.getTotalParcels(); 
    this.loadEventData();
  }

  getTotalUsers(): void {
    this.http.get<number>('http://localhost:8089/examen/Admin/total-users')
      .subscribe({
        next: (data) => this.totalUsers = data,
        error: (err) => console.error('Error fetching total users', err)
      });
  }

  getTotalTrips(): void {
    this.http.get<number>('http://localhost:8089/examen/Admin/total-trips')
      .subscribe({
        next: (data) => this.totalTrips = data,
        error: (err) => console.error('Error fetching total trips', err)
      });
  }
  

  getTripsByLocation(): void {
    this.http.get<any[]>('http://localhost:8089/examen/Admin/trips-by-location')
      .subscribe({
        next: (data) => {
          this.trips = data;
          this.maxTrips = Math.max(...this.trips.map(trip => trip.tripCount), 1);
          console.log('Trips data:', this.trips);
        },
        error: (err) => console.error('Error fetching trips by location', err)
      });
  }

  getTotalParcels(): void {
    this.http.get<number>('http://localhost:8089/examen/parcel/total')
      .subscribe({
        next: (data) => {
          console.log('Fetched total Parcels:', data);
          this.totalParcels = data;
        },
        error: (err) => {
          console.error('Error fetching total Parcels', err);        }
      });
  }

  getTotalCarpools(): void {
    this.http.get<number>('http://localhost:8089/examen/carpools/count')
      .subscribe({
        next: (data) => {
          console.log('Fetched total carpools:', data);
          this.totalCarpools = data;
        },
        error: (err) => {
          console.error('Error fetching total carpools', err);        }
      });
  }
  getMarkerIcon(trip: any): google.maps.Icon {
    let icon = {
      url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      scaledSize: new google.maps.Size(30, 30),
    };

    if (trip.tripCount > 50) {
      icon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
        scaledSize: new google.maps.Size(40, 40),
      };
    } else if (trip.tripCount > 20) {
      icon = {
        url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new google.maps.Size(35, 35),
      };
    }

    return icon;
  }

  // Update the getStatistics method in your component
 getStatistics(): void {
    const dateString = this.currentDate.toISOString().split('T')[0];
    
    this.parcelService.getParcelStatistics(dateString).subscribe({
      next: (stats) => {
        this.totalDeliveredToday = stats.daily;
        this.totalDeliveredThisWeek = stats.weekly;
        this.totalDeliveredThisMonth = stats.monthly;
      },
      error: (err) => {
        console.error('Error fetching parcel statistics:', err);
        // Set default values
        this.totalDeliveredToday = 0;
        this.totalDeliveredThisWeek = 0;
        this.totalDeliveredThisMonth = 0;
      }
    });
  }

  getTopRatedDrivers(): void {
    // Removed - rating service no longer available
    this.topRatedDrivers = [];
  }

  getTopRatedOfferers(): void {
    this.http.get<any[]>('http://localhost:8089/examen/carpools/top-rated-offerers')
      .subscribe({
        next: (offerers: any[]) => {
          this.topRatedOfferers = offerers;
          console.log('Top 3 rated carpool offerers:', this.topRatedOfferers);
        },
        error: (err: any) => console.error('Error fetching top-rated offerers', err)
      });
  }

  getStars(rating: number): string[] {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - (fullStars + halfStar);
  
    return [
      ...new Array(fullStars).fill('full'),
      ...new Array(halfStar).fill('half'),
      ...new Array(emptyStars).fill('empty'),
    ];
  }

  getVehiclesWithExpiredInsurance(): void {
    this.vehicleService.getVehiclesWithExpiredInsurance().subscribe({
      next: (data) => {
        this.vehiclesWithExpiredInsurance = data;
        console.log('Vehicles with expired insurance:', this.vehiclesWithExpiredInsurance);
      },
      error: (err: any) => console.error('Error fetching vehicles with expired insurance', err)
    });
  }
  
  ratings(rating: number, isPercentage: boolean = false): string[] {
    const normalizedRating = isPercentage ? rating / 20 : rating; // 100% = 5 stars
    const fullStars = Math.floor(normalizedRating);
    const halfStar = normalizedRating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - (fullStars + halfStar);
    return [
      ...new Array(fullStars).fill('fas fa-star'),
      ...new Array(halfStar).fill('fas fa-star-half-alt'),
      ...new Array(emptyStars).fill('far fa-star'),
    ];
  }


  public getProfilePhotoUrl(profilePhoto: string | null): string | null {
    if (!profilePhoto) {
      return null;
    }

    if (typeof profilePhoto !== 'string' || profilePhoto === 'null') {
      console.warn("Profile photo is null or invalid, no photo will be displayed");
      return null;
    }
    if (profilePhoto.startsWith('data:image')) {
      console.log("Using base64 profile photo:", profilePhoto.substring(0, 30) + '...');
      return profilePhoto;
    }
    if (profilePhoto.startsWith('http')) {
      return profilePhoto;
    }
    const sanitized = profilePhoto.replace(/\s/g, '');
    const base64Pattern = /^[A-Za-z0-9+/=]+$/;
    if (base64Pattern.test(sanitized)) {
      return `data:image/jpeg;base64,${sanitized}`;
    }
    console.warn("Unrecognized profile photo format, no photo will be displayed");
    return null;
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    console.warn(`Image failed to load: ${imgElement.src}, hiding image`);
    imgElement.style.display = 'none';
  }
/*
  getTotalParcels(): void {
    this.parcelService.getTotalParcels().subscribe({
      next: (data) => {
        this.totalParcels = data;
        console.log('Total parcels:', data);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des colis :', err);
      }
    });
  }
  
*/

  loadEventData(): void {
    this.eventService.getAllEvents().subscribe({
      next: events => {
        const enrichedEvents = events.map(evt => ({
          ...evt,
          currentParticipants: evt.currentParticipants ?? (evt.simpleUsers?.length ?? 0)
        }));

        this.featuredEvent = this.selectFeaturedEvent(enrichedEvents);
        this.calendarEvents = this.mapEventsToCalendar(enrichedEvents);
        this.calendarRefresh.next();

        if (this.calendarEvents.length === 0) {
          this.selectedDate = null;
          this.selectedDayEvents = [];
          this.activeDayIsOpen = false;
        }
      },
      error: err => console.error('Error fetching events', err)
    });
  }

  previousMonth(): void {
    this.viewDate = subMonths(this.viewDate, 1);
    this.resetDaySelection();
  }

  nextMonth(): void {
    this.viewDate = addMonths(this.viewDate, 1);
    this.resetDaySelection();
  }

  goToToday(): void {
    this.viewDate = new Date();
    this.resetDaySelection();
  }

  dayClicked(day: { date: Date; events: CalendarEvent[] }): void {
    const { date, events } = day;
    if (!isSameMonth(date, this.viewDate)) {
      return;
    }
    if (
      (isSameDay(this.viewDate, date) && this.activeDayIsOpen) ||
      events.length === 0
    ) {
      this.resetDaySelection();
    } else {
      this.viewDate = date;
      this.selectedDate = date;
      this.selectedDayEvents = events;
      this.activeDayIsOpen = true;
    }
  }

  eventClicked(event: CalendarEvent): void {
    this.selectedDate = event.start;
    this.selectedDayEvents = [event];
    this.activeDayIsOpen = true;
  }

  private resetDaySelection(): void {
    this.activeDayIsOpen = false;
    this.selectedDate = null;
    this.selectedDayEvents = [];
  }

  private mapEventsToCalendar(events: AppEvent[]): CalendarEvent[] {
    return events
      .map(event => {
        let start = this.parseDate(event.startDate);
        const end = this.parseDate(event.endDate);
        if (!start && end) {
          start = end;
        }
        if (!start) {
          return null;
        }
        const color = event.published
          ? { primary: '#b91c1c', secondary: '#fee2e2' }
          : { primary: '#9ca3af', secondary: '#e5e7eb' };

        return {
          start,
          end: end && !isNaN(end.getTime()) ? end : start,
          title: event.title || event.description || 'Scheduled event',
          color,
          meta: event,
          allDay: false
        } as CalendarEvent;
      })
      .filter((evt): evt is CalendarEvent => !!evt);
  }

  private selectFeaturedEvent(events: AppEvent[]): AppEvent | null {
    if (!events.length) {
      return null;
    }
    const now = Date.now();
    const upcoming = events
      .filter(evt => {
        const start = this.parseDate(evt.startDate);
        return !!start && start.getTime() >= now;
      })
      .sort((a, b) => {
        const aDate = this.parseDate(a.startDate)?.getTime() ?? 0;
        const bDate = this.parseDate(b.startDate)?.getTime() ?? 0;
        return aDate - bDate;
      });
    if (upcoming.length) {
      return upcoming[0];
    }
    return events
      .slice()
      .sort((a, b) => {
        const aDate = this.parseDate(a.startDate)?.getTime() ?? 0;
        const bDate = this.parseDate(b.startDate)?.getTime() ?? 0;
        return bDate - aDate;
      })[0];
  }

  private parseDate(value?: string): Date | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }
  
}