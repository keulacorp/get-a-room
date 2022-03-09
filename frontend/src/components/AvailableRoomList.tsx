import React, { useState } from 'react';
import { List, Typography, Box, Switch, FormControlLabel } from '@mui/material';
import { makeBooking } from '../services/bookingService';
import { Booking, BookingDetails, Room } from '../types';
import { DateTime, Duration } from 'luxon';
import useCreateNotification from '../hooks/useCreateNotification';
import DurationPicker from './DurationPicker';
import RoomCard from './RoomCard';
import BookingDrawer from './BookingDrawer';

function disableBooking(bookings: Booking[]) {
    return bookings.length === 0 ? false : true;
}

function isAvailableFor(minutes: number, room: Room) {
    let availableUntill = DateTime.fromISO(room.nextCalendarEvent).toUTC();
    let duration = Duration.fromObject(
        availableUntill.diffNow('minutes').toObject()
    );
    return minutes <= duration.minutes;
}

type BookingListProps = {
    rooms: Room[];
    bookings: Booking[];
    updateData: () => void;
};

const AvailableRoomList = (props: BookingListProps) => {
    const { rooms, bookings, updateData } = props;

    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();

    const [bookingLoading, setBookingLoading] = useState('false');
    const [expandedFeaturesAll, setExpandedFeaturesAll] = useState(
        false as boolean
    );
    const [expandBookingDrawer, setexpandBookingDrawer] = useState(false);
    const [bookingDuration, setBookingDuration] = useState(15);
    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(
        undefined
    );

    const handleAllFeaturesCollapse = () => {
        setExpandedFeaturesAll(!expandedFeaturesAll);
    };

    const handleDurationChange = (duration: number) => {
        setBookingDuration(duration);
    };

    const handleReservation = () => {
        book(selectedRoom, bookingDuration);
        toggleDrawn(false);
    };

    const handleCardClick = (room: Room) => {
        setexpandBookingDrawer(true);
        setSelectedRoom(room);
    };

    const toggleDrawn = (newOpen: boolean) => {
        if (newOpen === false) {
            setSelectedRoom(undefined);
        }
        setexpandBookingDrawer(newOpen);
    };

    const book = (room: Room | undefined, duration: number) => {
        if (room === undefined) {
            return;
        }
        let bookingDetails: BookingDetails = {
            duration: duration,
            title: 'Reservation from Get a Room!',
            roomId: room.id
        };

        setBookingLoading(room.id);

        makeBooking(bookingDetails)
            .then((madeBooking) => {
                updateData();
                createSuccessNotification('Booking was succesful');
                setBookingLoading('false');
                document.getElementById('main-view-content')?.scrollTo(0, 0);
            })
            .catch(() => {
                createErrorNotification('Could not create booking');
                setBookingLoading('false');
            });
    };
    return (
        <Box id="available-room-list" textAlign="center" p={'16px'}>
            <div id="drawer-container">
                <BookingDrawer
                    open={expandBookingDrawer}
                    toggle={toggleDrawn}
                    bookRoom={handleReservation}
                    room={selectedRoom}
                    duration={bookingDuration}
                    handleDurationChange={handleDurationChange}
                />
            </div>

            <DurationPicker onChange={handleDurationChange} title="duration" />
            <FormControlLabel
                label={
                    <Typography
                        sx={{
                            fontSize: '18px',
                            fontWeight: 'bold'
                        }}
                    >
                        Expand room features
                    </Typography>
                }
                control={<Switch onChange={handleAllFeaturesCollapse} />}
            />
            <Typography variant="subtitle1" textAlign="left">
                Available rooms
            </Typography>
            <List>
                {rooms
                    .sort((a, b) => (a.name < b.name ? -1 : 1))
                    .map((room) =>
                        isAvailableFor(bookingDuration, room) ? (
                            <li key={room.id}>
                                <RoomCard
                                    room={room}
                                    onClick={handleCardClick}
                                    bookingLoading={bookingLoading}
                                    disableBooking={disableBooking(bookings)}
                                    isSelected={selectedRoom === room}
                                    expandFeatures={expandedFeaturesAll}
                                />
                            </li>
                        ) : null
                    )}
            </List>
        </Box>
    );
};

export default AvailableRoomList;
