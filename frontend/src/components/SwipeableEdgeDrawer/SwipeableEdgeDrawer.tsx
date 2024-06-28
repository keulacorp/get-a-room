import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import { IconButton, Stack } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import MapIcon from '@mui/icons-material/Map';
import Person from '@mui/icons-material/Person';
import FilterListIcon from '@mui/icons-material/FilterList';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { COLORS } from '../../theme_2024';

export const drawerBleeding = 88;

const Root = styled('div')(({ theme }) => ({
    height: '100%',
    backgroundColor:
        theme.palette.mode === 'light'
            ? grey[100]
            : theme.palette.background.default
}));

const DrawerHeader = styled(Box)(({ theme }) => ({
    padding: '24px',
    display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    top: -drawerBleeding,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    visibility: 'visible',
    right: 0,
    left: 0,
    boxShadow: '0px -2px 4px rgba(205, 197, 197, 0.25)',
    backgroundColor: '#fff'
}));

const FilterCounter = styled(Box)(({ theme }) => ({
    borderRadius: 50,
    display: 'flex',
    width: '20px',
    height: '20px',
    fontstyle: 'normal',
    fontWeight: 700,
    fontSize: '16px',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 0 0 8px',
    color: COLORS.BACKGROUND_PRIMARY,
    backgroundColor: COLORS.ACCENT_BLUE
}));

const DrawerTitle = styled(Typography)(({ theme }) => ({
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '24px',
    lineHeight: '24px',
    whiteSpace: 'nowrap'
}));

export const DrawerContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    margin: '0 24px 24px 24px',
    width: 'calc(100% - 48px)',
    maxWidth: '1000px'
}));

interface Props {
    children: React.ReactChild;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    filterCount?: number;
    headerTitle: String | undefined;
    isOpen: boolean;
    toggle: (open: boolean) => void;
    disableSwipeToOpen: boolean;
    mounted?: boolean;
}

const SwipeableEdgeDrawer = (props: Props) => {
    const {
        children,
        headerTitle,
        filterCount,
        iconLeft,
        isOpen,
        toggle,
        disableSwipeToOpen,
        mounted
    } = props;

    const toggleDrawer = (newOpen: boolean) => () => {
        toggle(newOpen);
    };

    let left;
    let title;
    let right;
    let filters;

    if (iconLeft === 'Map') {
        left = <MapIcon sx={{ color: '#219653' }} />;
        title = (
            <DrawerTitle sx={{ color: '#219653' }}>{headerTitle}</DrawerTitle>
        );
        right = <CloseIcon />;
    } else if (iconLeft === 'Person') {
        left = <Person />;
        title = <DrawerTitle>{headerTitle}</DrawerTitle>;
        right = <CloseIcon />;
    } else if (iconLeft === 'FilterList') {
        left = <FilterListIcon />;
        if (filterCount !== 0) {
            filters = <FilterCounter>{filterCount}</FilterCounter>;
        }

        title = <DrawerTitle>{headerTitle}</DrawerTitle>;
        if (isOpen) {
            right = <ExpandMoreIcon />;
        } else {
            right = <ExpandLessIcon />;
        }
    } else {
        left = <AccessTimeIcon />;
        title = <DrawerTitle>{headerTitle}</DrawerTitle>;
        right = <CloseIcon />;
    }

    let label;
    if (iconLeft === 'FilterList') {
        if (isOpen) {
            label = 'reduce';
        } else {
            label = 'expand';
        }
    } else {
        label = 'close';
    }

    const handleHeaderClick = () => {
        if (headerTitle === 'Filters' && isOpen === true) {
            toggle(false);
        }
    };

    return (
        <Root>
            <CssBaseline />
            <Global
                styles={{
                    '.MuiDrawer-root > .MuiPaper-root': {
                        overflow: 'visible'
                    }
                }}
            />
            <SwipeableDrawer
                data-testid="BookingDrawer"
                anchor="bottom"
                open={isOpen}
                onClose={toggleDrawer(false)}
                onOpen={toggleDrawer(true)}
                swipeAreaWidth={drawerBleeding}
                disableSwipeToOpen={disableSwipeToOpen}
                keepMounted={mounted}
                style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '1000px'
                }}
            >
                {!disableSwipeToOpen ? (
                    <DrawerHeader onClick={handleHeaderClick}>
                        <Box
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                maxWidth: '1000px'
                            }}
                        >
                            {left}
                            <Stack direction={'row'}>
                                {title}
                                {filters}
                            </Stack>
                            <IconButton
                                onClick={toggleDrawer(false)}
                                aria-label={label}
                            >
                                {right}
                            </IconButton>
                        </Box>
                    </DrawerHeader>
                ) : (
                    ''
                )}
                {children}
            </SwipeableDrawer>
        </Root>
    );
};

export default SwipeableEdgeDrawer;
