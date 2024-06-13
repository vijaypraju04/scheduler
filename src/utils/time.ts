export function generateTimeSlots(startTime: string, endTime: string): string[] {
  const slots = [];
  let current = new Date(`1970-01-01T${startTime}:00`);
  const end = new Date(`1970-01-01T${endTime}:00`);

  while (current < end) {
    slots.push(current.toISOString().substring(11, 16));
    current.setMinutes(current.getMinutes() + 15);
  }

  return slots;
}
