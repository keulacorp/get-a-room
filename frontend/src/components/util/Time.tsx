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
