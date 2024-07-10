/**
 * @vitest-environment happy-dom
 */

import React from 'react';
import { DateTime, Settings } from 'luxon';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import AvailableRoomList from './AvailableRoomList';
import { Booking, Room } from '../../types';
import { expect, vi } from 'vitest';
import { HTMLInputElement } from 'happy-dom';
import { makeBooking } from '../../services/bookingService';
vi.mock('../../services/bookingService');

const mockedMakeBooking = vi.mocked(makeBooking, true);

const roomDefaults = {
    favorited: false
};
const fakeRooms: Room[] = [
    {
        ...roomDefaults,
        id: '123',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 121 }).toUTC().toISO()
    },
    {
        ...roomDefaults,
        id: '124',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 61 }).toUTC().toISO()
    },
    {
        ...roomDefaults,
        id: '125',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 31 }).toUTC().toISO()
    },
    {
        ...roomDefaults,
        id: '126',
        name: 'Amor',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: DateTime.now().plus({ minutes: 16 }).toUTC().toISO()
    },
    {
        ...roomDefaults,
        id: '127',
        name: 'Amor',
        building: 'Hermia 5',
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

    const availableRoomDefaultMocks = {
        expandTimePickerDrawer: false,
        setBookingDuration: vi.fn(),
        setBookings: vi.fn(),
        setDuration: vi.fn(),
        setExpandTimePickerDrawer: vi.fn(),
        setPreferences: vi.fn(),
        setStartingTime: vi.fn(),
        updateData: vi.fn()
    };
    it('renders room data', async () => {
        render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={15}
                startingTime="Now"
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
        mockedMakeBooking.mockResolvedValueOnce({
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
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
            expect(mockedMakeBooking).toHaveBeenCalledWith(
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
        mockedMakeBooking.mockResolvedValueOnce({
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
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
        mockedMakeBooking.mockResolvedValueOnce({
            duration: 30,
            roomId: fakeRooms[0].id,
            startTime: startTime,
            title: 'Reservation from Get a Room!'
        });

        const { container: HTMLElement } = render(
            <AvailableRoomList
                rooms={fakeRooms}
                bookings={fakeBookings}
                bookingDuration={60}
                startingTime="Now"
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
            expect(mockedMakeBooking).toHaveBeenCalledWith(
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
        mockedMakeBooking.mockResolvedValueOnce({
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
                expandedFeaturesAll
                {...availableRoomDefaultMocks}
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
            expect(mockedMakeBooking).toHaveBeenCalledWith(
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
