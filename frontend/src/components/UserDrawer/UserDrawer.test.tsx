// @ts-nocheck
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { DateTime } from 'luxon';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import BookingDrawer from './BookingDrawer';
import UserDrawer from './UserDrawer';

const fakeRoom = {
    id: '123',
    name: 'Amor',
    building: 'Hermia 5',
    capacity: 15,
    features: ['TV', 'Whiteboard'],
    nextCalendarEvent: DateTime.now().plus({ minutes: 30 }).toUTC().toISO(),
    email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com'
};
let container = null;

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

    it('Shows logout button', async () => {
        const userMock = jest.fn();
        render(
            <UserDrawer
                open={true}
                toggle={jest.fn()}
                bookRoom={userMock}
                room={fakeRoom}
                duration={15}
                additionalDuration={0}
                availableMinutes={30}
                onAddTime={jest.fn()}
                startingTime={'Now'}
            />,
            container
        );

        const bookButton = screen.queryByTestId('BookNowButton');
        await waitFor(() => expect(bookButton).toBeTruthy());

        fireEvent.click(bookButton);
        expect(userMock).toBeCalledTimes(1);
    });
});
