import * as React from 'react';
import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Booking, Preferences, Room } from '../../types';
import { updatePreferences } from '../../services/preferencesService';

import TimeLeft, {
    getTimeDiff,
    getTimeLeft,
    getTimeLeftMinutes
} from '../util/TimeLeft';

import Group from '@mui/icons-material/People';
import { Card, CardActionArea, CircularProgress, Stack } from '@mui/material';
import { minutesToSimpleString } from '../BookingDrawer/BookingDrawer';
import { DateTime, DateTimeMaybeValid } from 'luxon';
import { roomFreeIn } from '../BusyRoomList/BusyRoomList';
import { styled } from '@mui/material/styles';
import {
    CenterAlignedStack,
    CheckCircle,
    DoNotDisturb,
    ScheduleCircle
} from '../../theme_2024';
import { dateTimeToTimeString } from '../util/Time';
import { ReservationStatus } from '../../enums';
import BookmarkButton from '../util/bookmarkButton';
import Floor from '../../icons/Floor';

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
    // If the booking is ongoing, i.e start time is before "now", then do getTimeLeftMinutes
    // Otherwise just get the total duration of the booking
    return DateTime.fromISO(booking.startTime) <= DateTime.now()
        ? Math.ceil(getTimeLeftMinutes(booking.endTime)) + 2
        : getTimeDiff(booking.startTime, booking.endTime);
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
    alignItems: 'center',
    gap: '16px'
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
    reservationStatus?: ReservationStatus;
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
            <Box sx={{ width: '100%' }}>
                <Typography
                    data-testid="BookingRoomTitle"
                    variant="h2"
                    color="text.main"
                    sx={{
                        wordWrap: 'break-word',
                        whiteSpace: 'normal', // Ensures long text wraps
                        overflowWrap: 'break-word'
                    }}
                >
                    {getName(props.room)}
                </Typography>
            </Box>
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
            <BookmarkButton
                onClick={this.props.onClick}
                isSelected={isFavorited(this.props.room, this.props.pref)}
                changeColor={this.props.busy}
            />
        );
    }
}

class RoomCardIndicatorsBox extends React.Component<{
    busy: boolean | undefined;
    room: Room;
}> {
    render() {
        return (
            <>
                <EndBox>
                    <Stack direction={'row'}>
                        <Floor />
                        <Typography variant={'h3'} marginLeft={'8px'}>
                            {getFloor(this.props.room)}
                        </Typography>
                    </Stack>
                    <Stack direction={'row'}>
                        <Group color="inherit" />
                        <Typography variant={'h3'} marginLeft={'8px'}>
                            {getCapacity(this.props.room)}
                        </Typography>
                    </Stack>
                </EndBox>
            </>
        );
    }
}

const BusyRoomStatusContent = styled('div')(({ theme }) => ({
    alignSelf: 'stretch',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 5,
    display: 'inline-flex'
}));

const BusyRoomStatusIcon = styled('div')(({ theme }) => ({
    textAlign: 'center',
    color: '#E83520',
    fontSize: 16,
    fontFamily: 'Material Icons',
    fontWeight: '400',
    wordWrap: 'break-word'
}));

