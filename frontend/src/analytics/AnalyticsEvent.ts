// Defines the common enum to use for event names across all analytics services
export enum AnalyticsEventEnum {
    BOOKING,
    END_BOOKING
}

// Defines the common event names to use across all analytics services
export const analyticsEventMap: { [key in AnalyticsEventEnum]: string } = {
    [AnalyticsEventEnum.BOOKING]: 'booking',
    [AnalyticsEventEnum.END_BOOKING]: 'endBooking'
};
