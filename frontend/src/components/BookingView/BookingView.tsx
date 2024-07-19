import React, { useCallback, useEffect, useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

import { DateTime, Duration } from 'luxon';
import { getRooms } from '../../services/roomService';
import {
    deleteBooking,
    getBookings,
    makeBooking
} from '../../services/bookingService';
import { Booking, BookingDetails, Preferences, Room } from '../../types';
import CurrentBooking from '../CurrentBooking/CurrentBooking';
import AvailableRoomList from '../AvailableRoomList/AvailableRoomList';
import CenteredProgress from '../util/CenteredProgress';
import StartingTimePicker from './StartingTimePicker';
import FilteringDrawer from './FilteringDrawer';

import { useHistory } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SwipeableEdgeDrawer, {
    DrawerContent
} from '../SwipeableEdgeDrawer/SwipeableEdgeDrawer';
import UserDrawer from '../UserDrawer/UserDrawer';
import BusyRoomList from '../BusyRoomList/BusyRoomList';
import useCreateNotification from '../../hooks/useCreateNotification';
import {
    CenterAlignedStack,
    DEFAULT_STYLES,
    DefaultVerticalSpacer,
    StretchingHorizontalSpacer,
    UserIcon
} from '../../theme_2024';
import { useUserSettings } from '../../contexts/UserSettingsContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import DurationTimePickerDrawer from '../DurationTimePickerDrawer/DurationTimePickerDrawer';
import StartingTimePickerDrawer from '../StartingTimePickerDrawer/StartingTimePickerDrawer';
import BookingDrawer from '../BookingDrawer/BookingDrawer';
import { availableForMinutes } from '../util/AvailableTime';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const UPDATE_FREQUENCY = 30000;
const GET_RESERVED = true;
const SKIP_CONFIRMATION = true;

// Check if rooms are fetched
function areRoomsFetched(rooms: Room[]) {
    return Array.isArray(rooms) && rooms.length > 0;
}

const deleteDeclinedBookings = (
    notification: (message: string) => void,
    bookings: Booking[]
): Booking[] => {
    const bookingsFiltered = bookings.filter((booking) => {
        if (booking.resourceStatus === 'declined') {
            const name = booking.room.name;
            notification('Calendar declined booking: ' + name);
            deleteBooking(booking.id);
            return false;
        }
        return true;
    });
    return bookingsFiltered;
};

const RowCentered = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'left',
    padding: '0px',
    width: '100%'
}));

type BookingViewProps = {
    preferences?: Preferences;
    setPreferences: (pref: Preferences) => void;
    open: boolean;
    toggle: (open: boolean) => void;
    name: String | undefined;
};

const RoomsPageHeaderWithUserIcon = (props: { onClick: () => void }) => {
    return (
        <CenterAlignedStack
            direction={'row'}
            sx={{
                width: '100%'
            }}
            onClick={props.onClick}
        >
            <Typography variant={'h1'}>
                ROOMS
                <IconButton
                    aria-label="profile menu"
                    size="small"
                    sx={{
                        bgcolor: 'primary.main',
                        color: '#fff',
                        position: 'absolute',
                        right: 50
                    }}
                    onClick={props.onClick}
                    style={{ cursor: 'pointer' }}
                ></IconButton>
            </Typography>
            <StretchingHorizontalSpacer />
            {/*// TODO: Button not implemented*/}
            <UserIcon />
        </CenterAlignedStack>
    );
};

