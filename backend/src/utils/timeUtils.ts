import { DateTime } from 'luxon';

export const getISOTime = (time: DateTime): string => {
    const timeISO: string = time.toISO() || '';

    if (timeISO === '') {
        console.error(time);
        throw new Error('Time parse error');
    }
    return timeISO;
};
