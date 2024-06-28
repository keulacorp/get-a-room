import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import { SnackbarProvider } from 'notistack';
import MainView from './MainView/MainView';
import LoginView from './login/LoginView';
import { CssBaseline, Divider, styled, ThemeProvider } from '@mui/material';
import { theme_2024 } from '../theme_2024';

export const GarApp = styled(Divider)(() => ({}));

const App = () => {
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
            </SnackbarProvider>
        </ThemeProvider>
    );
};

export default App;
