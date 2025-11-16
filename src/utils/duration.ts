/**
 * Duration Calculation Utilities
 * Functions for calculating and formatting visit durations
 */

export interface Duration {
  hours: number;
  minutes: number;
  totalMinutes: number;
}

/**
 * Calculate duration between entry and exit times
 * @param entryTime - Visitor entry timestamp
 * @param exitTime - Visitor exit timestamp
 * @returns Duration object with hours, minutes, and total minutes
 */
export function calculateDuration(entryTime: Date, exitTime: Date): Duration {
  const diffMs = exitTime.getTime() - entryTime.getTime();
  const totalMinutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  return { hours, minutes, totalMinutes };
}

/**
 * Format duration for display in toast notifications
 * @param duration - Duration object
 * @returns Formatted string like "Permaneceu 2 horas e 30 minutos" or "Permaneceu 45 minutos"
 */
export function formatDuration(duration: Duration): string {
  const { hours, minutes } = duration;
  
  if (hours === 0) {
    return `Permaneceu ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  
  if (minutes === 0) {
    return `Permaneceu ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  
  return `Permaneceu ${hours} ${hours === 1 ? 'hora' : 'horas'} e ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
}
