import { Component, AfterViewInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { VehicleService } from 'src/app/Core/vehicle.service';

declare global {
  interface Window {
    google: any;
  }
}

@Component({
  selector: 'app-vehicle-map',
  templateUrl: './vehicle-map.component.html',
  styleUrls: ['./vehicle-map.component.scss'],
  standalone: true
})
export class VehicleMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

  private map!: google.maps.Map;
  private directionsService!: google.maps.DirectionsService;
  private directionsRenderer!: google.maps.DirectionsRenderer;
  private subs = new Subscription();

  private checkpointData: {
    position: google.maps.LatLng;
    marker: google.maps.Marker;
    arrived: boolean;
  }[] = [];

  readonly checkpointCount = 9;
  readonly proximityThresholdMeters = 50;
  vehicleId!: number;

  constructor(
    private route: ActivatedRoute,
    private vehicleService: VehicleService
  ) {}

  ngAfterViewInit(): void {
    this.vehicleId = Number(this.route.snapshot.paramMap.get('id'));
    this.initMap();
    this.loadRouteAndCheckpoints();
  }


  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private initMap(): void {
    this.map = new window.google.maps.Map(this.mapContainer.nativeElement, {
      zoom: 8
    });
    this.directionsService = new window.google.maps.DirectionsService();
    this.directionsRenderer = new window.google.maps.DirectionsRenderer({
      map: this.map,
      suppressMarkers: true
    });
  }

  private loadRouteAndCheckpoints(): void {
    this.subs.add(
      this.vehicleService.getTripDepartureAndDestination(this.vehicleId).subscribe(
        ({ departure, destination }) => {
          this.directionsService.route({
            origin: departure,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING
          }, (result: any, status: string) => {
            if (status === 'OK') {
              this.directionsRenderer.setDirections(result);
              const path = result.routes[0].overview_path as google.maps.LatLng[];

              this.addMarker(path[0], `Departure: ${departure}`, 'green');
              this.addMarker(path[path.length - 1], `Destination: ${destination}`, 'red');

              this.buildCheckpoints(path);
              this.saveCheckpointsToServer();
              this.loadCheckpointStatuses();
            } else {
              console.error('Directions request failed:', status);
            }
          });
        },
        err => console.error('Error fetching trip coords:', err)
      )
    );
  }

  private buildCheckpoints(path: google.maps.LatLng[]): void {
    const segment = (path.length - 1) / (this.checkpointCount - 1);
    const bounds = new window.google.maps.LatLngBounds();

    for (let i = 0; i < this.checkpointCount; i++) {
      const idx = Math.round(i * segment);
      const pos = path[idx];
      const color = i === 0 ? 'green' : 'orange';
      const marker = this.addCheckpointMarker(pos, `Checkpoint ${i + 1}`, color);

      this.checkpointData.push({
        position: pos,
        marker,
        arrived: false
      });

      bounds.extend(pos);
    }

    this.map.fitBounds(bounds);
  }

  private addMarker(position: google.maps.LatLng, title: string, color: string): void {
    new window.google.maps.Marker({
      position,
      map: this.map,
      title,
      icon: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    });
  }

  private addCheckpointMarker(position: google.maps.LatLng, label: string, color: string): google.maps.Marker {
    const marker = new window.google.maps.Marker({
      position,
      map: this.map,
      title: label,
      icon: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`
    });
    marker.addListener('click', () =>
      new window.google.maps.InfoWindow({ content: `<strong>${label}</strong>` }).open(this.map, marker)
    );
    return marker;
  }

  private saveCheckpointsToServer(): void {
    const records = this.checkpointData.map(cp => ({
      latitude: cp.position.lat(),
      longitude: cp.position.lng(),
      arrived: cp.arrived
    }));

    this.subs.add(
      this.vehicleService.saveCheckpoints(this.vehicleId, records).subscribe(
        () => console.log('Checkpoints saved'),
        err => console.error('Failed to save checkpoints', err)
      )
    );
  }

  private loadCheckpointStatuses(): void {
    this.subs.add(
      this.vehicleService.getCheckpointsStatus(this.vehicleId).subscribe(
        (checkpoints: any[]) => {
          checkpoints.forEach((checkpoint, index) => {
            if (checkpoint.arrived) {
              this.checkpointData[index].arrived = true;
              this.checkpointData[index].marker.setIcon(
                'http://maps.google.com/mapfiles/ms/icons/green-dot.png'
              );
            }
          });
        },
        err => console.error('Error loading checkpoint statuses:', err)
      )
    );
  }

  reachNextCheckpoint(): void {
    const next = this.checkpointData.find(cp => !cp.arrived);
    if (!next) {
      alert('All checkpoints have been reached!');
      return;
    }

    next.arrived = true;
    next.marker.setIcon('http://maps.google.com/mapfiles/ms/icons/green-dot.png');

    this.subs.add(
      this.vehicleService.markNextArrived(this.vehicleId).subscribe(
        () => console.log('Checkpoint marked as arrived'),
        err => console.error('Failed to update checkpoint', err)
      )
    );
  }
}
