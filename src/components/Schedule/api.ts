import { API_URL } from "../../utils/constants";

export const fetchProviderSchedule = async (providerId: string) => {
  const response = await fetch(
    `${API_URL}/schedules?providerId=${providerId}`
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
    `${API_URL}/reservations?providerId=${providerId}`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};