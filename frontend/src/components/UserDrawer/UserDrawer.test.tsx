/**
 * @vitest-environment happy-dom
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import UserDrawer from './UserDrawer';

let container: any = null;

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
                expandedFeaturesAll={false}
                setExpandedFeaturesAll={vi.fn()}
            />,
            container
        );

        const bookButton = screen.queryByTestId('UserDrawerLogoutButton');
        await waitFor(() => expect(bookButton).toBeTruthy());
    });
});
