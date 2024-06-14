import React, { useEffect } from "react";
import { styled } from "styled-components";
import { AppointmentBooker } from "./components/AppointmentBooker";
import { v4 as uuidv4 } from "uuid";

const App: React.FC = () => {
  return (
    <AppContainer>
      <Header>
        <h1>Appointment Booker</h1>
      </Header>
      <main>
        <AppointmentBooker />
      </main>
    </AppContainer>
  );
};

export default App;

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  gap: 40px;
`;

const Header = styled.header`
  font-size: 32px;
  margin: 20px;
`;
