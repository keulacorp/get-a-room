/**
 * @vitest-environment happy-dom
 */

import { DateTime, Settings } from 'luxon';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BookingView from './BookingView';
import { Booking, Room } from '../../types';
import { expect, vi } from 'vitest';
import { HTMLInputElement } from 'happy-dom';
import {
    deleteBooking,
    getBookings,
    makeBooking
} from '../../services/bookingService';
import { getRooms } from '../../services/roomService';

const mocks = vi.hoisted(() => {
    return {
        makeBookingMocked: vi.fn(),
        getBookings: async () => {
            return new Promise((resolve) => {
                resolve(fakeBookings);
            });
        },
        deleteBooking: vi.fn(),
        getRooms: async () => {
            return new Promise((resolve) => {
                resolve(fakeRooms);
            });
        }
    };
});

vi.mock('../../services/bookingService', () => ({
    getBookings: mocks.getBookings,
    makeBooking: mocks.makeBookingMocked,
    deleteBooking: mocks.deleteBooking
}));

vi.mock('../../services/roomService', () => ({
    getRooms: mocks.getRooms
}));

let preferences = {};
const setPreferences = (pref: any) => {
    preferences = pref;
};
let expandBookingDrawer = false;
const setExpandBookingDrawer = (b: boolean) => {
    expandBookingDrawer = true;
};
const toggleDrawn = (newOpen: boolean) => {
    setExpandBookingDrawer(newOpen);
};

const roomDefaults = {
    favorited: false
};
const fakeRooms: Room[] = [
    {
        ...roomDefaults,
        id: '123',
        name: 'Amor',
        building: 'Hermia 5',
        floor: '1',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 121 }).toUTC().toISO()
    },
    {
        ...roomDefaults,
        id: '124',
        name: 'Amor',
        building: 'Hermia 5',
        floor: '1',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 61 }).toUTC().toISO()
    },
    {
        ...roomDefaults,
        id: '125',
        name: 'Amor',
        building: 'Hermia 5',
        floor: '1',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 31 }).toUTC().toISO()
    },
    {
        ...roomDefaults,
        id: '126',
        name: 'Amor',
        building: 'Hermia 5',
        floor: '1',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 16 }).toUTC().toISO()
    },
    {
        ...roomDefaults,
        id: '127',
        name: 'Amor',
        building: 'Hermia 5',
        floor: '1',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 1 }).toUTC().toISO()
    }
];

vi.mock('../../hooks/useCreateNotification', () => {
    return {
        default: () => {
            return {
                createSuccessNotification: vi.fn(),
                createErrorNotification: vi.fn()
            };
        }
    };
});

const fakeBookings: Booking[] = [];

let container: any = null;
let now: DateTime = DateTime.now();

describe('AvailableRoomList', () => {
    beforeEach(() => {
        // Setup a DOM element as a render target
        container = document.createElement('div');
        document.body.appendChild(container);

        // Override luxon's DateTime.now
        now = DateTime.now();
        Settings.now = () => now.toMillis();
    });

    afterEach(() => {
        // Cleanup on exiting
        container.remove();
        container = null;
    });

    it('renders booking drawer', async () => {
        render(
            <BookingView
                preferences={preferences}
                setPreferences={setPreferences}
                open={expandBookingDrawer}
                toggle={toggleDrawn}
                name={'test'}
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea')[0];
        await waitFor(() => expect(card).toBeTruthy());

        fireEvent.click(card);

        const drawer = screen.queryAllByTestId('BottomDrawer')[0];
        await waitFor(() => expect(drawer).toBeTruthy());
    });

    it('default books for a room for 15 minutes', async () => {
        const startTime = now.toUTC().toISO();
        vi.mocked(makeBooking).mockResolvedValueOnce({
            duration: 15,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        render(
            <BookingView
                preferences={preferences}
                setPreferences={setPreferences}
                open={expandBookingDrawer}
                toggle={toggleDrawn}
                name={'test'}
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea');
        fireEvent.click(card[0]);
        const bookButton = screen.queryByTestId('BookNowButton');
        if (!bookButton) {
            throw new Error('No book button');
        }
        fireEvent.click(bookButton);

        await waitFor(() =>
            expect(vi.mocked(makeBooking)).toHaveBeenCalledWith(
                {
                    duration: 15,
                    roomId: fakeRooms[0].id,
                    startTime: startTime,
                    title: 'Reservation from Get a Room!'
                },
                true
            )
        );
    });

    it.only('books for a room for 30 minutes', async () => {
        const startTime = now.toUTC().toISO();
        vi.mocked(makeBooking).mockResolvedValueOnce({
            duration: 30,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        render(
            <BookingView
                preferences={preferences}
                setPreferences={setPreferences}
                open={expandBookingDrawer}
                toggle={toggleDrawn}
                name={'test'}
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea');
        fireEvent.click(card[0]);
        const bookButton = screen.queryByTestId('BookNowButton');
        if (!bookButton) {
            throw new Error('Button not found');
        }
        fireEvent.click(bookButton);

        await waitFor(() =>
            expect(makeBooking).toHaveBeenCalledWith(
                {
                    duration: 30,
                    roomId: fakeRooms[0].id,
                    startTime: startTime,
                    title: 'Reservation from Get a Room!'
                },
                true
            )
        );
    });

    it('books for a room for 60 minutes', async () => {
        const startTime = now.toUTC().toISO();
        vi.mocked(makeBooking).mockResolvedValueOnce({
            duration: 30,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        const { container: HTMLElement } = render(
            <BookingView
                preferences={preferences}
                setPreferences={setPreferences}
                open={expandBookingDrawer}
                toggle={toggleDrawn}
                name={'test'}
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea');
        fireEvent.click(card[0]);
        const bookButton = screen.queryByTestId('BookNowButton');
        if (!bookButton) {
            throw new Error('Button not found');
        }
        fireEvent.click(bookButton);

        await waitFor(() =>
            expect(vi.mocked(makeBooking)).toHaveBeenCalledWith(
                {
                    duration: 60,
                    roomId: fakeRooms[0].id,
                    startTime: startTime,
                    title: 'Reservation from Get a Room!'
                },
                true
            )
        );
    });

    it('books for a room for 120 minutes', async () => {
        const startTime = now.toUTC().toISO();
        vi.mocked(makeBooking).mockResolvedValueOnce({
            duration: 30,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        render(
            <BookingView
                preferences={preferences}
                setPreferences={setPreferences}
                open={expandBookingDrawer}
                toggle={toggleDrawn}
                name={'test'}
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea');
        fireEvent.click(card[0]);
        const bookButton = screen.queryByTestId('BookNowButton');
        if (!bookButton) {
            throw new Error('Button not found');
        }
        fireEvent.click(bookButton);

        await waitFor(() =>
            expect(vi.mocked(makeBooking)).toHaveBeenCalledWith(
                {
                    duration: 120,
                    roomId: fakeRooms[0].id,
                    startTime: startTime,
                    title: 'Reservation from Get a Room!'
                },
                true
            )
        );
    });
});
