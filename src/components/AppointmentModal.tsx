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
    state: "unbooked" | "pending" | "confirmed";
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
  const [error, setError] = useState({ name: false, email: false });

  const handleReserve = () => {
    const isNameValid = name.trim() !== "";
    const isEmailValid = email.trim() !== "" && email.includes("@");

    if (isNameValid && isEmailValid) {
      onReserve(name, email);
      setName("");
      setEmail("");
      setError({ name: false, email: false });
    } else {
      setError({ name: !isNameValid, email: !isEmailValid });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <ModalContent>
        {modalType === "reserve" && (
          <Container>
            <Typography variant="h6">Reserve Slot</Typography>
            <StyledTextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              margin="normal"
              required
              error={error.name}
              helperText={error.name ? "Name is required" : ""}
            />
            <StyledTextField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              fullWidth
              margin="normal"
              required
              error={error.email}
              helperText={error.email ? "Valid email is required" : ""}
            />
            <StyledButton
              variant="contained"
              color="primary"
              onClick={handleReserve}
            >
              Reserve
            </StyledButton>
          </Container>
        )}
        {modalType === "confirm" && slot && (
          <Container>
            <Typography variant="h6">Confirm Reservation</Typography>
            <Typography>
              Are you sure you want to confirm your appointment on
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {format(new Date(), "MMMM d, yyyy")} at{" "}
              {format(new Date(`1970-01-01T${slot.time}:00`), "hh:mm a")}.
            </Typography>
            <StyledButton
              variant="contained"
              color="primary"
              onClick={onConfirm}
            >
              Confirm
            </StyledButton>
          </Container>
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

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StyledTextField = styled(TextField)`
  margin-bottom: 20px;
`;

const StyledButton = styled(Button)`
  align-self: flex-end;
  padding: 10px 20px;
`;
