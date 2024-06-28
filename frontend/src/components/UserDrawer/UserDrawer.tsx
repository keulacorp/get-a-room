import { useHistory } from 'react-router-dom';
import { Logout, Visibility } from '@mui/icons-material';
import SwipeableEdgeDrawer, {
    DrawerContent
} from '../SwipeableEdgeDrawer/SwipeableEdgeDrawer';
import { DrawerButtonSecondary } from '../BookingDrawer/BookingDrawer';
import { logout } from '../../services/authService';
import useCreateNotification from '../../hooks/useCreateNotification';
import { Box, Typography } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

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

    const handleAllFeaturesCollapse = () => {
        setExpandedFeaturesAll(!expandedFeaturesAll);
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
        <SwipeableEdgeDrawer
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
                        onClick={handleAllFeaturesCollapse}
                    >
                        <Visibility aria-label="visibility" />
                        &nbsp;Show room resources
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
        </SwipeableEdgeDrawer>
    );
};

export default UserDrawer;
