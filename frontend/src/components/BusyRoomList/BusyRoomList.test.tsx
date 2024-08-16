/**
 * @vitest-environment happy-dom
 */

import React from 'react';
import { DateTime } from 'luxon';
import { render, screen } from '@testing-library/react';
import BusyRoomList from './BusyRoomList';

const now = DateTime.now();

const fakeRooms = [
    {
        id: '125',
        name: 'room1',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: now.plus({ minutes: 31 }).toUTC().toISO(),
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com',
        busy: [
            {
                start: now.plus({ minutes: 31 }).toUTC().toISO(),
                end: now.plus({ minutes: 90 }).toUTC().toISO()
            }
        ]
    },
    {
        id: '126',
        name: 'room2',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: now.plus({ minutes: 16 }).toUTC().toISO(),
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com',
        busy: [
            {
                start: now.plus({ minutes: 16 }).toUTC().toISO(),
                end: now.plus({ minutes: 31 }).toUTC().toISO()
            }
        ]
    },
    {
        id: '127',
        name: 'room3',
        building: 'Hermia 5',
        capacity: 15,
        features: ['TV', 'Whiteboard'],
        nextCalendarEvent: now.plus({ minutes: 1 }).toUTC().toISO(),
        email: 'c_188fib500s84uis7kcpb6dfm93v25@resource.calendar.google.com',
        busy: [
            {
                start: now.plus({ minutes: 1 }).toUTC().toISO(),
                end: now.plus({ minutes: 30 }).toUTC().toISO()
            }
        ]
    }
];

let container: any = null;

describe('BusyRoomList', () => {
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

    it('renders rooms available in 30 minutes', async () => {
        //@ts-ignore
        render(<BusyRoomList rooms={fakeRooms} bookings={[]} />, container);

        const items = screen.queryAllByTestId('AvailableRoomListCard');
        expect(items).toBeTruthy();
        expect(items).toHaveLength(3);
    });

    it('renders correct room title', async () => {
        //@ts-ignore
        render(<BusyRoomList rooms={fakeRooms} bookings={[]} />, container);

        const titles = screen.queryAllByTestId('BookingRoomTitle');
        expect(titles).toHaveLength(3);
        expect(titles[0]).toHaveTextContent('room1');
    });
});
