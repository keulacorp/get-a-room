import { useHistory } from 'react-router-dom';
import { Logout, Visibility, VisibilityOff } from '@mui/icons-material';
import SwipeableEdgeDrawer, {
    DrawerContent
} from '../SwipeableEdgeDrawer/SwipeableEdgeDrawer';
import { DrawerButtonSecondary } from '../BookingDrawer/BookingDrawer';
import { logout } from '../../services/authService';
import useCreateNotification from '../../hooks/useCreateNotification';
import { Box, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import BottomDrawer from '../BottomDrawer/BottomDrawer';

type userSettingsProps = {
    open: boolean;
    toggle: (open: boolean) => void;
    name: String | undefined;
    expandedFeaturesAll: boolean;
    setExpandedFeaturesAll: (value: boolean) => void;
};

const UserDrawer = (props: userSettingsProps) => {
    const { open, toggle, name, expandedFeaturesAll, setExpandedFeaturesAll } =
        props;

    const history = useHistory();
    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();

    const toggleShowExpandedFeatures = () => {
        if (expandedFeaturesAll === true) {
            setExpandedFeaturesAll(false);
        } else {
            setExpandedFeaturesAll(true);
        }
    };

    const doLogout = () => {
        logout()
            .then(() => {
                createSuccessNotification('Logout successful');
                history.push('/login');
            })
            .catch(() => {
                createErrorNotification('Error in logout, try again later');
                history.push('/login');
            });
    };

    return (
        <BottomDrawer
            headerTitle={name}
            iconLeft={'Person'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={true}
        >
            <Box
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <DrawerContent>
                    <DrawerButtonSecondary
                        aria-label="settings drawer "
                        data-testid="HandleAllFeatureCollapseButton"
                        onClick={toggleShowExpandedFeatures}
                    >
                        {!expandedFeaturesAll ? (
                            <>
                                <Visibility aria-label="visibility" />
                                &nbsp;Show room resources
                            </>
                        ) : (
                            <>
                                <VisibilityOff aria-label="visibility-off" />
                                &nbsp;Hide room resources
                            </>
                        )}
                    </DrawerButtonSecondary>
                    <DrawerButtonSecondary
                        aria-label="logout"
                        data-testid="UserDrawerLogoutButton"
                        onClick={doLogout}
                    >
                        <Logout aria-label={'logout'}></Logout>
                        &nbsp;Logout
                    </DrawerButtonSecondary>
                </DrawerContent>
            </Box>
        </BottomDrawer>
    );
};

export default UserDrawer;
