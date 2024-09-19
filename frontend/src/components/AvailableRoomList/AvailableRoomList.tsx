import { useEffect, useState } from 'react';
import { Box, List, ToggleButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Preferences, Room } from '../../types';
import RoomCard from '../RoomCard/RoomCard';
import NoRoomsCard from '../RoomCard/NoRoomsCard';
import { sortByFavoritedAndName } from '../../util/arrayUtils';
import { isAvailableFor } from '../util/AvailableTime';

const SKIP_CONFIRMATION = true;

const TimePickerButton = styled(ToggleButton)(() => ({
    padding: '8px 16px',
    backgroundColor: '#ce3b20',
    color: 'white',

    '&:hover': {
        backgroundColor: '#ce3b20',
        opacity: '90%'
    }
}));

function checkIfFavorited(room: Room, pref?: Preferences) {
    if (pref && pref.fav_rooms) {
        room.favorited = pref.fav_rooms.includes(room.id);
    } else {
        room.favorited = false;
    }
}

type BookingListProps = {
    bookingDuration: number;
    rooms: Room[];
    expandedFeaturesAll: boolean;
    preferences?: Preferences;
    setPreferences: (pref: Preferences) => void;
    startingTime: string;
    setExpandTimePickerDrawer: (show: boolean) => void;
    bookingLoading: string;
    handleCardClick: (room: Room) => void;
    selectedRoom: Room | undefined;
};

const AvailableRoomList = (props: BookingListProps) => {
    const {
        bookingDuration,
        rooms,
        expandedFeaturesAll,
        preferences,
        setPreferences,
        startingTime,
        setExpandTimePickerDrawer,
        bookingLoading,
        handleCardClick,
        selectedRoom
    } = props;

    const [updatedRooms, setUpdatedRooms] = useState<Room[]>([]);

    // Effect to update room favorited status
    useEffect(() => {
        const updateFavoritedRooms = () => {
            const roomsCopy = [...rooms]; // Make a shallow copy of rooms
            for (const room of roomsCopy) {
                checkIfFavorited(room, preferences);
            }
            setUpdatedRooms(roomsCopy); // Update state after processing all rooms
        };

        updateFavoritedRooms();
    }, [rooms, preferences]);

    return (
        <Box id="available-room-list">
            <List>
                {updatedRooms.length === 0 ? (
                    <NoRoomsCard />
                ) : (
                    sortByFavoritedAndName<Room>(updatedRooms).map((room) =>
                        isAvailableFor(bookingDuration, room, startingTime) ? (
                            <li key={room.id}>
                                <RoomCard
                                    room={room}
                                    onClick={handleCardClick}
                                    bookingLoading={bookingLoading}
                                    disableBooking={false}
                                    isSelected={selectedRoom === room}
                                    expandFeatures={expandedFeaturesAll}
                                    preferences={preferences}
                                    setPreferences={setPreferences}
                                />
                            </li>
                        ) : null
                    )
                )}
            </List>
        </Box>
    );
};

export default AvailableRoomList;
