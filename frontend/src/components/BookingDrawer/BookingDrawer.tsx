import React, { useEffect, useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DateTime } from 'luxon';
import { styled } from '@mui/material/styles';
import SwipeableEdgeDrawer, {
    DrawerContent
} from '../SwipeableEdgeDrawer/SwipeableEdgeDrawer';
import { Room } from '../../types';
import { getTimeLeft, getTimeLeftMinutes2 } from '../util/TimeLeft';
import { theme } from '../../theme';
import DurationPicker from './DurationPicker';
import BottomDrawer from '../BottomDrawer/BottomDrawer';
import { dateTimeToTimeString } from '../util/Time';

const MIN_DURATION = 15;

function getName(room: Room | undefined) {
    return room === undefined ? '' : room.name;
}

function getNextCalendarEvent(room: Room | undefined) {
    return room === undefined ? '' : room.nextCalendarEvent;
}

function getTimeAvailable(room: Room | undefined) {
    return room === undefined ? '' : getTimeLeft(getNextCalendarEvent(room));
}

function getTimeAvailableMinutes(room: Room | undefined): number {
    if (room === undefined) {
        return 0;
    }

    return getTimeLeftMinutes2(getNextCalendarEvent(room));
}

/**
 * Returns minutes as hours and minutes string.
 *
 * @param minutes
 * @returns Example "1 h 15 min"
 */
export function minutesToSimpleString(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const min = minutes % 60;
    if (hours === 0) {
        return min + ' min';
    }
    if (min === 0) {
        return hours + ' h';
    }
    return hours + ' h ' + min + ' min';
}

const getNextAvailableTime = (room: Room) => {
    const nextStartDate = getNextCalendarEvent(room);
    const nextEvent = room.busy!.find((b) => b.start === nextStartDate);
    const nextAvailableTime = DateTime.fromISO(nextEvent!.end!).plus({
        minutes: 1
    });

    return dateTimeToTimeString(nextAvailableTime);
};

const getUnavailableTimeInMinutes = (room: Room) => {
    const nextStartDate = getNextCalendarEvent(room);
    const nextEvent = room.busy!.find((b) => b.start === nextStartDate);
    const end = DateTime.fromISO(nextEvent!.end!);

    console.log(end, 'end');
    console.log(getNextCalendarEvent(room), 'etNextCalendarEvent(room)');

    const now = DateTime.now();
    const substraction = end.minus({ hours: now.hour, minutes: now.minute });

    return substraction.minute + substraction.hour * 60;
};

/**
 *
 * @param minutes
 * @param startingTime
 * @returns Example "(15.15 - 15.30)"
 */
function getBookingRangeText(minutes: number, startingTime: string) {
    if (startingTime !== 'Now' && startingTime !== undefined) {
        const h = Number(startingTime.split(':')[0]);
        const m = Number(startingTime.split(':')[1]);
        const dt = DateTime.local().set({ hour: h, minute: m });
        const endTime = dt.plus({ minutes: minutes });
        return (
            '(' +
            dt.toLocaleString(DateTime.TIME_24_SIMPLE) +
            ' - ' +
            endTime.toLocaleString(DateTime.TIME_24_SIMPLE) +
            ')'
        );
    }
    const startTime = DateTime.local();
    const endTime = startTime.plus({ minutes: minutes });
    return (
        '(' +
        startTime.toLocaleString(DateTime.TIME_24_SIMPLE) +
        ' - ' +
        endTime.toLocaleString(DateTime.TIME_24_SIMPLE) +
        ')'
    );
}

export const Row = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '0px',
    width: '100%'
}));

export const RowAlert = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    padding: '0px',
    borderStyle: 'solid',
    borderColor: '#F2BB32',
    borderWidth: '1px',
    borderRadius: '8px'
}));

export const ColAlertIcon = styled(Box)(({ theme }) => ({
    width: '40px',
    display: 'flex',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    gap: '8px',
    padding: '0px',
    background: '#F2BB32',
    borderRadius: '0px'
}));

export const ColAlertMessage = styled(Box)(({ theme }) => ({
    display: 'flex',
    flex: '1 1 0%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    gap: '8px',
    paddingTop: '8px',
    paddingBottom: '8px',
    paddingRight: '24px',
    paddingLeft: '24px',
    borderRadius: '0px'
}));

