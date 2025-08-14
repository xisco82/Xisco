export enum View {
  News,
  Parking,
  Bikes,
  Balinese,
  Extras,
  Disability,
}

export interface NewsEvent {
  id: number;
  date: string; // YYYY-MM-DD
  title: string;
  description: string;
}

export interface ParkingBooking {
  spotId: number;
  guestName: string;
  roomNumber: string;
  date: string; // YYYY-MM-DD
}

export interface BikeBooking {
  bikeId: number;
  guestName: string;
  roomNumber: string;
  date: string; // YYYY-MM-DD
}

export interface BalineseBedBooking {
  bedId: number;
  guestName: string;
  roomNumber: string;
}

export interface ExtraOrder {
  id: number;
  guestName: string;
  roomNumber: string;
  regime: string;
  compensationReason: string;
  startDate: string;
  endDate: string;
}

export interface AccessibilityBooking {
  id: number;
  guestName: string;
  roomNumber: string;
  arrivalDate: string; // YYYY-MM-DD
  departureDate: string; // YYYY-MM-DD
  disabilityInfo: string;
}
