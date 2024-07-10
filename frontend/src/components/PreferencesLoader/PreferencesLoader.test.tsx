/**
 * @vitest-environment happy-dom
 */

// @ts-nocheck
import {
    render,
    cleanup,
    screen,
    fireEvent,
    act,
    waitFor
} from '@testing-library/react';
import { updatePreferences } from '../../services/preferencesService';

import PreferencesLoader from './PreferencesLoader';

const mockedHistoryReplace = vi.fn();

vi.mock('react-router-dom', () => ({
    useHistory: () => ({
        replace: mockedHistoryReplace
    })
}));

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

vi.mock('../../services/preferencesService');

const TEST_BUILDINGS = [
    { id: 'b1Id', name: 'b1Name', latitude: 61.4957056, longitude: 23.7993984 },
    { id: 'b2Id', name: 'b2Name', latitude: 61.4957056, longitude: 23.7993984 }
];

describe('PreferencesLoader', () => {
    beforeEach(() => {
        cleanup();
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it('renders progressbar when no preferences given', () => {
        render(<PreferencesLoader buildings={[]} setPreferences={vi.fn()} />);

        expect(screen.getByRole('progressbar')).toBeTruthy();
    });

    it('forwards to booking view when preferences are already set', () => {
        act(() => {
            render(
                <PreferencesLoader
                    preferences={{ building: TEST_BUILDINGS[0] }}
                    buildings={TEST_BUILDINGS}
                    setPreferences={vi.fn()}
                />
            );
        });

        expect(mockedHistoryReplace).toHaveBeenCalledWith('/');
    });

    it('updates preferences when submitted', async () => {
        const mockedSetPreferences = vi.fn();
        (updatePreferences as vi.Mock).mockResolvedValueOnce({
            building: TEST_BUILDINGS[1]
        });
        render(
            <PreferencesLoader
                preferences={{}}
                buildings={TEST_BUILDINGS}
                setPreferences={mockedSetPreferences}
            />
        );

        fireEvent.mouseDown(screen.getByLabelText('Office location'));
        fireEvent.click(screen.getByText(TEST_BUILDINGS[1].name));

        fireEvent.click(screen.getByText('Confirm'));

        expect(updatePreferences as vi.Mock).toHaveBeenCalledWith({
            building: TEST_BUILDINGS[1]
        });
        await waitFor(() => {
            expect(mockedSetPreferences).toHaveBeenCalledWith({
                building: TEST_BUILDINGS[1]
            });
        });
        await waitFor(() => {
            expect(mockedHistoryReplace).toHaveBeenCalledWith('/');
        });
    });
});