function BookingView(props: BookingViewProps) {
    const { preferences, open, toggle, name, setPreferences } = props;

    const [rooms, setRooms] = useState<Room[]>([]);
    const [displayRooms, setDisplayRooms] = useState<Room[]>(rooms);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [bookingDuration, setBookingDuration] = useState(15);

    const [expandFilteringDrawer, setExpandFilteringDrawer] = useState(false);

    const [startingTime, setStartingTime] = useState<string>('Now');

    // Filtering states
    const [roomSize, setRoomSize] = useState<string[]>([]);
    const [resources, setResources] = useState<string[]>([]);
    const [customFilter, setCustomFilter] = useState('');
    const [onlyFavourites, setOnlyFavourites] = useState(false);
    const [filterCount, setFilterCount] = useState(0);
    const [allFeatures, setAllFeatures] = useState<string[]>([]);

    const {
        showUserSettingsMenu,
        setShowUserSettingsMenu,
        expandedFeaturesAll,
        setExpandedFeaturesAll
    } = useUserSettings();

    const [selectedRoom, setSelectedRoom] = useState<Room | undefined>(
        undefined
    );

    const handleAdditionalDurationChange = (additionalMinutes: number) => {
        setAdditionalDuration(additionalDuration + additionalMinutes);
    };

    const updateRooms = useCallback(() => {
        if (preferences) {
            const buildingPreference = preferences.building?.id;
            getRooms(buildingPreference, GET_RESERVED)
                .then((allRooms) => {
                    setRooms(allRooms);
                })
                .catch((error) => console.log(error));
        }
    }, [preferences]);

    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();

    const [bookingLoading, setBookingLoading] = useState('false');
    const [additionalDuration, setAdditionalDuration] = useState(0);

    const book = (room: Room | undefined, duration: number) => {
        if (room === undefined) {
            return;
        }

        const bookingStartTime: string =
            startingTime === 'Now'
                ? DateTime.utc().toISO()
                : DateTime.fromFormat(startingTime, 'hh:mm').toUTC().toISO() ||
                  '';

        if (startingTime === '') {
            throw new Error('Time not set');
        }
        let bookingDetails: BookingDetails = {
            duration: duration,
            title: 'Reservation from Get a Room!',
            roomId: room.id,
            startTime: bookingStartTime
        };

        setBookingLoading(room.id);

        makeBooking(bookingDetails, SKIP_CONFIRMATION)
            .then((madeBooking) => {
                setBookings([...bookings, madeBooking]);
                updateData();
                // update data after 2.5s, waits Google Calendar to
                // accept the booking.
                setTimeout(() => {
                    updateData();
                }, 2500);
                createSuccessNotification('Booking was successful');
                setBookingLoading('false');
                document.getElementById('main-view-content')?.scrollTo(0, 0);
            })
            .catch(() => {
                createErrorNotification('Could not create booking');
                setBookingLoading('false');
            });
    };

    /**
     * Filters rooms and sets displayRooms to include matching rooms only
     * Also collects all the different features in currently shown rooms
     * so that the buttons for them can be updated.
     */
    const filterRooms = useCallback(
        (
            roomSize: string[],
            resources: string[],
            rooms: Room[],
            customFilter: string,
            onlyFavourites: boolean,
            fav_rooms: string[]
        ) => {
            // These filtering functions could be combined into one where the rooms array
            // is iterated through only once. The already small rooms array gets shaved down each pass
            // so iterating through it multiple times should not matter performance wise.
            let filteredRooms: Room[] = filterByFavourites(
                rooms,
                onlyFavourites,
                fav_rooms
            );
            filteredRooms = filterByResources(filteredRooms, resources);
            filteredRooms = filterByCustomString(filteredRooms, customFilter);
            filteredRooms = filterByRoomSize(filteredRooms, roomSize);
            setDisplayRooms(filteredRooms);

            // Collect all features in the current displayed rooms to a set to force uniqueness.
            const allFeaturesSet = new Set<string>();
            for (const room of filteredRooms) {
                if (room.features) {
                    for (var feature of room.features) {
                        allFeaturesSet.add(feature);
                    }
                }
            }
            setAllFeatures(Array.from(allFeaturesSet));
        },
        []
    );

    /**
     * Extracts the upper and lower bound values for room capacity from button
     * states. Removes rooms that don't fit between min and max capacity.
     * @param rooms Rooms to be filtered
     * @returns filtered array of rooms
     */
    const filterByRoomSize = (rooms: Room[], roomSize: string[]) => {
        if (roomSize.length === 0) {
            return rooms;
        }

        let rangeNumbers: number[] = [];
        for (var range of roomSize) {
            for (var value of range.split('-')) {
                var asNumber = parseInt(value);
                if (isNaN(asNumber)) {
                    continue;
                } else {
                    rangeNumbers.push(asNumber);
                }
            }
        }
        let minRoomSize: number = Math.min.apply(null, rangeNumbers);
        let maxRoomSize: number = Math.max.apply(null, rangeNumbers);
        let newRooms: Room[] = [];
        for (var room of rooms) {
            if (!room.capacity) {
                continue;
            }
            if (room.capacity >= minRoomSize && room.capacity <= maxRoomSize) {
                newRooms.push(room);
            }
        }
        return newRooms;
    };

    /**
     * Matches resource filters to those in rooms
     * @param rooms Rooms to be filtered
     * @returns filtered array of rooms
     */
    const filterByResources = (rooms: Room[], resources: string[]) => {
        if (resources.length === 0) {
            return rooms;
        }
        let newRooms: Room[] = [];
        for (var room of rooms) {
            if (!room.features) {
                continue;
            }
            let addToRooms = false;
            for (var resource of resources) {
                if (!room.features.includes(resource)) {
                    addToRooms = false;
                    break;
                }
                addToRooms = true;
            }
            if (addToRooms) {
                newRooms.push(room);
                addToRooms = false;
            }
        }
        return newRooms;
    };

    /**
     * Does substring matching to filter out rooms that don't match the custom
     * text filter.
     */
    const filterByCustomString = (rooms: Room[], customFilter: string) => {
        if (customFilter === '') {
            return rooms;
        }
        let newRooms: Room[] = [];
        for (var room of rooms) {
            var data = `${room.features?.toString()},${
                room.name
            },${room.capacity?.toString()}`;
            data = data?.toLowerCase();
            // Custom search string is split by ' ' and each of them is
            // treated as its own search criteria. All substrings need to be found for the room
            // to be shown.
            var customFilterArray = customFilter.split(' ');
            let addToRooms = false;
            for (var filter of customFilterArray) {
                if (!data?.includes(filter.toLowerCase())) {
                    addToRooms = false;
                    break;
                }
                addToRooms = true;
            }
            if (addToRooms) {
                newRooms.push(room);
                addToRooms = false;
            }
        }
        return newRooms;
    };

    /**
     * Filters to only include rooms that have been favourited by the user
     * @param rooms
     * @param onlyFavourites Whether the 'only favourites' button is clicked or not
     * @returns
     */
    const filterByFavourites = (
        rooms: Room[],
        onlyFavourites: boolean,
        fav_rooms: string[]
    ) => {
        if (!onlyFavourites) {
            return rooms;
        }
        let newRooms: Room[] = [];
        for (var room of rooms) {
            if (fav_rooms.includes(room.id)) {
                newRooms.push(room);
            }
        }
        return newRooms;
    };

    // Update displayed rooms when filters or rooms change
    useEffect(() => {
        filterRooms(
            roomSize,
            resources,
            rooms,
            customFilter,
            onlyFavourites,
            preferences?.fav_rooms || []
        );
    }, [
        roomSize,
        resources,
        rooms,
        customFilter,
        onlyFavourites,
        preferences?.fav_rooms,
        filterRooms
    ]);

    useEffect(() => {
        var roomSizeFiltersCount = roomSize.length;
        var resourcesFiltersCount = resources.length;
        var customFilterCount;
        var onlyFavouritesCount;
        if (customFilter === '') {
            customFilterCount = 0;
        } else {
            customFilterCount = 1;
        }
        if (onlyFavourites === false) {
            onlyFavouritesCount = 0;
        } else {
            onlyFavouritesCount = 1;
        }

        setFilterCount(
            roomSizeFiltersCount +
                resourcesFiltersCount +
                customFilterCount +
                onlyFavouritesCount
        );
    }, [roomSize, resources, customFilter, onlyFavourites]);

    const [expandTimePickerDrawer, setExpandTimePickerDrawer] = useState(false);

    const handleDurationChange = (newDuration: number) => {
        setBookingDuration(newDuration);
    };

    const updateBookings = useCallback(() => {
        getBookings()
            .then((bookings) =>
                deleteDeclinedBookings(createErrorNotification, bookings)
            )
            .then(setBookings)
            .catch((error) => console.log(error));
    }, [createErrorNotification]);

    const history = useHistory();

    const moveToChooseOfficePage = () => {
        history.push('/preferences');
    };

    const openSettingsDrawer = () => {
        setShowUserSettingsMenu(true);
    };

    const toggleSettingsDrawer = (newOpen: boolean) => {
        setShowUserSettingsMenu(newOpen);
    };

    const updateData = useCallback(() => {
        updateRooms();
        updateBookings();
    }, [updateRooms, updateBookings]);

    const toggleFilteringDrawn = (newOpen: boolean) => {
        setExpandFilteringDrawer(newOpen);
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
            setExpandFilteringDrawer(true);
        }
    };

    const [duration, setDuration] = React.useState(15);

    const [expandBookingDrawer, setExpandBookingDrawer] = useState(false);
    const [availableMinutes, setAvailableMinutes] = useState(0);

    const [expandDurationTimePickerDrawer, setExpandDurationTimePickerDrawer] =
        useState(false);

    function maxDuration(room: Room | undefined, startingTime: String) {
        const mm = availableForMinutes(room, startingTime);

        return dayjs()
            .minute(mm % 60)
            .hour(Math.floor(mm / 60));
    }
    const handleUntilHalf = () => {
        let halfTime =
            startingTime === 'Now'
                ? DateTime.now().toObject()
                : DateTime.fromObject({
                      hour: Number(startingTime.split(':')[0]),
                      minute: Number(startingTime.split(':')[1]),
                      second: 0
                  })
                      .plus({ minutes: bookingDuration })
                      .toObject();

        if (
            halfTime.hour === undefined ||
            halfTime.minute === undefined ||
            Number.isNaN(halfTime.hour) ||
            Number.isNaN(halfTime.minute)
        ) {
            throw new Error('Time not set');
        }

        if (halfTime.minute >= 30) {
            halfTime.hour = halfTime.hour + 1;
        }
        halfTime.minute = 30;
        halfTime.second = 0;
        halfTime.millisecond = 0;
        let bookUntil = DateTime.fromObject(halfTime);
        let durationToBookUntil =
            startingTime === 'Now'
                ? Duration.fromObject(bookUntil.diffNow(['minutes']).toObject())
                : Duration.fromObject(
                      bookUntil
                          .diff(
                              DateTime.fromObject({
                                  hour: Number(startingTime.split(':')[0]),
                                  minute: Number(startingTime.split(':')[1]),
                                  second: 0
                              }),
                              ['minutes']
                          )
                          .toObject()
                  );
        setAdditionalDuration(
            Math.ceil(durationToBookUntil.minutes) - bookingDuration
        );
    };

    const handleUntilFull = () => {
        let fullTime =
            startingTime === 'Now'
                ? DateTime.now().toObject()
                : DateTime.fromObject({
                      hour: Number(startingTime.split(':')[0]),
                      minute: Number(startingTime.split(':')[1]),
                      second: 0
                  })
                      .plus({ minutes: bookingDuration })
                      .toObject();
        if (
            fullTime.hour === undefined ||
            fullTime.minute === undefined ||
            Number.isNaN(fullTime.hour) ||
            Number.isNaN(fullTime.minute)
        ) {
            throw new Error('Time not set');
        }

        fullTime.hour = fullTime.hour + 1;
        fullTime.minute = 0;
        fullTime.second = 0;
        fullTime.millisecond = 0;
        let bookUntil = DateTime.fromObject(fullTime);
        let durationToBookUntil =
            startingTime === 'Now'
                ? Duration.fromObject(bookUntil.diffNow(['minutes']).toObject())
                : Duration.fromObject(
                      bookUntil
                          .diff(
                              DateTime.fromObject({
                                  hour: Number(startingTime.split(':')[0]),
                                  minute: Number(startingTime.split(':')[1]),
                                  second: 0
                              }),
                              ['minutes']
                          )
                          .toObject()
                  );
        setAdditionalDuration(
            Math.ceil(durationToBookUntil.minutes) - bookingDuration
        );
    };

    const handleUntilNextDurationChange = (additionalMinutes: number) => {
        setAdditionalDuration(additionalMinutes - bookingDuration);
    };

    const handleReservation = () => {
        book(selectedRoom, bookingDuration + additionalDuration);
        setAdditionalDuration(0);
        toggleDrawn(false);
    };
    const toggleDrawn = (newOpen: boolean) => {
        if (newOpen === false) {
            setSelectedRoom(undefined);
            setAdditionalDuration(0);
            setAvailableMinutes(0);
        }
        setExpandBookingDrawer(newOpen);
    };

    const handleCardClick = (room: Room) => {
        setExpandBookingDrawer(true);
        setSelectedRoom(room);
        setAvailableMinutes(availableForMinutes(room, startingTime));
    };

    return (
        <Box>
            <div id="drawer-container">
                <BookingDrawer
                    open={expandBookingDrawer}
                    toggle={toggleDrawn}
                    bookRoom={handleReservation}
                    room={selectedRoom}
                    duration={bookingDuration}
                    additionalDuration={additionalDuration}
                    availableMinutes={availableMinutes}
                    onAddTime={handleAdditionalDurationChange}
                    onAddTimeUntilHalf={handleUntilHalf}
                    onAddTimeUntilFull={handleUntilFull}
                    onAddTimeUntilNext={handleUntilNextDurationChange}
                    startingTime={startingTime}
                    setBookingDuration={setBookingDuration}
                    setAdditionalDuration={setAdditionalDuration}
                    setDuration={setDuration}
                    setExpandDurationTimePickerDrawer={
                        setExpandDurationTimePickerDrawer
                    }
                />
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <StartingTimePickerDrawer
                        open={expandTimePickerDrawer}
                        toggle={(newOpen: any) =>
                            setExpandTimePickerDrawer(newOpen)
                        }
                        startingTime={startingTime}
                        setStartingTime={setStartingTime}
                        setExpandTimePickerDrawer={setExpandTimePickerDrawer}
                    />
                    <DurationTimePickerDrawer
                        open={expandDurationTimePickerDrawer}
                        toggle={(newOpen: any) =>
                            setExpandDurationTimePickerDrawer(newOpen)
                        }
                        bookingDuration={bookingDuration}
                        setBookingDuration={setBookingDuration}
                        setExpandDurationTimePickerDrawer={
                            setExpandDurationTimePickerDrawer
                        }
                        maxDuration={maxDuration(selectedRoom, startingTime)}
                    />
                </LocalizationProvider>
            </div>
            <Box
                id="current booking"
                textAlign="center"
                px={'16px'}
                pb={'120px'}
            >
                <div id="gps-container">
                    <SwipeableEdgeDrawer
                        headerTitle={'GPS has your back!'}
                        iconLeft={'Map'}
                        iconRight={'Close'}
                        isOpen={open}
                        toggle={toggle}
                        disableSwipeToOpen={true}
                        zindex={1200}
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
                                <RowCentered>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#000000',
                                            font: 'Roboto Mono'
                                        }}
                                    >
                                        {preferences?.building?.name} was
                                        selected as your office based on your
                                        GPS location
                                    </Typography>
                                </RowCentered>
                            </DrawerContent>
                        </Box>
                    </SwipeableEdgeDrawer>
                </div>
                <Box
                    sx={{
                        paddingLeft: '16px',
                        marginBottom: DEFAULT_STYLES.defaultSpacer
                    }}
                >
                    <UserDrawer
                        open={showUserSettingsMenu}
                        toggle={toggleSettingsDrawer}
                        name={name}
                        expandedFeaturesAll={expandedFeaturesAll}
                        setExpandedFeaturesAll={setExpandedFeaturesAll}
                    />
                    <DefaultVerticalSpacer />
                    <CenterAlignedStack
                        direction={'row'}
                        onClick={moveToChooseOfficePage}
                    >
                        <Typography
                            textAlign="left"
                            variant="subtitle1"
                            color={'#ce3b20'}
                            style={{ cursor: 'pointer' }}
                            display="flex"
                        />
                        <ArrowBackIcon
                            sx={{ fontSize: '20px' }}
                        ></ArrowBackIcon>
                        <Box>
                            <Typography variant={'subtitle1'}>
                                {preferences?.building
                                    ? preferences.building.name
                                    : 'Back'}
                            </Typography>
                        </Box>
                    </CenterAlignedStack>
                    <RowCentered>
                        <RoomsPageHeaderWithUserIcon
                            onClick={openSettingsDrawer}
                        />
                    </RowCentered>
                </Box>
                <StartingTimePicker
                    startingTime={startingTime}
                    setStartingTime={setStartingTime}
                    title="starting time"
                    setExpandTimePickerDrawer={setExpandTimePickerDrawer}
                />

                <CurrentBooking
                    bookings={bookings}
                    updateRooms={updateRooms}
                    updateBookings={updateBookings}
                    setBookings={setBookings}
                    preferences={preferences}
                    setPreferences={setPreferences}
                />

                {!areRoomsFetched(rooms) ? (
                    <CenteredProgress />
                ) : (
                    <AvailableRoomList
                        bookingDuration={bookingDuration}
                        startingTime={startingTime}
                        setStartingTime={setStartingTime}
                        rooms={displayRooms}
                        bookings={bookings}
                        setBookings={setBookings}
                        updateData={updateData}
                        expandedFeaturesAll={expandedFeaturesAll}
                        preferences={preferences}
                        setPreferences={setPreferences}
                        setBookingDuration={setBookingDuration}
                        setDuration={setDuration}
                        setExpandTimePickerDrawer={setExpandTimePickerDrawer}
                        expandTimePickerDrawer={expandTimePickerDrawer}
                        bookingLoading={bookingLoading}
                        handleCardClick={handleCardClick}
                        selectedRoom={selectedRoom}
                    />
                )}

                {areRoomsFetched(rooms) ? (
                    <BusyRoomList
                        rooms={rooms}
                        bookings={bookings}
                        preferences={preferences}
                        setPreferences={setPreferences}
                        bookingLoading={bookingLoading}
                        handleCardClick={handleCardClick}
                        selectedRoom={selectedRoom}
                    />
                ) : null}

                <div id="filtering-container" onClick={openFiltering}>
                    <FilteringDrawer
                        open={expandFilteringDrawer}
                        toggle={toggleFilteringDrawn}
                        roomSize={roomSize}
                        setRoomSize={setRoomSize}
                        resources={resources}
                        setResources={setResources}
                        customFilter={customFilter}
                        setCustomFilter={setCustomFilter}
                        onlyFavourites={onlyFavourites}
                        setOnlyFavourites={setOnlyFavourites}
                        filterCount={filterCount}
                        allFeatures={allFeatures}
                        duration={duration}
                        setDuration={setDuration}
                        onChange={handleDurationChange}
                    />
                </div>
            </Box>
        </Box>
    );
}

export default BookingView;
