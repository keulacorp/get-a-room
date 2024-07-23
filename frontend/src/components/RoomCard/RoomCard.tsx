import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Booking, Preferences, Room } from '../../types';
import { updatePreferences } from '../../services/preferencesService';
import { getNumberWithOrdinalSuffix } from '../../util/commonUtils';

import TimeLeft, {
    getTimeDiff,
    getTimeLeft,
    getTimeLeftMinutes
} from '../util/TimeLeft';

import Group from '@mui/icons-material/People';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import {
    Card,
    CardActionArea,
    CircularProgress,
    IconButton,
    Stack
} from '@mui/material';
import { minutesToSimpleString } from '../BookingDrawer/BookingDrawer';
import { DateTime, DateTimeMaybeValid } from 'luxon';
import { roomFreeIn } from '../BusyRoomList/BusyRoomList';
import { styled } from '@mui/material/styles';
import {
    CenterAlignedStack,
    CheckCircle,
    DEFAULT_STYLES,
    DoNotDisturb
} from '../../theme_2024';
import {
    Bookmark,
    BookmarkBorder,
    BookmarksOutlined
} from '@mui/icons-material';
import { dateTimeToTimeString } from '../util/Time';

function getName(room: Room) {
    return room.name;
}

function getFloor(room: Room) {
    return room.floor;
}

function getCapacity(room: Room) {
    return room.capacity;
}

function getNextCalendarEvent(room: Room) {
    return room.nextCalendarEvent;
}

function isFavorited(room: Room, pref?: Preferences) {
    if (pref === undefined) {
        return false;
    }
    const favoriteRooms = pref.fav_rooms;
    if (Array.isArray(favoriteRooms)) {
        return favoriteRooms.includes(room.id);
    }
    return false;
}

function getFeatures(room: Room) {
    let features = room.features;
    let featuresDisplay = [];

    // Format room features
    if (features) {
        for (let i = 0; i < features.length; i++) {
            featuresDisplay.push(features[i]);
            if (i !== features.length - 1) {
                featuresDisplay.push(', ');
            }
        }
    }
    return featuresDisplay;
}

export function getBookingTimeLeft(booking: Booking | undefined) {
    if (booking === undefined) {
        return 0;
    }
    return Math.ceil(getTimeLeftMinutes(booking.endTime)) + 2;
}

export function getTimeAvailableMinutes(booking: Booking | undefined) {
    if (booking === undefined) {
        return 0;
    }
    let timeLeft = getTimeLeftMinutes(booking.endTime);
    let availableFor = getTimeLeftMinutes(getNextCalendarEvent(booking.room));

    return Math.ceil(availableFor - timeLeft);
}

function busyAvailableFor(room: Room) {
    let end: DateTimeMaybeValid = DateTime.now().endOf('day');
    let start: DateTimeMaybeValid = DateTime.now();

    if (Array.isArray(room.busy) && room.busy.length > 0) {
        start = DateTime.fromISO(room.busy[0].end as string);
        if (room.busy.length > 1) {
            end = DateTime.fromISO(room.busy[1].start as string);
        }
    }
    const minutes = end.diff(start, 'minutes').minutes;
    return Math.round(minutes);
}

export const GridContainer = styled(Box)(({ theme }) => ({
    //container: true,  FIXME villep : Check this
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '16px'
}));

export const Row = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    margin: '8px'
}));

const EndBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
}));

const StartBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: '8px'
}));

export const CustomCard = styled(Card)({
    margin: '8px  0 24px 0',
    borderRadius: '10px',
    boxShadow:
        '-2px -2px 4px rgba(255, 255, 255, 0.6), 4px 4px 4px rgba(205, 197, 197, 0.25)',
    border: 'var(--border)'
});

const defaultVars = {
    '--border': 'none'
} as React.CSSProperties;

const selectedVars = {
    '--border': '1px solid #443938'
} as React.CSSProperties;

const selectedReservedVars = {
    '--border': '2px solid #219653'
} as React.CSSProperties;

type RoomCardProps = {
    room: Room;
    booking?: Booking;
    onClick: (room: Room, booking?: Booking) => void;
    preferences?: Preferences;
    setPreferences: (pref: Preferences) => void;
    bookingLoading: string;
    disableBooking: boolean;
    isReserved?: boolean;
    isSelected: boolean;
    expandFeatures: boolean;
    isBusy?: boolean;
};

