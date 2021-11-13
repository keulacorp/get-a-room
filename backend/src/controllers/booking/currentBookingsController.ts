import { DateTime } from 'luxon';
import _ from 'lodash';

import { Request, Response, NextFunction } from 'express';
import currentBookingData from '../../types/currentBookingData';
import * as schema from '../../utils/googleSchema';
import * as admin from '../googleAPI/adminAPI';
import * as calendar from '../googleAPI/calendarAPI';
import * as responses from '../../utils/responses';
import { OAuth2Client } from 'google-auth-library';
import { simplifyRoomData } from '../../controllers/roomController';
import roomData from '../../types/roomData';

/**
 * Gets all the users currently active bookings
 * @returns
 */
export const getCurrentBookingsMiddleware = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const client: OAuth2Client = res.locals.oAuthClient;

            const allCurrentAndFutureBookings: schema.EventsData =
                await calendar.getCurrentBookings(client);

            res.locals.currentBookings = allCurrentAndFutureBookings;

            if (!allCurrentAndFutureBookings.items) {
                return responses.internalServerError(req, res);
            }

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Simplifies and filters current bookings
 * @returns
 */
export const simplifyAndFilterCurrentBookingsMiddleware = () => {
    const middleware = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            console.log('Toimiiko loggaus!');

            const allBookings: schema.Event[] =
                res.locals.currentBookings.items;

            console.log('res.locals.currentBookings');
            console.log(res.locals.currentBookings);
            console.log('res.locals.currentBookings');

            const rooms: schema.CalendarResource[] = await admin.getRoomData(
                res.locals.oAuthClient
            );

            console.log('Toimiiko loggaus!3333333333');

            const simplifiedBookings = simplifyBookings(allBookings, rooms);

            console.log('Toimiiko loggaus!44444444444444');
            console.log(JSON.stringify(simplifiedBookings, null, 4));
            console.log('Toimiiko loggaus!44444444444444');

            res.locals.currentBookings =
                filterCurrentBookings(simplifiedBookings);

            console.log(res.locals.currentBookings);

            next();
        } catch (err) {
            next(err);
        }
    };

    return middleware;
};

/**
 * Simlpifies bookings
 * @param simplifiedBookings List of all bookings
 * @returns simplified bookings
 */
export const simplifyBookings = (
    allBookings: schema.Event[],
    rooms: schema.CalendarResource[]
): currentBookingData[] => {
    console.log('Toimiiko loggaus! simplifyBookings sisalta!');

    // Filters away all bookings that aren't running at the moment
    const roomsSimplified: roomData[] = simplifyRoomData(rooms);

    console.log('Toimiiko loggaus! simplifyBookings sisalta!XXXXX');
    // console.log(rooms);
    console.log(allBookings);
    console.log('Toimiiko loggaus! simplifyBookings sisalta!XXXXX');

    const simplifiedBookings = allBookings.map((booking: schema.EventData) => {
        const simpleEvent: currentBookingData = {
            id: booking.id,
            startTime: booking.start?.dateTime,
            endTime: booking.end?.dateTime,
            room: null
        };
        console.log('RAJA MENEE TASS!');

        console.log('TOIMIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIii');

        // Finds the room information and includes it inside the simpleEvent
        const room = roomsSimplified.find((room: roomData) => {
            return room.location === booking.location;
        });
        simpleEvent.room = room;

        return simpleEvent;
    });

    console.log('Toimiiko loggaus! simplifyBookings sisalta!2222');
    console.log(simplifiedBookings);
    console.log('Toimiiko loggaus! simplifyBookings sisalta!2222');

    return simplifiedBookings;
};

/**
 * Filters away every booking that is not currently running
 * @param simplifiedBookings List of simplified bookings
 * @returns filtered bookings
 */
export const filterCurrentBookings = (
    simplifiedBookings: currentBookingData[]
): currentBookingData[] => {
    console.log(
        'filterCurrentBookings filterCurrentBookings filterCurrentBookings'
    );
    console.log(simplifiedBookings);
    console.log(
        'filterCurrentBookings filterCurrentBookings filterCurrentBookings'
    );

    // Filters away all bookings that aren't running at the moment
    const onlyCurrentlyRunningBookings: currentBookingData[] =
        simplifiedBookings.filter((booking: currentBookingData) => {
            if (!booking.startTime || !booking.endTime) {
                return false;
            }

            // Checks that the event has a room or other resource
            if (_.isEmpty(booking.room)) {
                return false;
            }

            const now: string = getNowDateTime();
            console.log('now now now now');
            console.log(now);
            console.log('now now now now');

            // TODO: ONGELMA TÄLLÄ HETKELLÄ SE ETTÄ TÄMÄ NOW PALAUTTAA TÄMÄNHETKISEN AJAN JA
            // SEN PITÄISI PALAUTTAA MOCKIN TARJOILEMA RETURN VALUE

            return booking.startTime <= now && booking.endTime >= now;
        });

    console.log('onlyCurrentlyRunningBookings onlyCurrentlyRunningBookings');
    console.log(onlyCurrentlyRunningBookings);
    console.log('onlyCurrentlyRunningBookings onlyCurrentlyRunningBookings');

    return onlyCurrentlyRunningBookings;
};

export const getNowDateTime = (): string => {
    return DateTime.now().toUTC().setZone('Europe/Helsinki').toISO();
};
