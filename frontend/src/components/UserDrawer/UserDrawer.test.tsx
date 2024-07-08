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
        const userMock = jest.fn();
        render(
            <UserDrawer
                open={true}
                toggle={jest.fn()}
                name={'Test user'}
                expandedFeaturesAll={jest.fn()}
                setExpandedFeaturesAll={jest.fn()}
            />,
            container
        );

        const bookButton = screen.queryByTestId('UserDrawerLogoutButton');
        await waitFor(() => expect(bookButton).toBeTruthy());
    });
});
