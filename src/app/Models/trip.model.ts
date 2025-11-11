export interface Trip {
    tripId?: number;
    tripDeparture: string;
    tripDestination: string;
    tripDate: string;
    tripDuration: string;
    tripPrice: number;
    tripType: string;
    numberOfPassengers: number;
    reservationStatus: string;
    latitude: string;
    longitude: string;
    [key: string]: any;
  }