import React from 'react';
import { List, Typography, Box } from '@mui/material';
import { DateTime } from 'luxon';
import RoomCard from '../RoomCard/RoomCard';
import { Booking, Preferences, Room } from '../../types';
import { useUserSettings } from '../../contexts/UserSettingsContext';

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
    if (Array.isArray(room.busy)) {
        return true;
    }
    return false;
}

type BusyRoomListProps = {
    rooms: Room[];
    bookings: Booking[];
    preferences?: Preferences;
    setPreferences: (pref: Preferences) => void;
};

const BusyRoomList = (props: BusyRoomListProps) => {
    const { rooms, bookings, preferences, setPreferences } = props;
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
                                        onClick={() => {}}
                                        disableBooking={false}
                                        isSelected={false}
                                        isBusy={false}
                                        expandFeatures={expandedFeaturesAll}
                                        bookingLoading={'false'}
                                        setPreferences={setPreferences}
                                        preferences={preferences}
                                        isReserved={true}
                                    />
                                </li>
                            ))}
                    </List>
                </>
            ) : null}
        </Box>
    );
};

/*<RoomCard
                                        room={room}
                                        onClick={handleCardClick}
                                        bookingLoading={bookingLoading}
                                        disableBooking={false}
                                        isSelected={selectedRoom === room}
                                        isBusy={false}
                                        expandFeatures={expandedFeaturesAll}
                                        setPreferences={setPreferences}
                                        preferences={preferences}
                                    /> */
export default BusyRoomList;
