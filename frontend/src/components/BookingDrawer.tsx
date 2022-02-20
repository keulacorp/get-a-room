import * as React from 'react';
import { Box, Button, Icon, IconButton, styled, Typography } from '@mui/material';
import { DateTime } from 'luxon';

import SwipeableEdgeDrawer, { DrawerContent } from './SwipeableEdgeDrawer';
import { Room } from '../types';
import { getTimeLeft } from './util/TimeLeft';



function getName(room:Room|undefined) {
    return (room === undefined) ? '' : room.name;
}

function getNextCalendarEvent(room: Room|undefined) {
    return (room === undefined) ? '' : room.nextCalendarEvent;
}

function getTimeAvailable (room: Room|undefined) {
    return (room === undefined) ? '' : getTimeLeft(getNextCalendarEvent(room));
}

function addLeadingZero(number: number) {
    if (number < 10) {
        return '0'+number;
    }
    return number.toString();
}

function getBookingRangeText (minutes: number) {
    let startTime =  DateTime.local()
    let endTime = startTime.plus({minutes: minutes});
    return '(' + addLeadingZero(startTime.hour) + ':' + addLeadingZero(startTime.minute) + '-' 
        + addLeadingZero(endTime.hour) + ':' + addLeadingZero(endTime.minute) + ')';
}

const Row = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '0px',
    width: '100%',
}));

const RowCentered = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: '0px',
    width: '100%',
}));


const DrawerButton = styled(Button)((theme) => ({
    textTransform: 'none',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '50px',
    width: '100%',
    margin: '8px 0px',
    '&.Mui-hower': {

    } 
}));

const DrawerButtonPrimary = styled(DrawerButton)((theme) => ({
    color: '#F6F5F5',
    background: '#443938',
    '&.Mui-disabled': {
        color: '#95807E',
        background: '#F6F5F5',
    } 
}));

const DrawerButtonSecondary = styled(DrawerButton)((theme) => ({
    color: '#443938',
    border: '1px solid #443938',
    '&.Mui-disabled': {
        color: '#95807E',
        borderColor: '#95807E'
    } 
}));

const TimeText = styled(Typography)(() => ({
    fontSize: '24px',
    padding: '8px'
}))

const TimeTextBold = styled(TimeText)(() => ({
    fontWeight: 'bold'
}))

const AvailableText = styled(Typography)(() => ({
    fontSize: '16px',
    color: '#95807E'
}))

const SmallText = styled(Typography)(() => ({
    textTransform: 'uppercase',
    fontSize: '12px',
    lineHeight: '12px',
    fontWeight: 'bold',
    fontStyle:'normal',
    margin: '24px 8px 0 0'
}))

const Spacer = styled('div')(() => ({
    padding: '8px'
}))

interface Props {
    open: boolean;
    toggle: (open: boolean) => void;
    bookRoom: () => void;
    duration: number;
    room?: Room;
}

const BookingDrawer = (props: Props) => {
    const {open, toggle, bookRoom, room, duration} = props;



    return (
        <SwipeableEdgeDrawer 

            headerTitle={getName(room)}
            iconLeft={'AccessTime'} 
            iconRight={'Close'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={true}
        >
            <DrawerContent>
                <RowCentered>
                    <TimeTextBold>{duration} min</TimeTextBold>
                    <TimeText>{getBookingRangeText(duration)}</TimeText>
                </RowCentered>
                <RowCentered>
                    <AvailableText>Available for {getTimeAvailable(room)}</AvailableText>
                </RowCentered>
                <Row>
                    <SmallText>booking (rounded to next 5 min)</SmallText>
                </Row>
                <Row>
                    <DrawerButtonPrimary disabled>- 15 min</DrawerButtonPrimary>
                    <Spacer />
                    <DrawerButtonPrimary disabled>+ 15 min</DrawerButtonPrimary>
                </Row>
                <Row>
                    <DrawerButtonSecondary disabled>Spaceholder</DrawerButtonSecondary>
                    <Spacer />
                    <DrawerButtonSecondary disabled>Spaceholder</DrawerButtonSecondary>
                </Row>
                <Row>
                    <DrawerButtonSecondary disabled>Spaceholder</DrawerButtonSecondary>
                </Row>
                <Row>
                    <DrawerButtonPrimary 
                        data-testid='BookNowButton' 
                        onClick={bookRoom}
                    >
                        Book now
                    </DrawerButtonPrimary>
                </Row>
            </DrawerContent>
        </SwipeableEdgeDrawer>
    );
}

export default BookingDrawer;