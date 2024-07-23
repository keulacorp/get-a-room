import { analyticsEventMap } from '../AnalyticsEvent';
import { GoogleAnalyticsEvent } from './googleAnalyticsEvents';

function isGAEnabled(): boolean {
    // @ts-ignore
    if (!window.gtag) {
        console.log('Google Analytics is not enabled!');
        return false;
    }
    return true;
}

export function triggerGoogleAnalyticsEvent(event: GoogleAnalyticsEvent) {
    if (isGAEnabled()) {
        // @ts-ignore
        window.gtag(
            'event',
            analyticsEventMap[event.eventType],
            event.eventObject
        );
    }
}
