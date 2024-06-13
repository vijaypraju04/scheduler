import React, { useState } from "react";
import { Box, Typography, Modal, Button, TextField } from "@mui/material";
import styled from "styled-components";
import { format } from "date-fns";

interface AppointmentModalProps {
  open: boolean;
  onClose: () => void;
  onReserve: (name: string, email: string) => void;
  onConfirm: () => void;
  slot: {
    time: string;
    state: "unbooked" | "reserved" | "booked";
    reservationExpiresAt?: Date;
  } | null;
  modalType: "reserve" | "confirm";
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  open,
  onClose,
  onReserve,
  onConfirm,
  slot,
  modalType,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleReserve = () => {
    onReserve(name, email);
    setName("");
    setEmail("");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent>
        {modalType === "reserve" && (
          <>
            <Typography variant="h6">Reserve Slot</Typography>
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              fullWidth
              margin="normal"
            />
            <Button variant="contained" color="primary" onClick={handleReserve}>
              Reserve
            </Button>
          </>
        )}
        {modalType === "confirm" && slot && (
          <>
            <Typography variant="h6">Confirm Reservation</Typography>
            <Typography>
              Are you sure you want to confirm your appointment on{" "}
              {format(new Date(`1970-01-01T${slot.time}:00`), "MMMM d, yyyy")}{" "}
              at {format(new Date(`1970-01-01T${slot.time}:00`), "hh:mm a")}.
            </Typography>
            <Button variant="contained" color="primary" onClick={onConfirm}>
              Confirm
            </Button>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ModalContent = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  width: 300px;
  margin: 100px auto;
`;
