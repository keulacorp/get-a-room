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
import DurationTimePickerDrawer from './DurationTimePickerDrawer';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { prettyDOM } from '@testing-library/dom';

let container = null;

const testObj = {
    setExpandDurationTimePickerDrawer: (arg) => {},
    setBookingDuration: vi.fn()
};

describe('Duration selection from picker', () => {
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

    test('test with value 01:45 is selected when confirmed', () => {
        const handleDurationChange = vi.fn();

        const spy = vi.spyOn(testObj, 'setExpandDurationTimePickerDrawer');
        const spyDur = vi.spyOn(testObj, 'setBookingDuration');

        const mm = 300;
        const maxDur = dayjs()
            .minute(mm % 60)
            .hour(Math.floor(mm / 60));

        render(
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DurationTimePickerDrawer
                    open={true}
                    toggle={(newOpen: any) =>
                        setExpandDurationTimePickerDrawer(newOpen)
                    }
                    bookingDuration={0}
                    setBookingDuration={testObj.setBookingDuration}
                    setExpandDurationTimePickerDrawer={
                        testObj.setExpandDurationTimePickerDrawer
                    }
                    maxDuration={maxDur}
                />
            </LocalizationProvider>,
            container
        );

        const clock = screen.getByTestId('CustomDurationClock');
        const minutes = getByLabelText(clock, 'Select minutes');
        const min45 = getByText(minutes, '45');
        fireEvent.click(min45);
        const hours = getByLabelText(clock, 'Select hours');
        const hour1 = getByText(hours, '01');
        fireEvent.click(hour1);

        const btn = screen.getByTestId('set-duration-button');

        fireEvent.click(btn);

        expect(testObj.setExpandDurationTimePickerDrawer).toBeCalledTimes(1);
        expect(testObj.setExpandDurationTimePickerDrawer).toHaveBeenCalledWith(
            false
        );
        expect(testObj.setBookingDuration).toBeCalledTimes(1);
        expect(testObj.setBookingDuration).toHaveBeenCalledWith(105);
    });
});
