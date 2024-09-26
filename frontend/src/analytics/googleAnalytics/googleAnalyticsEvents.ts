import { AnalyticsEventEnum } from '../AnalyticsEvent';
import { Booking, Building, Room } from '../../types';

// Basic interface for all google analytics events
export interface GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum;
    eventObject: object;
}

export class GenericGoogleAnalyticsEvent implements GoogleAnalyticsEvent {
    eventObject: object = {};
    eventType: AnalyticsEventEnum;

    constructor(eventType: AnalyticsEventEnum) {
        this.eventType = eventType;
    }
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

export class BookingDeductTimeEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.BOOKING_DEDUCT_TIME;
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

export class QuickDurationEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.QUICK_DURATION_SELECTION;
    eventObject: object;

    constructor(quickDuration: String) {
        this.eventObject = {
            quickDuration: quickDuration
        };
    }
}

export class StartingTimeSelectionEvent implements GoogleAnalyticsEvent {
    eventType: AnalyticsEventEnum = AnalyticsEventEnum.STARTING_TIME_SELECTION;
    eventObject: object;

    constructor(startingTime: String) {
        this.eventObject = {
            startingTime: startingTime
        };
    }
}
