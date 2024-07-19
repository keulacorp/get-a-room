import { DateTime } from 'luxon';

export const dateTimeToTimeString = (dt: DateTime) => {
    const h = dt.hour;
    const m = dt.minute;
    return [h > 9 ? '' : '0', h, ':', m > 9 ? '' : '0', m].join('');
};

export const nowDate = () => {
    const dt = new Date();
    const mm = dt.getMonth() + 1;
    const dd = dt.getDate();

    return [
        dt.getFullYear(),
        '-',
        (mm > 9 ? '' : '0') + mm,
        '-',
        (dd > 9 ? '' : '0') + dd
    ].join('');
};

export const getHourMinute = (v: any) => {
    let h = v.get('hour').toString();
    if (v.get('hour') < 10) h = '0' + h;

    let m = v.get('minute').toString();
    if (v.get('minute') < 10) m = '0' + m;

    return h + ':' + m;
};

export const timeFormat = (h: number, m: number) => {
    return (
        (h < 10 ? '0' + h.toString() : h.toString()) +
        ':' +
        (m < 10 ? '0' + m.toString() : m.toString())
    );
};

export const timeToHalfAndFullHours = (
    startingTime: DateTime,
    addition: number
): any => {
    let timeObj = DateTime.fromObject({
        hour: Number(startingTime.hour),
        minute: Number(startingTime.minute),
        second: 0
    })
        .plus({ minutes: addition })
        .toObject();

    if (timeObj.minute! < 30) {
        timeObj.minute = 30;
    } else if (timeObj.minute! > 30) {
        timeObj = DateTime.fromObject({
            hour: Number(timeObj.hour),
            minute: 0,
            second: 0
        })
            .plus({ hours: 1 })
            .toObject();
    }
    return timeObj;
};

export const formatTimeToHalfAndFullHours = (
    startingTime: DateTime,
    addition: number
) => {
    const timeObj = timeToHalfAndFullHours(startingTime, addition);
    return timeFormat(timeObj.hour!, timeObj.minute!);
};
