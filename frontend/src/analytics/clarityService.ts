import { AnalyticsEventEnum, analyticsEventMap } from './AnalyticsEvent';

function isClarityEnabled(): boolean {
    // @ts-ignore
    if (!window.clarity) {
        console.log('Clarity is not enabled!');
        return false;
    }
    return true;
}

export function triggerClarityEvent(event: AnalyticsEventEnum) {
    if (isClarityEnabled()) {
        // @ts-ignore
        window.clarity('event', analyticsEventMap[event]);
    }
}
