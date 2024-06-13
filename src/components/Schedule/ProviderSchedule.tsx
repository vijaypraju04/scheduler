import React, { useState, useEffect } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styled from "styled-components";
import { addMinutes, isBefore } from "date-fns";
import { v4 as uuidv4 } from "uuid";
import { ScheduleList } from "./ScheduleList";
import { fetchProviderSchedule, fetchReservations } from "./api";
import { updateSlotsWithReservations } from "./utils";
import { Schedule } from "../../types";
import { isError } from "../../utils/typeguards";
import { AppointmentModal } from "../AppointmentModal";

interface ProviderScheduleProps {
  providerId: string;
  providerName: string;
  onBack: () => void;
}

interface Slot {
  time: string;
  state: "unbooked" | "reserved" | "booked";
  reservationExpiresAt?: Date;
  reservationId?: string;
}

export const ProviderSchedule: React.FC<ProviderScheduleProps> = ({
  providerId,
  providerName,
  onBack,
}) => {
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [slots, setSlots] = useState<{ [key: string]: Slot[] }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"reserve" | "confirm">("reserve");

  const clientId = localStorage.getItem("clientId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedule, reservations] = await Promise.all([
          fetchProviderSchedule(providerId),
          fetchReservations(providerId),
        ]);
        setSchedule(schedule);
        setSlots(
          updateSlotsWithReservations(schedule, reservations, providerId)
        );
      } catch (error) {
        if (isError(error)) {
          setError(error.message);
        } else {
          setError("An unknown error has occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [providerId]);

  const handleSlotClick = (date: string, time: string) => {
    const slot = slots[date].find((s) => s.time === time);
    if (slot) {
      if (slot.state === "unbooked") {
        setSelectedSlot(slot);
        setModalType("reserve");
        setModalOpen(true);
      } else if (slot.state === "reserved") {
        setSelectedSlot(slot);
        setModalType("confirm");
        setModalOpen(true);
      }
    }
  };

  const handleReserve = async (name: string, email: string) => {
    if (selectedSlot) {
      const newSlots = { ...slots };
      const dateKey = Object.keys(newSlots).find((date) =>
        newSlots[date].includes(selectedSlot)
      );
      if (dateKey) {
        const slotIndex = newSlots[dateKey].indexOf(selectedSlot);
        const reservationId = uuidv4();
        newSlots[dateKey][slotIndex] = {
          ...selectedSlot,
          state: "reserved",
          reservationExpiresAt: addMinutes(new Date(), 15),
          reservationId,
        };
        setSlots(newSlots);

        // Update db.json
        const response = await fetch("http://localhost:3001/reservations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: reservationId, // Use the generated reservationId
            clientId, // Use the persisted client ID
            providerId: providerId,
            date: dateKey,
            startTime: selectedSlot.time,
            endTime: addMinutes(
              new Date(`1970-01-01T${selectedSlot.time}:00`),
              15
            )
              .toISOString()
              .substring(11, 16),
            status: "pending",
            madeAt: new Date().toISOString(),
            expiresAt: addMinutes(new Date(), 15).toISOString(),
          }),
        });

        if (!response.ok) {
          console.error("Failed to update the reservation");
        }

        setModalOpen(false);

        setTimeout(async () => {
          try {
            const expireResponse = await fetch(
              `http://localhost:3001/reservations/${reservationId}`,
              {
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  status: "expired",
                }),
              }
            );

            if (!expireResponse.ok) {
              console.error("Failed to expire the reservation");
            }

            setSlots((prevSlots) => {
              const updatedSlots = { ...prevSlots };
              if (
                updatedSlots[dateKey][slotIndex].state === "reserved" &&
                updatedSlots[dateKey][slotIndex].reservationExpiresAt! <=
                  new Date()
              ) {
                updatedSlots[dateKey][slotIndex] = {
                  ...updatedSlots[dateKey][slotIndex],
                  state: "unbooked",
                };
              }
              return updatedSlots;
            });
          } catch (error) {
            console.error("Error expiring reservation:", error);
          }
        }, 15 * 60 * 1000); // 15 minutes in milliseconds
      }
    }
  };

  const handleConfirm = async () => {
    if (selectedSlot) {
      const newSlots = { ...slots };
      const dateKey = Object.keys(newSlots).find((date) =>
        newSlots[date].includes(selectedSlot)
      );
      if (dateKey) {
        const slotIndex = newSlots[dateKey].indexOf(selectedSlot);
        newSlots[dateKey][slotIndex] = {
          ...selectedSlot,
          state: "booked",
          reservationExpiresAt: undefined,
        };
        setSlots(newSlots);

        const response = await fetch(
          `http://localhost:3001/reservations/${selectedSlot.reservationId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: "confirmed",
            }),
          }
        );

        if (!response.ok) {
          console.error("Failed to update the reservation");
        }

        setModalOpen(false);
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Container>
      <Header>
        <IconButton onClick={onBack} edge="start">
          <ArrowBackIcon />
        </IconButton>
        <ScheduleHeader variant="h4">{providerName}'s Schedule</ScheduleHeader>
      </Header>
      <ScheduleList slots={slots} onSlotClick={handleSlotClick} />
      <AppointmentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onReserve={handleReserve}
        onConfirm={handleConfirm}
        slot={selectedSlot}
        modalType={modalType}
      />
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 20px;
  width: 100%;
`;

const Header = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ScheduleHeader = styled(Typography)`
  flex-grow: 1;
  font-family: "DM Sans", sans-serif;
  font-weight: 700;
  font-size: 24px;
  color: #344054;
  text-align: center;
`;