type BusyRoomStatusTextContentProps = {
    props?: {
        flex?: string;
        width?: number;
        fontSize?: number;
        fontWeight?: string | number;
    };
};
const BusyRoomStatusTextContent = styled('div')<BusyRoomStatusTextContentProps>(
    ({ theme, props }) => ({
        color: '#1D1D1D',
        fontSize: 12,
        fontFamily: 'Studio Feixen Sans',
        fontWeight: '4',
        textTransform: 'uppercase',
        wordWrap: 'break-word',
        ...props
    })
);
export const BusyRoomCardReservationStatusIndicator = (props: {
    room: Room;
}) => {
    return (
        <BusyRoomStatusContent>
            <BusyRoomStatusIcon>
                <DoNotDisturb />
            </BusyRoomStatusIcon>
            <BusyRoomStatusTextContent
                props={{
                    flex: '1 1 0',
                    fontSize: 12
                }}
            >
                Occupied for {roomFreeIn(props.room)} minutes
            </BusyRoomStatusTextContent>
        </BusyRoomStatusContent>
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
    reserved: ReservationStatus;
    booking: Booking;
    myBookingAccepted?: boolean;
}) => {
    const reservationTime = useMemo(
        () => getBookingTimeLeft(props.booking),
        [props.booking]
    );
    const statusIcon =
        props.reserved === ReservationStatus.RESERVED ? (
            <CheckCircle />
        ) : (
            <ScheduleCircle />
        );
    const textColor =
        props.reserved === ReservationStatus.RESERVED ? '#388641' : '#F2BB32';

    const StrongText = styled('strong')(({ theme }) => ({}));

    const reservedText = useMemo(() => {
        let textElement = <></>;

        if (props.reserved === ReservationStatus.RESERVED) {
            textElement = (
                <Typography>
                    Reserved To you for{' '}
                    <StrongText>{reservationTime}</StrongText> minutes.
                </Typography>
            );
        }

        if (props.reserved === ReservationStatus.RESERVED_LATER) {
            textElement = (
                <Typography>
                    Pre booked at{' '}
                    <StrongText>
                        {DateTime.fromISO(props.booking.startTime)
                            .toFormat('HH:mm')
                            .toString()}
                    </StrongText>{' '}
                    for <StrongText>{reservationTime}</StrongText> minutes.
                </Typography>
            );
        }
        return textElement;
    }, [
        props.reserved,
        props.myBookingAccepted,
        props.booking,
        reservationTime
    ]);

    return (
        <CenterAlignedStack direction={'row'}>
            {statusIcon}
            <Typography
                color={textColor}
                marginLeft={'5px'}
                variant={'subtitle1'}
            >
                {reservedText}
            </Typography>
        </CenterAlignedStack>
    );
};

const ReservationStatusText = (props: {
    reservationStatus: ReservationStatus | undefined;
    booking: Booking | undefined;
    busy: boolean | undefined;
    room: Room;
}) => {
    const myBookingAccepted =
        props.booking?.resourceStatus === 'accepted' &&
        DateTime.fromISO(props.booking.startTime) > DateTime.now();

    const bookingStartText = useMemo(
        () =>
            `Your booking starts in ${getTimeLeft(props.booking?.startTime || '')}`,
        [props.booking]
    );

    const availableText = useMemo(
        () =>
            `Available for another ${minutesToSimpleString(getTimeAvailableMinutes(props.booking))}`,
        [props.booking]
    );

    return (
        <>
            {props.reservationStatus !== undefined ? (
                <Box sx={{ textAlign: 'left' }}>
                    {' '}
                    {/* Add textAlign: 'left' here */}
                    {props.booking && (
                        <RoomCardReservationStatusIndicator
                            reserved={props.reservationStatus}
                            booking={props.booking}
                        />
                    )}
                    {props.booking && myBookingAccepted
                        ? bookingStartText
                        : availableText}
                </Box>
            ) : props.busy ? (
                <Box sx={{ textAlign: 'left' }}>
                    {' '}
                    {/* Add textAlign: 'left' here */}
                    <BusyRoomCardReservationStatusIndicator room={props.room} />
                    <BusyRoomStatusTextContent>
                        <BusyRoomStatusTextContent
                            props={{
                                width: 283,
                                fontSize: 16,
                                fontWeight: '2'
                            }}
                        >
                            Next available slot:{' '}
                            {getNextCalendarEventTimeString(props.room)}
                        </BusyRoomStatusTextContent>
                    </BusyRoomStatusTextContent>
                </Box>
            ) : (
                <Box sx={{ textAlign: 'left' }}>
                    {' '}
                    {/* Add textAlign: 'left' here */}
                    <TimeLeft
                        timeLeftText="Available for "
                        endTime={getNextCalendarEvent(props.room)}
                    />
                </Box>
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
        reservationStatus,
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
        if (isSelected && reservationStatus) {
            return selectedReservedVars;
        }
        if (isSelected) {
            return selectedVars;
        }

        return defaultVars;
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
                        <RoomCardIndicatorsBox busy={isBusy} room={room} />
                    </Row>
                    <Row justifyContent={'left'} alignItems={'left'}>
                        <ReservationStatusText
                            reservationStatus={reservationStatus}
                            booking={booking}
                            busy={isBusy}
                            room={room}
                        />
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
