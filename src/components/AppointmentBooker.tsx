import React, { useState } from "react";
import { ProvidersList } from "./ProvidersList";
import { ProviderSchedule } from "./Schedule/ProviderSchedule";
import { styled } from "styled-components";
import { Box, Typography } from "@mui/material";

export const AppointmentBooker: React.FC = () => {
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(
    null
  );
  const [selectedProviderName, setSelectedProviderName] = useState<
    string | null
  >(null);

  const handleProviderSelect = (providerId: string, providerName: string) => {
    setSelectedProviderId(providerId);
    setSelectedProviderName(providerName);
  };

  return (
    <AppointmentBookerContainer>
      <AppointmentPageHeader variant="h3">
        Schedule an appointment
      </AppointmentPageHeader>
      {selectedProviderId && selectedProviderName ? (
        <ProviderSchedule
          providerId={selectedProviderId}
          providerName={selectedProviderName}
          onBack={() => setSelectedProviderId(null)}
        />
      ) : (
        <ProvidersList onSelectProvider={handleProviderSelect} />
      )}
    </AppointmentBookerContainer>
  );
};

const AppointmentBookerContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
`;

const AppointmentPageHeader = styled(Typography)`
  font-weight: 700;
  font-size: 16px;
  line-height: 38px;
  color: #475467;
`;
