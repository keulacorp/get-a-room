import * as React from 'react';
import { Box, Button, styled, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { DateTime } from 'luxon';

import SwipeableEdgeDrawer, { DrawerContent } from './SwipeableEdgeDrawer';
import { Booking, Room } from '../types';
import { getTimeLeft } from './util/TimeLeft';
import { minutesToSimpleString } from './BookingDrawer';

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

function getSimpleEndTime(booking: Booking | undefined) {
    if (booking === undefined) {
        return;
    }
    let time = DateTime.fromISO(booking.endTime).toUTC();
    return time.toLocaleString(DateTime.TIME_24_SIMPLE);
}

const Row = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '0px',
    width: '100%'
}));

const RowCentered = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '0px',
    width: '100%'
}));

const DrawerButton = styled(Button)(({ theme }) => ({
    textTransform: 'none',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50px',
    width: '100%',
    margin: '8px 0px'
}));

const DrawerButtonPrimary = styled(DrawerButton)(({ theme }) => ({
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

const DrawerButtonSecondary = styled(DrawerButton)(({ theme }) => ({
    color: theme.palette.text.primary,
    border: '1px solid',
    borderColor: theme.palette.text.primary,
    '&.Mui-disabled': {
        color: theme.palette.text.disabled,
        borderColor: theme.palette.text.disabled
    }
}));

const TimeText = styled(Typography)(() => ({
    fontSize: '24px',
    padding: '8px'
}));

const TimeTextBold = styled(TimeText)(() => ({
    fontWeight: 'bold'
}));

const TimeTextBoldGreen = styled(TimeTextBold)(({ theme }) => ({
    color: theme.palette.success.main
}));

const AvailableText = styled(Typography)(() => ({
    fontSize: '16px',
    color: '#82716F'
}));

const AvailableTextGreen = styled(AvailableText)(({ theme }) => ({
    color: theme.palette.success.main
}));

const SmallText = styled(Typography)(() => ({
    textTransform: 'uppercase',
    fontSize: '12px',
    lineHeight: '12px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    margin: '24px 8px 0 0'
}));

const Spacer = styled('div')(() => ({
    padding: '8px'
}));

interface Props {
    open: boolean;
    toggle: (open: boolean) => void;
    endBooking: (booking: Booking) => void;
    duration: number;
    onAlterTime: (booking: Booking, minutes: number) => void;
    availableMinutes: number;
    booking?: Booking;
}

const AlterBookingDrawer = (props: Props) => {
    const {
        open,
        toggle,
        endBooking,
        booking,
        duration,
        onAlterTime,
        availableMinutes
    } = props;

    const handleAdditionalTime = (minutes: number) => {
        if (booking === undefined) {
            return;
        }
        onAlterTime(booking, minutes);
    };

    const disableSubtractTime = () => {
        return true;
    };

    const disableAddTime = () => {
        return availableMinutes < 15;
    };

    const handleEndBooking = () => {
        if (booking === undefined) {
            return;
        }
        endBooking(booking);
    };

    return (
        <SwipeableEdgeDrawer
            headerTitle={getName(
                booking === undefined ? undefined : booking.room
            )}
            iconLeft={'AccessTime'}
            iconRight={'Close'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={true}
        >
            <DrawerContent>
                <RowCentered>
                    <TimeTextBoldGreen>
                        {duration} min remaning
                    </TimeTextBoldGreen>
                </RowCentered>
                <RowCentered>
                    <AvailableTextGreen>
                        Room booked for you untill {getSimpleEndTime(booking)}
                    </AvailableTextGreen>
                </RowCentered>
                <RowCentered>
                    <AvailableText>
                        {minutesToSimpleString(availableMinutes)} more available
                    </AvailableText>
                </RowCentered>

                <Row>
                    <SmallText>alter booking (rounded to next 5 min)</SmallText>
                </Row>
                <Row>
                    <DrawerButtonPrimary
                        aria-label="subtract 15 minutes"
                        data-testid="subtract15"
                        onClick={(e) => handleAdditionalTime(-15)}
                        disabled={disableSubtractTime()}
                    >
                        <RemoveIcon /> 15 min
                    </DrawerButtonPrimary>
                    <Spacer />
                    <DrawerButtonPrimary
                        aria-label="add 15 minutes"
                        data-testid="add15"
                        onClick={(e) => handleAdditionalTime(15)}
                        disabled={disableAddTime()}
                    >
                        <AddIcon /> 15 min
                    </DrawerButtonPrimary>
                </Row>
                <Row>
                    <DrawerButtonSecondary disabled>
                        Spaceholder
                    </DrawerButtonSecondary>
                    <Spacer />
                    <DrawerButtonSecondary disabled>
                        Spaceholder
                    </DrawerButtonSecondary>
                </Row>
                <Row>
                    <DrawerButtonSecondary disabled>
                        Spaceholder
                    </DrawerButtonSecondary>
                </Row>
                <Row>
                    <DrawerButtonPrimary
                        aria-label="End booking"
                        data-testid="EndBookingButton"
                        onClick={handleEndBooking}
                    >
                        End Booking
                    </DrawerButtonPrimary>
                </Row>
            </DrawerContent>
        </SwipeableEdgeDrawer>
    );
};

export default AlterBookingDrawer;
