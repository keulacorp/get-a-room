import { AnalyticsEventEnum, analyticsEventMap } from './AnalyticsEvent';

export const analyticsGAEventMap: { [key in AnalyticsEventEnum]: object } = {
    [AnalyticsEventEnum.BOOKING]: { booking: 'Booked a Room' },
    [AnalyticsEventEnum.CANCEL_BOOKING]: {
        cancelBooking: 'Cancelled a booked room'
    }
};

function isGAEnabled(): boolean {
    // @ts-ignore
    if (!window.gtag) {
        console.log('Google Analytics is not enabled!');
        return false;
    }
    return true;
}

export function triggerGoogleAnalyticsEvent(event: AnalyticsEventEnum) {
    if (isGAEnabled()) {
        // @ts-ignore
        window.gtag(
            'event',
            analyticsEventMap[event],
            analyticsGAEventMap[event]
        );
    }
}