export const Alert = (props: {
    startingTime: string;
    showAlert: boolean;
    unavailable: number;
}) => {
    if (!props.showAlert) {
        return <></>;
    }
    return (
        <RowAlert>
            <ColAlertIcon>
                <span
                    style={{
                        color: '#FBFBF6',
                        fontSize: '20px',
                        fontFamily: 'Material Icons',
                        textAlign: 'center',
                        fontWeight: '400'
                    }}
                >
                    not_interested
                </span>
            </ColAlertIcon>
            <ColAlertMessage>
                <p
                    style={{
                        flex: '1 1 0%',
                        color: '#1D1D1D',
                        fontSize: '16px',
                        fontFamily: 'Studio Feixen Sans',
                        textAlign: 'left',
                        fontWeight: '2'
                    }}
                >
                    Room is currently unavailable for {props.unavailable}
                    minutes. You may book the room in advance. Your starting
                    time was adjusted to {props.startingTime}.
                </p>
            </ColAlertMessage>
        </RowAlert>
    );
};

export const RowCentered = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '0px',
    width: '100%'
}));

export const DrawerButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50px',
    width: '100%',
    margin: '8px 0px'
}));

export const DrawerButtonPrimary = styled(DrawerButton)(({ theme }) => ({
    color: theme.palette.background.default,
    background: theme.palette.text.primary,
    '&.Mui-disabled': {
        color: '#7d6b6a',
        background: theme.palette.background.default
    },
    '&:hover': {
        backgroundColor: theme.palette.text.primary
    }
}));

export const DrawerButtonSecondary = styled(DrawerButton)(
    ({ theme: DefaultTheme }) => ({
        color: theme.palette.text.primary,
        border: '1px solid',
        borderColor: theme.palette.text.primary,
        '&.Mui-disabled': {
            color: theme.palette.text.disabled,
            borderColor: theme.palette.text.disabled
        }
    })
);

export const TimeText = styled(Typography)(() => ({
    fontSize: '24px',
    padding: '8px'
}));

export const TimeTextBold = styled(TimeText)(() => ({
    fontWeight: 'bold'
}));

export const AvailableText = styled(Typography)(() => ({
    fontSize: '16px',
    color: '#82716F'
}));

export const SmallText = styled(Typography)(({ theme }) => ({
    textTransform: 'uppercase',
    fontSize: '12px',
    lineHeight: '12px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    margin: '24px 8px 0 0'
}));

export const Spacer = styled('div')(() => ({
    padding: '8px'
}));

interface Props {
    open: boolean;
    toggle: (open: boolean) => void;
    bookRoom: () => void;
    duration: number;
    additionalDuration: number;
    onAddTime: (minutes: number) => void;
    onAddTimeUntilHalf: () => void;
    onAddTimeUntilFull: () => void;
    onAddTimeUntilNext: (minutes: number) => void;
    availableMinutes: number;
    room?: Room;
    startingTime: string;
    setBookingDuration: (minutes: number) => void;
    setAdditionalDuration: (minutes: number) => void;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    setExpandDurationTimePickerDrawer: (show: boolean) => void;
    setStartingTime: (s: string) => void;
}

