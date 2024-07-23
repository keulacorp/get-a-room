import { DateTime, Duration } from 'luxon';
import { Room } from '../../types';

export function availableForMinutes(
    room: Room | undefined,
    startingTime: String
) {
    if (room === undefined) {
        return 0;
    }

    let availableUntil: DateTime<true> | DateTime<false> = DateTime.now()
        .set({ hour: 23, minute: 59 })
        .toUTC();
    if (room.nextCalendarEvent) {
        availableUntil = DateTime.fromISO(room.nextCalendarEvent).toUTC();
    }

    let duration;

    if (startingTime === 'Now') {
        duration = Duration.fromObject(
            availableUntil.diffNow('minutes').toObject()
        );
    } else {
        const h = Number(startingTime.split(':')[0]);
        const m = Number(startingTime.split(':')[1]);
        const dt = DateTime.now().set({ hour: h, minute: m });
        duration = Duration.fromObject(
            availableUntil.diff(dt, 'minutes').toObject()
        );
    }
    return Math.ceil(duration.minutes);
}

export function isAvailableFor(
    minutes: number,
    room: Room,
    startingTime: String
) {
    return minutes <= availableForMinutes(room, startingTime);
}
