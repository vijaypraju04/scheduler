import React from "react";
import {
  Box,
  Typography,
  Divider,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { format } from "date-fns";
import styled from "styled-components";
import { Slot } from "./types";

interface ScheduleListProps {
  slots: { [key: string]: Slot[] };
  onSlotClick: (date: string, time: string) => void;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  slots,
  onSlotClick,
}) => {
  return (
    <StyledScheduleList>
      {Object.entries(slots).map(([date, slots]) => (
        <Box key={date} mb={3} width="100%">
          <Typography variant="h6">
            {format(new Date(date), "MMMM d, yyyy")}
          </Typography>
          <Divider />
          <Grid container spacing={2} mt={2}>
            {slots.map((slot, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  onClick={() => onSlotClick(date, slot.time)}
                  style={{
                    height: "100px",
                    display: "flex",
                    alignItems: "center",
                    cursor:
                      slot.state === "unbooked" || slot.state === "pending"
                        ? "pointer"
                        : "default",
                    backgroundColor:
                      slot.state === "confirmed"
                        ? "#d3d3d3"
                        : slot.state === "pending"
                        ? "#ffa07a"
                        : "#fff",
                  }}
                >
                  <CardContent>
                    <Typography>
                      {format(
                        new Date(`1970-01-01T${slot.time}:00`),
                        "hh:mm a"
                      )}
                    </Typography>
                    {slot.state === "pending" && (
                      <Typography variant="caption" color="textSecondary">
                        Reserved
                      </Typography>
                    )}
                    {slot.state === "confirmed" && (
                      <Typography variant="caption" color="textSecondary">
                        Booked
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}
    </StyledScheduleList>
  );
};

const StyledScheduleList = styled(Box)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;
