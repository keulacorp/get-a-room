import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { history } from '../services/axiosConfigurer';
import { theme } from '../theme';
import { SnackbarProvider } from 'notistack';
import MainView from './MainView/MainView';
import LoginView from './login/LoginView';
import { CssBaseline, Divider, styled, ThemeProvider } from '@mui/material';
import { renderToStaticMarkup } from 'react-dom/server';
import { MobileBackground, DesktopBackground } from './images/svgImages';
import { theme_2024 } from '../theme_2024';
import ToggleButton from '@mui/material/ToggleButton';
export const GarApp = styled(Divider)(() => ({}));

const App = () => {
    // Basic solution for differentiating between desktop and mobile. Switch from desktop to mobile resolution requires a page refresh
    // to show background correctly.
    let svgString = encodeURIComponent(
        renderToStaticMarkup(<MobileBackground />)
    );
    if (window.innerWidth > 600) {
        svgString = encodeURIComponent(
            renderToStaticMarkup(<DesktopBackground />)
        );
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
