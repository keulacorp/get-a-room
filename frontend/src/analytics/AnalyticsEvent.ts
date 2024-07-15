export enum AnalyticsEventEnum {
    BOOKING,
    CANCEL_BOOKING
}

export const analyticsEventMap: { [key in AnalyticsEventEnum]: string } = {
    [AnalyticsEventEnum.BOOKING]: 'booking',
    [AnalyticsEventEnum.CANCEL_BOOKING]: 'cancelBooking'
};
