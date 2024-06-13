export interface Slot {
  time: string;
  state: "unbooked" | "reserved" | "booked";
  reservationExpiresAt?: Date;
  reservationId?: string;
}