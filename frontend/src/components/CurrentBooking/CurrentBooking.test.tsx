/**
 * @vitest-environment happy-dom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CurrentBooking from './CurrentBooking';
import userEvent from '@testing-library/user-event';
import {
    endBooking,
    makeBooking,
    updateBooking
} from '../../services/bookingService';
import { Booking, Preferences } from '../../types';
import { vi } from 'vitest';

vi.mock('../../services/bookingService');

const mockedMakeBooking = vi.mocked(makeBooking, true);
const mockedEndBooking = vi.mocked(endBooking, true);
const mockedUpdateBooking = vi.mocked(updateBooking, true);
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

const fakeBooking: Booking[] = [
    {
        id: '123',
        startTime: '2021-10-21T17:32:28Z',
        endTime: '2021-10-21T19:32:28Z',
        //@ts-ignore
        room: {
            id: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com',
            name: 'Amor',
            capacity: 4,
            features: ['Jabra', 'TV', 'Webcam'],
            nextCalendarEvent: '2021-10-21T19:52:28Z'
        }
    }
];

let container: any = null;
describe.sequential('CurrentBooking', () => {
    beforeEach(() => {
        // setup a DOM element as a render target
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        // cleanup on exiting
        vi.clearAllMocks();
        container.remove();
        container = null;
    });

    it('renders booking data with correct name', async () => {
        //@ts-ignore
        render(<CurrentBooking bookings={fakeBooking} />, container);

        const title = screen.queryByTestId('BookingRoomTitle');

        await waitFor(() => expect(title).toHaveTextContent('Amor'));
    });

    it('renders alter booking drawer', async () => {
        mockedUpdateBooking.mockResolvedValueOnce({
            timeToAdd: 15
        });

        render(
            <CurrentBooking
                bookings={fakeBooking}
                setBookings={vi.fn()}
                updateRooms={vi.fn()}
                setPreferences={vi.fn()}
                updateBookings={vi.fn()}
            />,
            container
        );

        const bookingCard = await screen.queryByTestId('CardActiveArea');
        if (!bookingCard) {
            throw new Error('No bookingCard');
        }
        await userEvent.click(bookingCard);

        const drawer = screen.queryByTestId('BookingDrawer');
        await waitFor(() => expect(drawer).toBeTruthy());
    });

    it('extend booking by 15 min', async () => {
        mockedUpdateBooking.mockResolvedValueOnce({
            timeToAdd: 15,
            bookingId: fakeBooking[0].id
        });

        //@ts-ignore
        render(<CurrentBooking bookings={fakeBooking} />, container);

        const bookingCard = await screen.queryByTestId('CardActiveArea');
        if (!bookingCard) {
            throw new Error('No booking card');
        }
        await userEvent.click(bookingCard);

        const alterButton = await screen.queryByTestId('add15');
        if (!alterButton) {
            throw new Error('No booking card');
        }
        await userEvent.click(alterButton);

        await waitFor(() =>
            expect(mockedUpdateBooking).toHaveBeenCalledWith(
                { timeToAdd: 15 },
                fakeBooking[0].id,
                true
            )
        );
    });

    it('ends booking', async () => {
        mockedEndBooking.mockResolvedValueOnce({
            bookingId: fakeBooking[0].id
        });

        render(
            <CurrentBooking
                bookings={fakeBooking}
                setBookings={vi.fn()}
                setPreferences={vi.fn()}
                updateBookings={vi.fn()}
                updateRooms={vi.fn()}
            />,
            container
        );

        const bookingCard = await screen.queryByTestId('CardActiveArea');
        if (!bookingCard) {
            throw new Error('No booking card');
        }
        await userEvent.click(bookingCard);

        const endBookingButton = await screen.queryByTestId('EndBookingButton');
        if (!endBookingButton) {
            throw new Error('No endBookingButton');
        }
        await userEvent.click(endBookingButton);

        await waitFor(() =>
            expect(mockedEndBooking).toHaveBeenCalledWith(fakeBooking[0].id)
        );
    });
});
