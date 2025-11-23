import { Days } from '../../generated/prisma/index.js';

export const getPeakHoursData = (locationIds: number[]) => [
  {
    day: [Days.MONDAY, Days.WEDNESDAY, Days.FRIDAY],
    startTime: '08:00',
    endTime: '10:00',
    note: 'Pan fresco del día anterior disponible',
    locationId: locationIds[0]
  },
  {
    day: [Days.TUESDAY, Days.THURSDAY, Days.SATURDAY],
    startTime: '14:00',
    endTime: '16:00',
    note: 'Excedentes del almuerzo',
    locationId: locationIds[1]
  },
  {
    day: [Days.SATURDAY, Days.SUNDAY],
    startTime: '18:00',
    endTime: '20:00',
    note: 'Productos próximos a vencer',
    locationId: locationIds[2]
  },
  {
    day: [Days.MONDAY, Days.TUESDAY, Days.WEDNESDAY, Days.THURSDAY, Days.FRIDAY],
    startTime: '09:00',
    endTime: '11:00',
    note: 'Pasteles y repostería del día anterior',
    locationId: locationIds[3]
  }
];
