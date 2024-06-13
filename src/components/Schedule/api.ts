export const fetchProviderSchedule = async (providerId: string) => {
  const response = await fetch(
    `http://localhost:3001/schedules?providerId=${providerId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  const providerSchedule = data.find(
    (schedule: any) => schedule.providerId === providerId
  );
  return providerSchedule ? providerSchedule.availability : [];
};

export const fetchReservations = async (providerId: string) => {
  const response = await fetch(
    `http://localhost:3001/reservations?providerId=${providerId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};