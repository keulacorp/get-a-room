/**
 * @vitest-environment happy-dom
 */

import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { DateTime, Settings } from 'luxon';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AvailableRoomList from './AvailableRoomList';
import { makeBooking } from '../../services/bookingService';
import { an } from 'vitest/dist/reporters-yx5ZTtEV';
import { Booking } from '../../types';

const fakeRooms = [
    {
        id: '123',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now()
            .plus({ minutes: 121 })
            .toUTC()
            .toISO(),
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com'
    },
    {
        id: '124',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 61 }).toUTC().toISO(),
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com'
    },
    {
        id: '125',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 31 }).toUTC().toISO(),
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com'
    },
    {
        id: '126',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 16 }).toUTC().toISO(),
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com'
    },
    {
        id: '127',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 1 }).toUTC().toISO(),
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com'
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

vi.mock('../../services/bookingService');

const fakeBookings: Booking[] = [];

let container: any = null;
let now: DateTime | null = null;

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

    it('renders room data', async () => {
        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={15}
                startingTime="Now"
            />,
            container
        );

        const items = screen.queryAllByTestId('AvailableRoomListCard');
        await waitFor(() => expect(items).toBeTruthy());

        const title = screen.queryAllByTestId('BookingRoomTitle')[0];
        await waitFor(() => expect(title).toHaveTextContent('Amor'));
    });

    it('filters rooms available for less than 15 min', async () => {
        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={15}
                startingTime="Now"
            />,
            container
        );
        const items = screen.queryAllByTestId('AvailableRoomListCard');
        await waitFor(() => expect(items).toHaveLength(4));
    });

    it('filters rooms available less than 30 min', async () => {
        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={30}
                startingTime="Now"
            />,
            container
        );

        const items = screen.queryAllByTestId('AvailableRoomListCard');
        await waitFor(() => expect(items).toHaveLength(3));
    });

    it('filters rooms available for less than 60 min', async () => {
        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={60}
                startingTime="Now"
            />,
            container
        );

        const items = screen.queryAllByTestId('AvailableRoomListCard');
        await waitFor(() => expect(items).toHaveLength(2));
    });

    it('filters rooms available for less than 120 min', async () => {
        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={120}
                startingTime="Now"
            />,
            container
        );

        const items = screen.queryAllByTestId('AvailableRoomListCard');
        await waitFor(() => expect(items).toHaveLength(1));
    });

    it('renders booking drawer', async () => {
        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={15}
                startingTime="Now"
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea')[0];
        await waitFor(() => expect(card).toBeTruthy());

        fireEvent.click(card);

        const drawer = screen.queryAllByTestId('BookingDrawer')[0];
        await waitFor(() => expect(drawer).toBeTruthy());
    });

    it('default books for a room for 15 minutes', async () => {
        const startTime = now.toUTC().toISO();
        (makeBooking as vi.Mock).mockResolvedValueOnce({
            duration: 15,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={15}
                startingTime="Now"
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea');
        fireEvent.click(card[0]);
        const bookButton = screen.queryByTestId('BookNowButton');
        fireEvent.click(bookButton);

        await waitFor(() =>
            expect(makeBooking as vi.Mock).toHaveBeenCalledWith(
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

    it('books for a room for 30 minutes', async () => {
        const startTime = now.toUTC().toISO();
        (makeBooking as vi.Mock).mockResolvedValueOnce({
            duration: 30,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={30}
                startingTime="Now"
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea');
        fireEvent.click(card[0]);
        const bookButton = screen.queryByTestId('BookNowButton');
        fireEvent.click(bookButton);

        await waitFor(() =>
            expect(makeBooking as vi.Mock).toHaveBeenCalledWith(
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
        (makeBooking as vi.Mock).mockResolvedValueOnce({
            duration: 30,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={60}
                startingTime="Now"
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea');
        fireEvent.click(card[0]);
        const bookButton = screen.queryByTestId('BookNowButton');
        fireEvent.click(bookButton);

        await waitFor(() =>
            expect(makeBooking as vi.Mock).toHaveBeenCalledWith(
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
        (makeBooking as vi.Mock).mockResolvedValueOnce({
            duration: 30,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={120}
                startingTime="Now"
            />,
            container
        );

        const card = screen.queryAllByTestId('CardActiveArea');
        fireEvent.click(card[0]);
        const bookButton = screen.queryByTestId('BookNowButton');
        fireEvent.click(bookButton);

        await waitFor(() =>
            expect(makeBooking as vi.Mock).toHaveBeenCalledWith(
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
