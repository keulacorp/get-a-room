import { AnalyticsEventEnum } from '../AnalyticsEvent';
import { Booking, Building, Room } from '../../types';

// Basic interface for all google analytics events
export interface GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum;
    eventObject: object;
}

export class BookingEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.BOOKING;
    eventObject: object;

    constructor(room: Room, duration: number) {
        this.eventObject = {
            roomName: room.name,
            building: room.building,
            duration: duration
        };
    }
}

export class BookingEndEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.BOOKING_END;
    eventObject: object;

    constructor(room: Room) {
        this.eventObject = {
            roomName: room.name,
            building: room.building
        };
    }
}

export class BookingAddTimeEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.BOOKING_ADD_TIME;
    eventObject: object;

    constructor(booking: Booking) {
        this.eventObject = {
            roomName: booking.room.name,
            building: booking.room.building,
            bookingResources: booking.resourceStatus
        };
    }
}

export class ChooseBuildingEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.BUILDING_SELECT;
    eventObject: object;

    constructor(building: Building) {
        this.eventObject = {
            buildingName: building.name
        };
    }
}
