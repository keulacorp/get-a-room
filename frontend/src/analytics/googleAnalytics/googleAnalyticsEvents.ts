import { AnalyticsEventEnum } from '../AnalyticsEvent';
import { Room } from '../../types';

// Basic interface for all google analytics events
export interface GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum;
    eventObject: object;
}

export class BookingEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.BOOKING;
    eventObject: object;

    constructor(room: Room) {
        this.eventObject = {
            roomName: room.name,
            building: room.building
        };
    }
}

export class EndBookingEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.END_BOOKING;
    eventObject: object;

    constructor(room: Room) {
        this.eventObject = {
            roomName: room.name,
            building: room.building
        };
    }
}
