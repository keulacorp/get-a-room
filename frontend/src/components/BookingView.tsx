import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box, styled } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { getRooms } from '../services/roomService';
import { getBookings } from '../services/bookingService';
import { Room, Booking, Preferences } from '../types';
import CurrentBooking from './CurrentBooking';
import AvailableRoomList from './AvailableRoomList';
import CenteredProgress from './util/CenteredProgress';
import DurationPicker from './DurationPicker';
import FilteringDrawer from './FilteringDrawer';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useHistory } from 'react-router-dom';
import SwipeableEdgeDrawer, { DrawerContent } from './SwipeableEdgeDrawer';
import BusyRoomList from './BusyRoomList';

const UPDATE_FREQUENCY = 30000;
const GET_RESERVED = true;

// Check if rooms are fetched
function areRoomsFetched(rooms: Room[]) {
    return Array.isArray(rooms) && rooms.length > 0;
}

function isActiveBooking(bookings: Booking[]) {
    return bookings.length > 0;
}

const RowCentered = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '5px',
    width: '100%'
}));

type BookingViewProps = {
    preferences?: Preferences;
    open: boolean;
    toggle: (open: boolean) => void;
};

function BookingView(props: BookingViewProps) {
    const { preferences, open, toggle } = props;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingDuration, setBookingDuration] = useState(15);
    const [expandFilteringDrawer, setexpandFilteringDrawer] = useState(false);

    const updateRooms = useCallback(() => {
        if (preferences) {
            const buildingPreference = preferences.building?.id;
            getRooms(buildingPreference, GET_RESERVED)
                .then(setRooms)
                .catch((error) => console.log(error));
        }
    }, [preferences]);

    const handleDurationChange = (newDuration: number) => {
        setBookingDuration(newDuration);
    };

    const updateBookings = useCallback(() => {
        getBookings()
            .then(setBookings)
            .catch((error) => console.log(error));
    }, []);

    const history = useHistory();

    const moveToChooseOfficePage = () => {
        history.push('/preferences');
    };

    const updateData = useCallback(() => {
        updateRooms();
        updateBookings();
    }, [updateRooms, updateBookings]);

    const toggleDrawn = (newOpen: boolean) => {
        setexpandFilteringDrawer(newOpen);
    };

    // Update data periodically
    useEffect(() => {
        // Do first update immediately
        updateData();
        const intervalId = setInterval(() => {
            if (document.visibilityState === 'visible') {
                updateData();
            }
        }, UPDATE_FREQUENCY);
        return () => clearInterval(intervalId);
    }, [updateData]);

    // Update data on window focus, hope it works on all platforms
    useEffect(() => {
        window.addEventListener('focus', updateData);
        return () => {
            window.removeEventListener('focus', updateData);
        };
    }, [updateData]);

    const openFiltering = () => {
        if (expandFilteringDrawer === false) {
            setexpandFilteringDrawer(true);
        }
    };

    return (
        <Box id="current booking" textAlign="center" p={'16px'}>
            <div id="drawer-container">
                <SwipeableEdgeDrawer
                    headerTitle={'GPS has your back!'}
                    iconLeft={'Map'}
                    iconRight={'Close'}
                    isOpen={open}
                    toggle={toggle}
                    disableSwipeToOpen={true}
                >
                    <DrawerContent>
                        <RowCentered>
                            <Typography
                                variant="body1"
                                sx={{ color: '#000000', font: 'Roboto Mono' }}
                            >
                                {preferences?.building?.name} was selected as
                                your office based on your GPS location
                            </Typography>
                        </RowCentered>
                    </DrawerContent>
                </SwipeableEdgeDrawer>
            </div>
            <Typography
                onClick={moveToChooseOfficePage}
                textAlign="left"
                variant="subtitle1"
                color={'#ce3b20'}
                paddingLeft="24px"
                paddingTop="20px"
                style={{ cursor: 'pointer' }}
                display="flex"
            >
                <ArrowBackIcon
                    style={{ width: '20px', height: '20px' }}
                ></ArrowBackIcon>
                <Typography
                    style={{
                        marginLeft: '8px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                    }}
                >
                    {preferences?.building ? preferences.building.name : 'Back'}
                </Typography>
            </Typography>
            <Typography
                py={2}
                variant="h2"
                textAlign="left"
                marginLeft="24px"
                paddingTop="0px"
                paddingBottom="24px"
            >
                Available rooms
            </Typography>

            {isActiveBooking(bookings) ? (
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        py: 2,
                        px: 3
                    }}
                >
                    <ErrorOutlineIcon />
                    <Typography
                        sx={{
                            fontSize: '18px',
                            textAlign: 'center',
                            px: 1
                        }}
                    >
                        You cannot book a new room unless you remove your
                        current booking
                    </Typography>
                </Box>
            ) : null}

            <DurationPicker onChange={handleDurationChange} title="duration" />
            <CurrentBooking
                bookings={bookings}
                updateRooms={updateRooms}
                updateBookings={updateBookings}
                setBookings={setBookings}
            />

            {!areRoomsFetched(rooms) ? (
                <CenteredProgress />
            ) : (
                <AvailableRoomList
                    bookingDuration={bookingDuration}
                    rooms={rooms}
                    bookings={bookings}
                    updateData={updateData}
                />
            )}

            {areRoomsFetched(rooms) ? <BusyRoomList rooms={rooms} /> : null}

            <div id="drawer-container" onClick={openFiltering}>
                <FilteringDrawer
                    open={expandFilteringDrawer}
                    toggle={toggleDrawn}
                />
            </div>
        </Box>
    );
}

export default BookingView;
