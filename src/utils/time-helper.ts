type TimeUnit = {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
};

export class TimeHelper {
  static convertToMilliseconds(time: TimeUnit): number {
    const {
      days = 0,
      hours = 0,
      minutes = 0,
      seconds = 0,
      milliseconds = 0,
    } = time;

    const msFromDays = days * 24 * 60 * 60 * 1000;
    const msFromHours = hours * 60 * 60 * 1000;
    const msFromMinutes = minutes * 60 * 1000;
    const msFromSeconds = seconds * 1000;

    return (
      msFromDays + msFromHours + msFromMinutes + msFromSeconds + milliseconds
    );
  }
}
