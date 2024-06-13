import React, { useState, useEffect } from "react";
import { Provider } from "../types";
import {
  CircularProgress,
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import styled from "styled-components";
import { isError } from "../utils/typeguards";

interface ProvidersListProps {
  onSelectProvider: (id: string, name: string) => void;
}

export const ProvidersList: React.FC<ProvidersListProps> = ({
  onSelectProvider,
}) => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch("http://localhost:3001/providers");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProviders(data);
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

    fetchProviders();
  }, []);

  if (loading) return <CircularProgress />;

  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <PageHeader variant="h5">Select your provider...</PageHeader>
      <CardGrid>
        {providers.map(({ id, name }) => (
          <StyledCard key={id} onClick={() => onSelectProvider(id, name)}>
            <CardActionArea>
              <CardContent>
                <ProviderName variant="h4">{name}</ProviderName>
              </CardContent>
            </CardActionArea>
          </StyledCard>
        ))}
      </CardGrid>
    </Container>
  );
};

const Container = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  gap: 40px;
  padding: 20px;
  width: 100%;
`;

const PageHeader = styled(Typography)`
  font-weight: 700;
  font-size: 16px;
  line-height: 38px;
  color: #475467;
  margin-bottom: 20px;
`;

const CardGrid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  width: 100%;
`;

const StyledCard = styled(Card)`
  width: 100%;
  max-width: 300px;
  background: #ffffff;
  border: 1px solid #f2f4f7;
  box-shadow: 0px 3px 10px #eef2f8;
  border-radius: 20px;
  transition: box-shadow 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0px 5px 15px #c4c4c4;
  }
`;

const ProviderName = styled(Typography)`
  font-weight: 700;
  font-size: 18px;
  line-height: 28px;
  color: #344054;
  margin: 0;
`;
