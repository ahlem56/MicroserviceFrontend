export interface Parcel {
  parcelId?: number;
  parcelPrice: number;
  parcelWeight: number;
  parcelCategory: string;
  recepeientPhoneNumber: string;
  senderPhoneNumber: string;
  parcelDeparture: string;
  parcelDestination: string;
  [key: string]: any;
}