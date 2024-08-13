import { Box, List, ToggleButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Booking, Preferences, Room } from '../../types';
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

export async function isFavorited(room: Room, pref?: Preferences) {
    try {
        if (pref === undefined || pref.fav_rooms === undefined) {
            return false;
        }
        if (pref.fav_rooms.includes(room.id)) {
            room.favorited = true;
        } else {
            room.favorited = false;
        }
    } catch {
        // add error notification
        room.favorited = false;
    }
}

function noAvailableRooms(rooms: Room[]) {
    return rooms.length === 0;
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

    return (
        <Box id="available-room-list">
            <div
                id="available-booking-typography"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '20px'
                }}
            >
                <Typography
                    variant="subtitle1"
                    textAlign="left"
                    marginLeft="24px"
                >
                    Available rooms:
                </Typography>
                <TimePickerButton
                    aria-label="starting-booking-time"
                    onClick={() => setExpandTimePickerDrawer(true)}
                    value={startingTime}
                >
                    {startingTime} <ArrowDropDownIcon />
                </TimePickerButton>
            </div>
            <List>
                {noAvailableRooms(rooms) ? (
                    <NoRoomsCard />
                ) : (
                    sortByFavoritedAndName<Room>(rooms).map((room) =>
                        isAvailableFor(bookingDuration, room, startingTime)
                            ? (isFavorited(room, preferences),
                              (
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
                              ))
                            : null
                    )
                )}
            </List>
        </Box>
    );
};

export default AvailableRoomList;
