/**
 * @vitest-environment happy-dom
 */

// @ts-nocheck
import {
    vi,
    expect,
    describe,
    it,
    beforeEach,
    afterEach,
    beforeAll,
    afterAll
} from 'vitest';

// @ts-nocheck
import React from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import { DateTime } from 'luxon';
import {
    fireEvent,
    render,
    screen,
    waitFor,
    getByLabelText,
    getByText
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StartingTimePickerDrawer from './StartingTimePickerDrawer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { prettyDOM } from '@testing-library/dom';
import {
    getHourMinute,
    timeFormat,
    timeToHalfAndFullHours,
    formatTimeToHalfAndFullHours
} from '../util/Time';

let container = null;

const testObj = {
    setExpandTimePickerDrawer: (arg) => {},
    setStartingTime: vi.fn()
};

describe('Starting time selection from drawer', () => {
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

    test('test with now + 30min is setted as starting time when confirm is clicked', () => {
        const handleDurationChange = vi.fn();

        const spy = vi.spyOn(testObj, 'setExpandTimePickerDrawer');
        const spyDur = vi.spyOn(testObj, 'setStartingTime');

        const mm = 300;
        const maxDur = dayjs()
            .minute(mm % 60)
            .hour(Math.floor(mm / 60));

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <StartingTimePickerDrawer
                    open={true}
                    toggle={(newOpen: any) => {}}
                    startingTime={'Now'}
                    setStartingTime={testObj.setStartingTime}
                    setExpandTimePickerDrawer={
                        testObj.setExpandTimePickerDrawer
                    }
                />
            </LocalizationProvider>,
            container
        );

        const now = DateTime.now();
        const time = formatTimeToHalfAndFullHours(now, 0);
        const timeObj = timeToHalfAndFullHours(now, 0);
        const h = timeObj.hour!;
        const m = timeObj.minute!;

        const clock = screen.getByTestId('CustomStartingTimeClock');
        const minutes = getByLabelText(clock, 'Select minutes');
        const min = getByText(minutes, (m < 10 ? '0' : '') + m.toString());
        fireEvent.click(min);
        const hours = getByLabelText(clock, 'Select hours');
        const hour = getByText(hours, (h < 10 ? '0' : '') + h.toString());
        fireEvent.click(hour);

        const btn = screen.getAllByRole('button')[1];
        fireEvent.click(btn);

        expect(testObj.setExpandTimePickerDrawer).toBeCalledTimes(1);
        expect(testObj.setExpandTimePickerDrawer).toHaveBeenCalledWith(false);
        expect(testObj.setStartingTime).toBeCalledTimes(1);
        expect(testObj.setStartingTime).toHaveBeenCalledWith(time);
    });
});
