import React, { useState } from 'react';
import { Box, List, Typography } from '@mui/material';
import { DateTime, Duration } from 'luxon';
import { AddTimeDetails, Booking, Preferences, Room } from '../../types';
import {
    deleteBooking,
    endBooking,
    updateBooking
} from '../../services/bookingService';
import useCreateNotification from '../../hooks/useCreateNotification';
import RoomCard, {
    getBookingTimeLeft,
    getTimeAvailableMinutes
} from '../RoomCard/RoomCard';
import AlterBookingDrawer from './AlterBookingDrawer';
import { triggerGoogleAnalyticsEvent } from '../../analytics/googleAnalytics/googleAnalyticsService';
import {
    BookingAddTimeEvent,
    BookingDeductTimeEvent,
    BookingEndEvent,
    GoogleAnalyticsEvent
} from '../../analytics/googleAnalytics/googleAnalyticsEvents';
import { ReservationStatus } from '../../enums';

const NO_CONFIRMATION = true;

function areBookingsFetched(bookings: Booking[]) {
    return Array.isArray(bookings) && bookings.length > 0;
}

function hasBookingStarted(selectedBooking?: Booking): boolean {
    if (selectedBooking === undefined) {
        return false;
    }
    const startingTime = DateTime.fromISO(selectedBooking.startTime).toUTC();
    const dt = DateTime.now().toUTC();
    return startingTime < dt;
}

function timeLeft(selectedBooking: Booking | undefined) {
    if (selectedBooking === undefined) {
        return 0;
    }
    const startingTime = DateTime.fromISO(selectedBooking.startTime).toUTC();
    const endingTime = DateTime.fromISO(selectedBooking.endTime).toUTC();

    const duration = Duration.fromObject(
        endingTime.diff(startingTime, 'minutes').toObject()
    );

    return hasBookingStarted(selectedBooking)
        ? getBookingTimeLeft(selectedBooking)
        : Math.ceil(duration.minutes);
}

type CurrentBookingProps = {
    bookings: Booking[];
    setBookings: (bookings: Booking[]) => void;
    updateRooms: () => void;
    updateBookings: () => void;
    preferences?: Preferences;
    setPreferences: (pref: Preferences) => void;
};

const CurrentBooking = (props: CurrentBookingProps) => {
    const {
        bookings,
        updateBookings,
        preferences,
        setPreferences,
        setBookings,
        updateRooms
    } = props;

    const {
        createSuccessNotification,
        createErrorNotification,
        createNotificationWithType
    } = useCreateNotification();

    const [selectedId, setSelectedId] = useState('false');
    const [bookingProcessing, setBookingProcessing] = useState('false');
    const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(
        undefined
    );
    const [isOpenDrawer, setIsOpenDrawer] = useState(false);

    const toggleDrawer = (open: boolean) => {
        if (open === false) {
            setSelectedId('false');
        }
        setIsOpenDrawer(open);
    };

    const handleCardClick = (room: Room, booking?: Booking) => {
        setSelectedBooking(booking);
        setSelectedId(room.id);
        toggleDrawer(true);
    };

    // Add or subtract time from the current booking
    const handleAlterTime = (booking: Booking, minutes: number) => {
        let addTimeDetails: AddTimeDetails = {
            timeToAdd: minutes
        };

        setBookingProcessing(booking.room.id);
        toggleDrawer(false);

        updateBooking(addTimeDetails, booking.id, NO_CONFIRMATION)
            .then(() => {
                setBookingProcessing('false');
                // replace updated booking
                updateBookings();
                let timeAlterNotification: string;
                let bookingTimeEvent: GoogleAnalyticsEvent;
                if (minutes > 0) {
                    timeAlterNotification = 'Time added to booking';
                    bookingTimeEvent = new BookingAddTimeEvent(booking);
                } else {
                    timeAlterNotification = 'Time deducted from booking';
                    bookingTimeEvent = new BookingDeductTimeEvent(booking);
                }
                createSuccessNotification(timeAlterNotification);
                window.scrollTo(0, 0);
                triggerGoogleAnalyticsEvent(bookingTimeEvent);
            })
            .catch(() => {
                setBookingProcessing('false');
                createErrorNotification('Could not add time to booking');
            });
    };

    // End booking by changing the end time to now
    const handleEndBooking = (booking: Booking) => {
        setBookingProcessing(booking.room.id);
        toggleDrawer(false);

        endBooking(booking.id)
            .then(() => {
                setBookingProcessing('false');
                // replace updated booking
                updateBookings();
                updateRooms();
                createNotificationWithType('Booking ended', 'success');
                window.scrollTo(0, 0);
                triggerGoogleAnalyticsEvent(new BookingEndEvent(booking.room));
            })
            .catch(() => {
                setBookingProcessing('false');
                createErrorNotification('Could not end booking');
            });
    };

    const handleCancelBooking = (booking: Booking) => {
        setBookingProcessing(booking.room.id);
        toggleDrawer(false);

        deleteBooking(booking.id)
            .then(() => {
                setBookingProcessing('false');
                updateBookings();
                updateRooms();
                createSuccessNotification('Booking cancelled');
                window.scrollTo(0, 0);
            })
            .catch(() => {
                setBookingProcessing('false');
                createErrorNotification('Could not cancel booking');
            });
    };

    if (!areBookingsFetched(bookings)) {
        return null;
    }

    return (
        <Box id="current booking">
            <div id="drawer-container">
                <AlterBookingDrawer
                    open={isOpenDrawer}
                    toggle={toggleDrawer}
                    duration={timeLeft(selectedBooking)}
                    onAlterTime={handleAlterTime}
                    availableMinutes={getTimeAvailableMinutes(selectedBooking)}
                    booking={selectedBooking}
                    endBooking={handleEndBooking}
                    cancelBooking={handleCancelBooking}
                    bookingStarted={hasBookingStarted(selectedBooking)}
                />
            </div>

            <Typography
                variant="subtitle1"
                textAlign="left"
                marginLeft={'24px'}
            >
                booked to you
            </Typography>
            <List>
                {bookings.map((booking) => (
                    <li key={booking.id}>
                        <RoomCard
                            data-testid={'CurrentBookingCard'}
                            room={booking.room}
                            booking={booking}
                            onClick={handleCardClick}
                            bookingLoading={bookingProcessing}
                            disableBooking={false}
                            isSelected={booking.room.id === selectedId}
                            reservationStatus={
                                hasBookingStarted(booking)
                                    ? ReservationStatus.RESERVED
                                    : ReservationStatus.RESERVED_LATER
                            }
                            expandFeatures={true}
                            preferences={preferences}
                            setPreferences={setPreferences}
                        />
                    </li>
                ))}
            </List>
        </Box>
    );
};

export default CurrentBooking;
