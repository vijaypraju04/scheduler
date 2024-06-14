export interface Slot {
  time: string;
  state: "unbooked" | "pending" | "confirmed";
  reservationExpiresAt?: Date;
  reservationId?: string;
}

