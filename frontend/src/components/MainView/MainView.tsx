import { useCallback, useEffect, useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import BookingView from '../BookingView/BookingView';
import ChooseOfficeView from '../ChooseOfficeView/ChooseOfficeView';
import { Building, Preferences } from '../../types';
import {
    getPreferences,
    getPreferencesWithGPS
} from '../../services/preferencesService';
import {
    getBuildings,
    getBuildingsWithPosition
} from '../../services/buildingService';
import { Box } from '@mui/material';
import { getName } from '../../services/nameService';
import { useHistory } from 'react-router-dom';
import usePushNotificationRegistration from '../../hooks/usePushNotificationRegistration';
import { useUserSettings } from '../../contexts/UserSettingsContext';
import { useBookingDurationState } from '../BookingView/BookingDurationState';
import { styled } from '@mui/material/styles';
import { COLORS } from '../../theme_2024';

const MainContent = styled(Box)(({ theme }) => ({
    id: 'main-view', // Changed to proper object key-value pair
    display: 'flex',
    width: '100%',
    flexDirection: 'column',
    minHeight: '100vh',
    alignItems: 'center',
    backgroundColor: COLORS.BACKGROUND_PRIMARY
}));
const MainView = () => {
    const { preferences, setPreferences } = useUserSettings();
    const [buildings, setBuildings] = useState<Building[]>([]);
    const [name, setName] = useState<String>();
    const [expandBookingDrawer, setExpandBookingDrawer] = useState(false);
    const [locationAccess, setLocationAccess] = useState<PermissionStatus>();

    const history = useHistory();

    const { getBookingDuration, setBookingDuration } =
        useBookingDurationState();

    usePushNotificationRegistration();

    useEffect(() => {
        navigator.permissions
            .query({ name: 'geolocation' })
            .then((permissionStatus) => {
                setLocationAccess(permissionStatus);
                permissionStatus.onchange = () => {
                    setLocationAccess(permissionStatus);
                };
            });
    }, []);

    useEffect(() => {
        if (!locationAccess) {
            return;
        }
        if (locationAccess.state === 'granted') {
            getPreferencesWithGPS()
                .then((preference) => {
                    setPreferences(preference);
                    buildingFromLocalStorage(preference);
                })
                .catch((e) => {
                    // Redirected to login
                    console.log(e);
                });
        } else {
            getPreferences()
                .then((preferences) => {
                    setPreferences(preferences);
                })
                .catch((e) => {
                    // Redirected to login
                    console.log(e);
                });
        }
    }, [locationAccess]);

    //check the name of the building stored in the localStorage
    const buildingFromLocalStorage = (preference: {
        building: { name: string };
    }) => {
        if (
            localStorage.getItem('preferredBuildingName') ===
            preference.building.name
        ) {
            toggleDrawn(false);
        } else {
            localStorage.setItem(
                'preferredBuildingName',
                preference.building.name
            );
            toggleDrawn(true);
        }
    };

    useEffect(() => {
        getBuildings()
            .then(setBuildings)
            .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        getBuildingsWithPosition()
            .then(setBuildings)
            .catch((e) => console.log(e));
    }, []);

    useEffect(() => {
        getName().then(setName);
    }, []);

    const goToMainView = useCallback(() => {
        // Use replace in place of push because it's a temporary page and wouldn't work if navigated back to
        history.replace('/');
    }, [history]);

    useEffect(() => {
        if (preferences?.building?.id) {
            // Preferences already set
            goToMainView();
        }
    }, [preferences, goToMainView]);

    const toggleDrawn = (newOpen: boolean) => {
        setExpandBookingDrawer(newOpen);
    };

    return (
        <MainContent>
            <Box
                id="main-view-content"
                sx={{ flexGrow: 1, maxWidth: '1000px', width: '100%' }}
            >
                <Switch>
                    <Route path="/(preferences|auth/success)/">
                        <ChooseOfficeView
                            preferences={preferences}
                            setPreferences={setPreferences}
                            buildings={buildings}
                            name={name}
                            setBuildings={setBuildings}
                        />
                    </Route>
                    <Route path="/">
                        <BookingView
                            preferences={preferences}
                            setPreferences={setPreferences}
                            open={expandBookingDrawer}
                            toggle={toggleDrawn}
                            name={name}
                            getBookingDuration={getBookingDuration}
                            setBookingDuration={setBookingDuration}
                        />
                    </Route>
                </Switch>
            </Box>
        </MainContent>
    );
};

export default MainView;
