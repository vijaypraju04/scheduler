export interface Schedule {
  date: string;
  startTime: string;
  endTime: string;
}

export interface Provider {
  id: string;
  name: string;
}

export interface ProviderSchedule {
  providerId: string;
  availability: Schedule[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
}

export interface Reservation {
  id: string;
  clientId: string;
  providerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'unbooked' | 'pending' | 'confirmed';
  madeAt: string;
  expiresAt: string | null;
}
