import React from 'react';
import { Box, List, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import RoomCard from '../RoomCard/RoomCard';
import { Booking, Preferences, Room } from '../../types';
import { useUserSettings } from '../../contexts/UserSettingsContext';
import { ReservationStatus } from '../../enums';

export function roomFreeIn(room: Room) {
    let end;
    const start = DateTime.now();
    if (Array.isArray(room.busy) && room.busy.length > 0) {
        end = DateTime.fromISO(room.busy[0].end as string);
        return Math.ceil(end.diff(start, 'minutes').minutes);
    }
    return 0;
}

function filterBusyRoom(room: Room, bookings: Booking[]): boolean {
    // filter if room booked for the current user
    for (const booking of bookings) {
        if (booking.room.id === room.id) {
            return false;
        }
    }

    return room.busy != undefined;
}

type BusyRoomListProps = {
    rooms: Room[];
    bookings: Booking[];
    preferences?: Preferences;
    setPreferences: (pref: Preferences) => void;
    bookingLoading: string;
    handleCardClick: (room: Room) => void;
    selectedRoom: Room | undefined;
};

const BusyRoomList = (props: BusyRoomListProps) => {
    const {
        rooms,
        bookings,
        preferences,
        setPreferences,
        bookingLoading,
        handleCardClick,
        selectedRoom
    } = props;
    const {
        showUserSettingsMenu,
        setShowUserSettingsMenu,
        expandedFeaturesAll,
        setExpandedFeaturesAll
    } = useUserSettings();

    return (
        <Box id="available-in-30-min-room-list">
            {rooms.filter((room) => filterBusyRoom(room, bookings)).length >
            0 ? (
                <>
                    <Typography
                        variant="subtitle1"
                        textAlign="left"
                        marginLeft="24px"
                    >
                        rooms available in later time
                    </Typography>
                    <List>
                        {rooms
                            .sort((a, b) => (a.name < b.name ? -1 : 1))
                            .filter((room) => filterBusyRoom(room, bookings))
                            .map((room) => (
                                <li key={room.id}>
                                    <RoomCard
                                        room={room}
                                        onClick={handleCardClick}
                                        disableBooking={false}
                                        isSelected={selectedRoom === room}
                                        expandFeatures={expandedFeaturesAll}
                                        bookingLoading={bookingLoading}
                                        setPreferences={setPreferences}
                                        preferences={preferences}
                                        reservationStatus={
                                            ReservationStatus.BUSY
                                        }
                                        isBusy={true}
                                    />
                                </li>
                            ))}
                    </List>
                </>
            ) : null}
        </Box>
    );
};

export default BusyRoomList;
