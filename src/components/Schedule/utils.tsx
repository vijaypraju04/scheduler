import { format, isBefore } from "date-fns";
import { Reservation, Schedule } from "../../types";
import { generateTimeSlots } from "../../utils/time";
import { Slot } from "./types";

export const updateSlotsWithReservations = (
  schedule: Schedule[],
  reservations: Reservation[],
  providerId: string
) => {
  const newSlots: { [key: string]: Slot[] } = {};

  schedule.forEach(({ date, startTime, endTime }) => {
    const dateKey = format(new Date(date), "yyyy-MM-dd");
    if (!newSlots[dateKey]) {
      newSlots[dateKey] = [];
    }
    const timeSlots = generateTimeSlots(startTime, endTime);
    timeSlots.forEach((time) => {
      const reservation = reservations.find(
        (res) =>
          res.date === dateKey &&
          res.startTime === time &&
          res.providerId === providerId
      );

      let state: "unbooked" | "reserved" | "booked" = "unbooked";
      if (reservation) {
        if (reservation.status === "confirmed") {
          state = "booked";
        } else if (
          reservation.status === "pending" &&
          !isBefore(new Date(reservation.expiresAt as string), new Date())
        ) {
          state = "reserved";
        }
      }

      newSlots[dateKey].push({
        time,
        state,
        reservationExpiresAt: reservation
          ? new Date(reservation.expiresAt as string)
          : undefined,
        reservationId: reservation ? reservation.id : undefined,
      });
    });
  });

  return newSlots;
};
