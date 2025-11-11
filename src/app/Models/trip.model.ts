export interface Trip {
  tripId?: number;
  tripDeparture: string;
  tripDestination: string;
  tripDate: string;
  tripDuration?: string;
  tripPrice?: number;
  tripType: string;               // ✅ Required field (was missing in service)
  reservationStatus?: string;
  numberOfPassengers?: number;
  latitude?: number;
  longitude?: number;
  driverId?: number;
  userId?: number;
  vehicleId?: number;
}
