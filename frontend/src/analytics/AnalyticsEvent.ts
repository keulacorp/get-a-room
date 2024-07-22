// Defines the common enum to use for event names across all analytics services
export enum AnalyticsEventEnum {
    BOOKING,
    BOOKING_END,
    BOOKING_ADD_TIME,
    BOOKING_DEDUCT_TIME,
    BUILDING_SELECT
}

// Defines the common event names to use across all analytics services
export const analyticsEventMap: { [key in AnalyticsEventEnum]: string } = {
    [AnalyticsEventEnum.BOOKING]: 'booking',
    [AnalyticsEventEnum.BOOKING_END]: 'bookingEnd',
    [AnalyticsEventEnum.BOOKING_ADD_TIME]: 'bookingAddTime',
    [AnalyticsEventEnum.BOOKING_DEDUCT_TIME]: 'bookingDeductTime',
    [AnalyticsEventEnum.BUILDING_SELECT]: 'buildingSelect'
};
