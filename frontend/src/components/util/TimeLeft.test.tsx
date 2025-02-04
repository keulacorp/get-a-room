import { cleanup, render, screen, waitFor } from '@testing-library/react';
import TimeLeft from './TimeLeft';
import { DateTime } from 'luxon';
/**
 * @vitest-environment happy-dom
 */

describe('TimeLeft', () => {
    afterEach(() => {
        cleanup();
    });

    it('shows time left as hours and minutes', async () => {
        const timeForBooking = DateTime.local()
            .plus({
                hours: 1,
                minutes: 30
            })
            .toString();

        render(
            <TimeLeft timeLeftText="Time Left: " endTime={timeForBooking} />
        );

        const timeLeftValue = await screen.findByTestId('TimeLeftTest');
        await waitFor(() =>
            expect(timeLeftValue).toHaveTextContent('1 h 29 min')
        );
    });

    it('shows time left as minutes', async () => {
        const timeForBooking = DateTime.local()
            .plus({
                minutes: 45
            })
            .toString();

        render(
            <TimeLeft timeLeftText="Time Left: " endTime={timeForBooking} />
        );

        const timeLeftValue = await screen.findByTestId('TimeLeftTest');
        await waitFor(() =>
            expect(timeLeftValue).toHaveTextContent(/4[45] min/)
        );
    });
});