const RoomCardTitleWithDescription = (props: {
    isBusy: boolean | undefined;
    room: Room;
}) => {
    return (
        <CenterAlignedStack direction={'row'} spacing={1}>
            <Typography
                data-testid="BookingRoomTitle"
                variant="h2"
                color="text.main"
            >
                {getName(props.room)}
            </Typography>
            <Typography
                variant={'h4'}
                align={'left'}
                paddingLeft={DEFAULT_STYLES.smallerSpacer}
            >
                {getNumberWithOrdinalSuffix(parseInt(getFloor(props.room)))}{' '}
                floor
            </Typography>
        </CenterAlignedStack>
    );
};

class RoomCardFavoriteButton extends React.Component<{
    onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    room: Room;
    pref: Preferences | undefined;
    busy: boolean | undefined;
}> {
    render() {
        return (
            <IconButton aria-label="favorite room" onClick={this.props.onClick}>
                {isFavorited(this.props.room, this.props.pref) ? (
                    <Bookmark sx={{ color: '#F04E30' }} />
                ) : (
                    <BookmarkBorder
                        color={this.props.busy ? 'disabled' : 'inherit'}
                    />
                )}
            </IconButton>
        );
    }
}

class RoomCardCapacityBox extends React.Component<{
    busy: boolean | undefined;
    room: Room;
}> {
    render() {
        return (
            <EndBox>
                <Group color="inherit" />
                <Typography
                    fontWeight="bold"
                    color="text.main"
                    marginLeft={'8px'}
                >
                    {getCapacity(this.props.room)}
                </Typography>
            </EndBox>
        );
    }
}

export const BusyRoomCardReservationStatusIndicator = (props: {
    room: Room;
}) => {
    return (
        <div
            style={{
                alignSelf: 'stretch',
                justifyContent: 'flex-start',
                alignItems: 'center',
                gap: 5,
                display: 'inline-flex'
            }}
        >
            <div
                style={{
                    textAlign: 'center',
                    color: '#E83520',
                    fontSize: 16,
                    fontFamily: 'Material Icons',
                    fontWeight: '400',
                    wordWrap: 'break-word'
                }}
            >
                <DoNotDisturb />
            </div>
            <div
                style={{
                    flex: '1 1 0',
                    color: '#1D1D1D',
                    fontSize: 12,
                    fontFamily: 'Studio Feixen Sans',
                    fontWeight: '4',
                    textTransform: 'uppercase',
                    wordWrap: 'break-word'
                }}
            >
                Occupied for {roomFreeIn(props.room)} minutes
            </div>
        </div>
    );
};

export const getNextCalendarEventTimeString = (room: Room) => {
    const nextStartDate = getNextCalendarEvent(room);
    const nextEvent = room.busy!.find((b) => b.start === nextStartDate);
    const start = DateTime.fromISO(nextEvent!.start!);
    let end = '';
    if (nextEvent!.end) {
        end = dateTimeToTimeString(DateTime.fromISO(nextEvent!.end!));
    }
    return dateTimeToTimeString(start) + '–' + end;
};

export const RoomCardReservationStatusIndicator = (props: {
    reserved?: boolean;
    myBookingAccepted?: boolean;
    reservationTime: number;
}) => {
    if (props.reserved === true) {
        return (
            <CenterAlignedStack direction={'row'}>
                <CheckCircle />
                <Typography marginLeft={'5px'} variant={'subtitle1'}>
                    Reserved To you for {props.reservationTime} minutes.
                </Typography>
            </CenterAlignedStack>
        );
    } else {
        return <></>;
    }
};

const ReservationStatusText = (props: {
    reserved: boolean | undefined;
    booking: Booking | undefined;
    busy: boolean | undefined;
    room: Room;
}) => {
    const myBookingAccepted =
        props.booking?.resourceStatus === 'accepted' &&
        DateTime.fromISO(props.booking.startTime) > DateTime.now();

    return (
        <>
            {props.reserved ? (
                <>
                    <Stack direction={'row'}>
                        <RoomCardReservationStatusIndicator
                            reserved={props.reserved}
                            reservationTime={getTimeDiff(
                                props.booking?.startTime!,
                                props.booking?.endTime!
                            )}
                        />
                    </Stack>
                    <Typography>
                        {props.booking && myBookingAccepted
                            ? `Your booking starts in ${getTimeLeft(
                                  props.booking.startTime
                              )}`
                            : `Available for another ${minutesToSimpleString(
                                  getTimeAvailableMinutes(props.booking)
                              )}`}
                    </Typography>
                </>
            ) : props.busy ? (
                <>
                    <BusyRoomCardReservationStatusIndicator room={props.room} />

                    <div
                        style={{
                            alignSelf: 'stretch',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            display: 'inline-flex'
                        }}
                    >
                        <div
                            style={{
                                width: 283,
                                color: '#1D1D1D',
                                fontSize: 16,
                                fontFamily: 'Studio Feixen Sans',
                                fontWeight: '2',
                                wordWrap: 'break-word'
                            }}
                        >
                            Next available slot:{' '}
                            {getNextCalendarEventTimeString(props.room)}
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <TimeLeft
                        timeLeftText="Available for "
                        endTime={getNextCalendarEvent(props.room)}
                    />
                </>
            )}
        </>
    );
};

