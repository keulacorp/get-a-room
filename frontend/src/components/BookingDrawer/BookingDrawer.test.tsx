/**
 * @vitest-environment happy-dom
 */

import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { DateTime } from 'luxon';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BookingDrawer from './BookingDrawer';
import { Room } from '../../types';

const fakeRoom: Room = {
    id: '123',
    name: 'Amor',
    building: 'Hermia 5',
    capacity: 15,
    features: ['TV', 'Whiteboard'],
    nextCalendarEvent: DateTime.now().plus({ minutes: 30 }).toUTC().toISO(),
    favorited: false
};
let container: any = null;
const bookingDrawerDefault = {
    onAddTimeUntilFull: vi.fn(),
    onAddTimeUntilHalf: vi.fn(),
    onAddTimeUntilNext: vi.fn(),
    setAdditionalDuration: vi.fn(),
    setBookingDuration: vi.fn(),
    setDuration: vi.fn(),
    setExpandDurationTimePickerDrawer: vi.fn()
};

describe('BookingDrawer', () => {
    beforeEach(() => {
        // Setup a DOM element as a render target
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        // Cleanup on exiting
        container.remove();
        container = null;
    });

    it('Books a room', async () => {
        const bookMock = vi.fn();
        render(
            <BookingDrawer
                open={true}
                toggle={vi.fn()}
                bookRoom={bookMock}
                room={fakeRoom}
                duration={15}
                additionalDuration={0}
                availableMinutes={30}
                onAddTime={vi.fn()}
                startingTime={'Now'}
                {...bookingDrawerDefault}
            />,
            container
        );

        const bookButton = screen.queryByTestId('BookNowButton');
        await waitFor(() => expect(bookButton).toBeTruthy());
        if (!bookButton) {
            throw new Error('No bookButton');
        }
        fireEvent.click(bookButton);
        expect(bookMock).toBeCalledTimes(1);
    });

    it('Disable subtract time at duration <=15 min', async () => {
        let extraTime = 0;
        const additionalTime = vi.fn((minutes) => {
            extraTime = extraTime + minutes;
        });

        render(
            <BookingDrawer
                open={true}
                toggle={vi.fn()}
                bookRoom={vi.fn()}
                room={fakeRoom}
                duration={15}
                additionalDuration={extraTime}
                availableMinutes={30}
                onAddTime={additionalTime}
                startingTime={'Now'}
                {...bookingDrawerDefault}
            />,
            container
        );

        const subtractTime = screen.queryByTestId('subtract15');
        await waitFor(() => expect(subtractTime).toBeTruthy());
        if (!subtractTime) {
            throw new Error('No time');
        }
        fireEvent.click(subtractTime);
        expect(subtractTime).toBeDisabled();
        expect(additionalTime).toBeCalledTimes(0);
        expect(extraTime).toBe(0);
    });

    it('disable add time at max duration', async () => {
        let extraTime = 0;
        const additionalTime = vi.fn((minutes) => {
            extraTime = extraTime + minutes;
        });

        render(
            <BookingDrawer
                open={true}
                toggle={vi.fn()}
                bookRoom={vi.fn()}
                room={fakeRoom}
                duration={30}
                additionalDuration={extraTime}
                availableMinutes={31}
                onAddTime={additionalTime}
                startingTime={'Now'}
                {...bookingDrawerDefault}
            />,
            container
        );

        const addTime = screen.queryByTestId('add15');
        await waitFor(() => expect(addTime).toBeTruthy());
        if (!addTime) {
            throw new Error('No time');
        }
        fireEvent.click(addTime);

        expect(addTime).toBeDisabled();
        expect(additionalTime).toBeCalledTimes(0);
        expect(extraTime).toBe(0);
    });

    it('Subtract 15 min', async () => {
        let extraTime = 0;
        const additionalTime = vi.fn((minutes) => {
            extraTime = extraTime + minutes;
        });

        render(
            <BookingDrawer
                open={true}
                toggle={vi.fn()}
                bookRoom={vi.fn()}
                room={fakeRoom}
                duration={30}
                additionalDuration={extraTime}
                availableMinutes={31}
                onAddTime={additionalTime}
                startingTime={'Now'}
                {...bookingDrawerDefault}
            />,
            container
        );

        const subtractTime = screen.queryByTestId('subtract15');
        if (!subtractTime) {
            throw new Error('No time');
        }
        fireEvent.click(subtractTime);

        expect(additionalTime).toBeCalledTimes(1);
        expect(extraTime).toBe(-15);
    });

    it('Add 15 minutes to booking', async () => {
        let extraTime = 0;
        const additionalTime = vi.fn((minutes) => {
            extraTime = extraTime + minutes;
        });

        render(
            <BookingDrawer
                open={true}
                toggle={vi.fn()}
                bookRoom={vi.fn()}
                room={fakeRoom}
                duration={15}
                additionalDuration={extraTime}
                availableMinutes={30}
                onAddTime={additionalTime}
                startingTime={'Now'}
                {...bookingDrawerDefault}
            />,
            container
        );

        const addTime = screen.queryByTestId('add15');
        if (!addTime) {
            throw new Error('No time');
        }
        fireEvent.click(addTime);

        expect(additionalTime).toBeCalledTimes(1);
        expect(extraTime).toBe(15);
    });
});
