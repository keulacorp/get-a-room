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
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import DurationPicker from './DurationPicker';

let container = null;

const testObj = {
    setExpandDurationTimePickerDrawer: (arg) => {}
};

describe('Duration selection', () => {
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

    test('Custom duration can be selected', async () => {
        const handleDurationChange = vi.fn();

        const spy = vi.spyOn(testObj, 'setExpandDurationTimePickerDrawer');

        render(
            <DurationPicker
                bookingDuration={0}
                onChange={handleDurationChange}
                setExpandDurationTimePickerDrawer={spy}
                additionalDuration={0}
            />,
            container
        );

        const customButton = screen.queryByTestId('DurationPickerCustom');

        fireEvent.click(customButton);

        expect(testObj.setExpandDurationTimePickerDrawer).toBeCalledTimes(1);
        expect(testObj.setExpandDurationTimePickerDrawer).toHaveBeenCalledWith(
            true
        );
    });
});