const RoomCard = (props: RoomCardProps) => {
    const {
        room,
        booking,
        onClick,
        bookingLoading,
        disableBooking,
        isReserved,
        isSelected,
        expandFeatures,
        preferences,
        setPreferences,
        isBusy
    } = props;

    const handleClick = () => {
        if (disableBooking) {
            return;
        }
        onClick(room, booking);
    };

    const handleFavoriteClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        event.stopPropagation();
        event.preventDefault();

        if (preferences === undefined) {
            return;
        }
        let fav_rooms_now = preferences.fav_rooms as Array<string>;
        const newPrefs = preferences;

        if (isFavorited(room, preferences)) {
            fav_rooms_now = fav_rooms_now.filter(
                (roomId) => roomId !== room.id
            );
            newPrefs.fav_rooms = fav_rooms_now;

            updatePreferences(newPrefs)
                .then((savedPreferences) => {
                    setPreferences(savedPreferences);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            fav_rooms_now.push(room.id);
            newPrefs.fav_rooms = fav_rooms_now;
            updatePreferences(newPrefs)
                .then((savedPreferences) => {
                    setPreferences(savedPreferences);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const cardStyle = () => {
        if (isSelected && isReserved) {
            return selectedReservedVars;
        }
        if (isSelected) {
            return selectedVars;
        }

        return defaultVars;
    };

    const bookingTime = () => {
        if (isReserved) {
            if (booking?.resourceStatus === 'accepted') {
                if (DateTime.fromISO(booking.startTime) <= DateTime.now()) {
                    return (
                        <StartBox>
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Typography
                                variant="subtitle1"
                                color="success.main"
                                margin={'0 0 0 5px'}
                            >
                                Booked to you for {getBookingTimeLeft(booking)}{' '}
                                minutes.
                            </Typography>
                        </StartBox>
                    );
                } else {
                    return (
                        <StartBox>
                            <CheckCircleIcon color="success" fontSize="small" />
                            <Typography
                                variant="subtitle1"
                                color="success.main"
                                margin={'0 0 0 5px'}
                            >
                                Booked to you for{' '}
                                {getTimeDiff(
                                    booking.startTime,
                                    booking.endTime
                                )}{' '}
                                minutes.
                            </Typography>
                        </StartBox>
                    );
                }
            } else {
                return (
                    <StartBox>
                        <PendingIcon color="warning" fontSize="small" />
                        <Typography
                            variant="subtitle1"
                            color="warning.main"
                            margin={'0 0 0 5px'}
                        >
                            Waiting Google calendar confirmation.
                        </Typography>
                    </StartBox>
                );
            }
        }
        return null;
    };

    return (
        <CustomCard data-testid="AvailableRoomListCard" style={cardStyle()}>
            <CardActionArea
                data-testid="CardActiveArea"
                onClick={handleClick}
                component={'div'}
            >
                <GridContainer>
                    <Row>
                        <RoomCardTitleWithDescription
                            isBusy={isBusy}
                            room={room}
                        />
                        <RoomCardCapacityBox busy={isBusy} room={room} />
                    </Row>

                    {bookingTime()}

                    <Row>
                        <Stack direction={'column'}>
                            <ReservationStatusText
                                reserved={isReserved}
                                booking={booking}
                                busy={isBusy}
                                room={room}
                            />
                        </Stack>
                        {bookingLoading === room.id ? (
                            <CircularProgress color="primary" />
                        ) : null}

                        <RoomCardFavoriteButton
                            onClick={handleFavoriteClick}
                            room={room}
                            pref={preferences}
                            busy={isBusy}
                        />
                    </Row>
                    {expandFeatures ? (
                        <Row>
                            <Typography variant="h4" color="text.disabled">
                                {getFeatures(room)}
                            </Typography>
                        </Row>
                    ) : null}
                </GridContainer>
            </CardActionArea>
        </CustomCard>
    );
};

export default RoomCard;