const BookingDrawer = (props: Props) => {
    const {
        open,
        toggle,
        bookRoom,
        room,
        duration,
        additionalDuration,
        onAddTime,
        onAddTimeUntilHalf,
        onAddTimeUntilFull,
        onAddTimeUntilNext,
        availableMinutes,
        startingTime,
        setBookingDuration,
        setAdditionalDuration,
        setDuration,
        setExpandDurationTimePickerDrawer,
        setStartingTime
    } = props;

    useEffect(() => {
        updateHalfHour();
        updateFullHour();
    });

    const handleDurationChange = (newDuration: number) => {
        if (newDuration !== -1) {
            setBookingDuration(newDuration);
        }
        setAdditionalDuration(0);
    };

    // Placeholder values
    const [nextHalfHour, setNextHalfHour] = useState('00:30');
    const [nextFullHour, setNextFullHour] = useState('01:00');

    const handleAdditionalTime = (minutes: number) => {
        onAddTime(minutes);
    };

    const handleNextHalfHour = () => {
        onAddTimeUntilHalf();
    };

    const handleNextFullHour = () => {
        onAddTimeUntilFull();
    };

    const handleUntilNext = (minutes: number) => {
        onAddTimeUntilNext(minutes);
    };

    const disableSubtractTime = () => {
        return duration + additionalDuration <= MIN_DURATION;
    };

    const disableAddTime = () => {
        return duration + additionalDuration + 15 > availableMinutes;
    };

    const disableNextHalfHour = () => {
        let currentTime = DateTime.now().toObject();
        if (currentTime.minute >= 30) {
            return 60 - (currentTime.minute - 30) > availableMinutes;
        } else {
            return 30 - currentTime.minute > availableMinutes;
        }
    };

    const disableNextFullHour = () => {
        let currentTime = DateTime.now().toObject();
        return 60 - currentTime.minute > availableMinutes;
    };

    const updateHalfHour = () => {
        const halfHour =
            startingTime === 'Now'
                ? DateTime.now().toObject()
                : DateTime.fromObject({
                      hour: Number(startingTime.split(':')[0]),
                      minute: Number(startingTime.split(':')[1]),
                      second: 0
                  })
                      .plus({ minutes: duration })
                      .toObject();

        if (
            halfHour.hour === undefined ||
            halfHour.minute === undefined ||
            Number.isNaN(halfHour.hour) ||
            Number.isNaN(halfHour.minute)
        ) {
            throw new Error('Time not set');
        }
        if (halfHour.minute >= 30) {
            halfHour.hour = halfHour.hour + 1;
        }
        halfHour.minute = 30;

        let halfHourString =
            halfHour.hour.toString() + ':' + halfHour.minute.toString();
        setNextHalfHour(halfHourString);
    };

    const updateFullHour = () => {
        let fullHour =
            startingTime === 'Now'
                ? DateTime.now().toObject()
                : DateTime.fromObject({
                      hour: Number(startingTime.split(':')[0]),
                      minute: Number(startingTime.split(':')[1]),
                      second: 0
                  })
                      .plus({ minutes: duration })
                      .toObject();

        if (
            fullHour.hour === undefined ||
            fullHour.minute === undefined ||
            Number.isNaN(fullHour.hour) ||
            Number.isNaN(fullHour.minute)
        ) {
            throw new Error('Time not set');
        }

        fullHour.minute = 0;
        fullHour.hour = fullHour.hour + 1;
        let fullHourString =
            fullHour.hour.toString() + ':' + fullHour.minute.toString() + '0';
        setNextFullHour(fullHourString);
    };

    let showAlert = false;
    let unavailable = 0;
    if (room && DateTime.fromISO(room.nextCalendarEvent) < DateTime.now()) {
        setStartingTime(getNextAvailableTime(room));
        showAlert = true;
        unavailable = getUnavailableTimeInMinutes(room);
    }
    return (
        <BottomDrawer
            headerTitle={getName(room)}
            iconLeft={'AccessTime'}
            iconRight={'Close'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={true}
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
                    <Alert
                        startingTime={startingTime}
                        showAlert={showAlert}
                        unavailable={unavailable}
                    />
                    <RowCentered>
                        <TimeTextBold>
                            {minutesToSimpleString(
                                duration + additionalDuration
                            )}
                        </TimeTextBold>
                        <TimeText>
                            {getBookingRangeText(
                                duration + additionalDuration,
                                startingTime
                            )}
                        </TimeText>
                    </RowCentered>
                    <RowCentered>
                        <AvailableText>
                            Maximum {getTimeAvailable(room)} available
                        </AvailableText>
                    </RowCentered>
                    <Row>
                        <SmallText>quick duration selection</SmallText>
                    </Row>

                    <DurationPicker
                        bookingDuration={duration}
                        onChange={handleDurationChange}
                        setExpandDurationTimePickerDrawer={
                            setExpandDurationTimePickerDrawer
                        }
                        additionalDuration={additionalDuration}
                    />
                    <Row>
                        <SmallText>booking (rounded to next 5 min)</SmallText>
                    </Row>
                    <Row>
                        <DrawerButtonPrimary
                            aria-label="subtract 15 minutes"
                            data-testid="subtract15"
                            onClick={() => handleAdditionalTime(-15)}
                            disabled={disableSubtractTime()}
                        >
                            <RemoveIcon /> 15 min
                        </DrawerButtonPrimary>
                        <Spacer />
                        <DrawerButtonPrimary
                            aria-label="add 15 minutes"
                            data-testid="add15"
                            onClick={() => handleAdditionalTime(15)}
                            disabled={disableAddTime()}
                        >
                            <AddIcon /> 15 min
                        </DrawerButtonPrimary>
                    </Row>
                    <Row>
                        <DrawerButtonSecondary
                            onClick={() => handleNextHalfHour()}
                            disabled={disableNextHalfHour()}
                        >
                            Until {nextHalfHour}
                        </DrawerButtonSecondary>
                        <Spacer />
                        <DrawerButtonSecondary
                            onClick={() => handleNextFullHour()}
                            disabled={disableNextFullHour()}
                        >
                            Until {nextFullHour}
                        </DrawerButtonSecondary>
                    </Row>
                    <Row>
                        <DrawerButtonSecondary
                            aria-label="Book the whole free slot"
                            onClick={() =>
                                handleUntilNext(getTimeAvailableMinutes(room))
                            }
                        >
                            Book the whole free slot
                        </DrawerButtonSecondary>
                    </Row>
                    <Row>
                        <DrawerButtonPrimary
                            aria-label="book now"
                            data-testid="BookNowButton"
                            onClick={bookRoom}
                        >
                            Book now
                        </DrawerButtonPrimary>
                    </Row>
                </DrawerContent>
            </Box>
        </BottomDrawer>
    );
};

export default BookingDrawer;
