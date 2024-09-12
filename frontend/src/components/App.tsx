import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import { SnackbarProvider } from 'notistack';
import MainView from './MainView/MainView';
import LoginView from './login/LoginView';
import { CssBaseline, Divider, styled, ThemeProvider } from '@mui/material';
import { theme_2024 } from '../theme_2024';
import { UserSettingsProvider } from '../contexts/UserSettingsContext';
import { clarity } from 'react-microsoft-clarity';
import GETAROOM_ENV from '../util/getARoomEnv';

export const GarApp = styled(Divider)(() => ({
    width: '100%',
    height: '100%'
}));

const App = () => {
    if (GETAROOM_ENV().VITE_CLARITY_ID != null) {
        // Start seeing data on the Clarity dashboard with your id
        clarity.init(GETAROOM_ENV().VITE_CLARITY_ID as string);

        clarity.consent();

        // Check if Clarity has been initialized before calling its methods
        if (clarity.hasStarted()) {
            clarity.identify('USER_ID', { userProperty: 'value' });
        }
    }

    return (
        <ThemeProvider theme={theme_2024}>
            <CssBaseline />
            <SnackbarProvider
                maxSnack={1}
                dense
                style={{ marginBottom: '8vh' }}
                anchorOrigin={{
                    horizontal: 'center',
                    vertical: 'bottom'
                }}
            >
                <UserSettingsProvider value={{}}>
                    <GarApp id="app" orientation={'vertical'}>
                        <Router history={history}>
                            <Switch>
                                <Route path="/login">
                                    <LoginView />
                                </Route>
                                <Route path="/">
                                    <MainView />
                                </Route>
                            </Switch>
                        </Router>
                    </GarApp>
                </UserSettingsProvider>
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
