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
import { render, screen, waitFor } from '@testing-library/react';
import UserDrawer from './UserDrawer';

let container = null;

describe('UserDrawer', () => {
    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    afterEach(() => {
        container.remove();
        container = null;
    });

    it('Shows logout button', async () => {
        const userMock = vi.fn();
        render(
            <UserDrawer
                open={true}
                toggle={vi.fn()}
                name={'Test user'}
                expandedFeaturesAll={vi.fn()}
                setExpandedFeaturesAll={vi.fn()}
            />,
            container
        );

        const bookButton = screen.queryByTestId('UserDrawerLogoutButton');
        await waitFor(() => expect(bookButton).toBeTruthy());
    });
});
