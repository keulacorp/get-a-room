// Defines the common enum to use for event names across all analytics services
export enum AnalyticsEventEnum {
    BOOKING,
    BOOKING_END,
    BOOKING_ADD_TIME,
    BOOKING_DEDUCT_TIME,
    BUILDING_SELECT,
    QUICK_DURATION_SELECTION,
    TIME_CONTROL_ADD_FIFTEEN,
    TIME_CONTROL_DEDUCT_FIFTEEN,
    TIME_CONTROL_NEXT_THIRTY_MINUTES,
    TIME_CONTROL_NEXT_FULL_HOUR,
    TIME_CONTROL_WHOLE_SLOT,
    STARTING_TIME_SELECTION
}

// Defines the common event names to use across all analytics services
export const analyticsEventMap: { [key in AnalyticsEventEnum]: string } = {
    [AnalyticsEventEnum.BOOKING]: 'booking',
    [AnalyticsEventEnum.BOOKING_END]: 'bookingEnd',
    [AnalyticsEventEnum.BOOKING_ADD_TIME]: 'bookingAddTime',
    [AnalyticsEventEnum.BOOKING_DEDUCT_TIME]: 'bookingDeductTime',
    [AnalyticsEventEnum.BUILDING_SELECT]: 'buildingSelect',
    [AnalyticsEventEnum.QUICK_DURATION_SELECTION]: 'quickDurationSelection',
    [AnalyticsEventEnum.TIME_CONTROL_ADD_FIFTEEN]: 'timeControlAddFifteen',
    [AnalyticsEventEnum.TIME_CONTROL_DEDUCT_FIFTEEN]:
        'timeControlDeductFifteen',
    [AnalyticsEventEnum.TIME_CONTROL_NEXT_THIRTY_MINUTES]:
        'timeControlNextThirtyMinutes',
    [AnalyticsEventEnum.TIME_CONTROL_NEXT_FULL_HOUR]: 'timeControlNextFullHour',
    [AnalyticsEventEnum.TIME_CONTROL_WHOLE_SLOT]: 'timeControlWholeSlot',
    [AnalyticsEventEnum.STARTING_TIME_SELECTION]: 'startingTimeSelection'
};
