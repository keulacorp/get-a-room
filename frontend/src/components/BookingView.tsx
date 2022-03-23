import React, { useState, useEffect, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

import { getRooms } from '../services/roomService';
import { getBookings } from '../services/bookingService';
import { Room, Booking, Preferences } from '../types';
import CurrentBooking from './CurrentBooking';
import AvailableRoomList from './AvailableRoomList';
import CenteredProgress from './util/CenteredProgress';
import DurationPicker from './DurationPicker';

const UPDATE_FREQUENCY = 30000;
const GET_RESERVED = true;

// Check if rooms are fetched
function areRoomsFetched(rooms: Room[]) {
    return Array.isArray(rooms) && rooms.length > 0;
}

function isActiveBooking(bookings: Booking[]) {
    return bookings.length > 0;
}

type BookingViewProps = {
    preferences?: Preferences;
};

function BookingView(props: BookingViewProps) {
    const { preferences } = props;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingDuration, setBookingDuration] = useState(15);

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

    const updateData = useCallback(() => {
        updateRooms();
        updateBookings();
    }, [updateRooms, updateBookings]);

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

    return (
        <Box id="current booking" textAlign="center" p={'16px'}>
            <Typography py={2} variant="h4" textAlign="center">
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
        </Box>
    );
}

export default BookingView;
