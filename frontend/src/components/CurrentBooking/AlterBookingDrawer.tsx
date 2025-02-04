import * as React from 'react';
import { useState } from 'react';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShareIcon from '@mui/icons-material/Share';
import { DateTime } from 'luxon';

import { Booking, Room } from '../../types';
import {
    AvailableText,
    DrawerButtonPrimary,
    DrawerButtonSecondary,
    minutesToSimpleString,
    RowCentered,
    SmallText,
    Spacer,
    TimeTextBold
} from '../BookingDrawer/BookingDrawer';
import ShareMenu from './ShareMenu';
import BottomDrawer, { DrawerContent } from '../BottomDrawer/BottomDrawer';
import Typography from '@mui/material/Typography';
import AlertBox from '../util/alertBox';
import { RoomCardReservationStatusIndicator } from '../RoomCard/RoomCard';
import { ReservationStatus } from '../../enums';

const MIN_DURATION = 15;
const LAST_HOUR = 17;

function getName(room: Room | undefined) {
    return room === undefined ? '' : room.name;
}

function getSimpleEndTime(booking: Booking | undefined) {
    if (booking === undefined) {
        return;
    }
    let time = DateTime.fromISO(booking.endTime);
    return time.toLocaleString(DateTime.TIME_24_SIMPLE);
}

const Row = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '0px',
    width: '100%'
}));

const TimeTextBoldGreen = styled(TimeTextBold)(({ theme }) => ({
    color: theme.palette.success.main
}));

const PreBookBoldYellow = styled(TimeTextBold)(({ theme }) => ({
    color: theme.palette.warning.main,
    fontSize: '16px'
}));

const AvailableTextMain = styled(AvailableText)(({ theme }) => ({
    color: theme.palette.text.primary
}));

interface Props {
    open: boolean;
    toggle: (open: boolean) => void;
    endBooking: (booking: Booking) => void;
    cancelBooking: (booking: Booking) => void;
    duration: number;
    onAlterTime: (booking: Booking, minutes: number) => void;
    availableMinutes: number;
    booking?: Booking;
    bookingStarted: boolean;
}

const AlterBookingDrawer = (props: Props) => {
    const {
        open,
        toggle,
        endBooking,
        cancelBooking,
        booking,
        duration,
        onAlterTime,
        availableMinutes,
        bookingStarted
    } = props;

    //For share button
    const title: string = 'My Web Share Adventures';
    const text: string = 'Hello World! I shared this content via Web Share';
    const url: string | undefined = booking?.meetingLink;

    const [shareMenuOpen, setShareMenuOpen] = useState(false);
    const [shareAnchorEl, setShareAnchorEl] =
        React.useState<null | HTMLElement>(null);

    const handleAlterTime = (minutes: number) => {
        if (booking === undefined || minutes == 0) {
            return;
        }
        onAlterTime(booking, minutes);
    };

    const shareMenuOnClose = (open: Boolean) => {
        setShareMenuOpen(!shareMenuOpen);
    };

    const checkStartingTime = () => {
        if (booking) {
            const start = DateTime.fromISO(booking.startTime);
            if (start > DateTime.now()) {
                return start;
            } else {
                return DateTime.now();
            }
        }
        return DateTime.now();
    };

    const handleNextHalfHour = () => {
        const timeNow = checkStartingTime();
        const minutes = Math.floor(
            nextHalfHour().diff(timeNow, 'minute').minutes
        );
        handleAlterTime(minutes - duration);
    };

    const nextHalfHour = () => {
        const newEndTime = checkStartingTime().toObject();

        if (
            newEndTime.hour === undefined ||
            newEndTime.minute === undefined ||
            Number.isNaN(newEndTime.hour) ||
            Number.isNaN(newEndTime.minute)
        ) {
            throw new Error('Time not set');
        }
        if (newEndTime.minute >= 30) {
            newEndTime.hour = newEndTime.hour + 1;
        }
        newEndTime.minute = 30;
        newEndTime.second = 0;
        newEndTime.millisecond = 0;

        return DateTime.fromObject(newEndTime);
    };

    const nextFullHour = () => {
        const newEndTime = checkStartingTime().toObject();

        if (
            newEndTime.hour === undefined ||
            newEndTime.minute === undefined ||
            Number.isNaN(newEndTime.hour) ||
            Number.isNaN(newEndTime.minute)
        ) {
            throw new Error('Time not set');
        }

        newEndTime.hour = newEndTime.hour + 1;
        newEndTime.minute = 0;
        newEndTime.second = 0;
        newEndTime.millisecond = 0;

        return DateTime.fromObject(newEndTime);
    };

    const disableNextHalfHour = () => {
        if (booking === undefined) {
            return true;
        }
        const timeNow = checkStartingTime();
        const endTime = DateTime.fromISO(booking.endTime);
        const nextHalf = nextHalfHour();
        if (nextHalf <= endTime) {
            return false;
        }

        const minutes = Math.ceil(nextHalf.diff(timeNow, 'minute').minutes);
        return minutes > availableMinutes;
    };

    const handleNextFullHour = () => {
        const timeNow = checkStartingTime();
        const minutes = Math.floor(
            nextFullHour().diff(timeNow, 'minute').minutes
        );
        handleAlterTime(minutes - duration);
    };

    const disableNextFullHour = () => {
        if (booking === undefined) {
            return true;
        }
        const timeNow = checkStartingTime();
        const endTime = DateTime.fromISO(booking.room.nextCalendarEvent);
        const nextFull = nextFullHour();
        if (nextFull <= endTime) {
            return false;
        }

        const minutes = Math.ceil(nextFull.diff(timeNow, 'minute').minutes);

        return minutes > availableMinutes;
    };

    const disableSubtractTime = () => {
        return duration <= MIN_DURATION;
    };

    const disableAddTime = () => {
        return availableMinutes < 15;
    };

    const handleUntilNextMeeting = () => {
        const timeNow = checkStartingTime();
        if (booking === undefined) {
            return;
        }
        if (timeNow.hour >= LAST_HOUR) {
            handleAlterTime(availableMinutes - 1);
        } else {
            const time1700 = DateTime.fromObject({ hour: LAST_HOUR });
            const endTime = checkStartingTime().plus({
                minutes: availableMinutes
            });
            if (endTime < time1700) {
                return handleAlterTime(availableMinutes);
            }
            const minutes = time1700.diff(
                DateTime.fromISO(booking?.endTime),
                'minutes'
            ).minutes;
            handleAlterTime(Math.floor(minutes));
        }
    };

    const handleEndBooking = () => {
        if (booking === undefined) {
            return;
        }
        endBooking(booking);
    };

    const handleCancelBooking = () => {
        if (booking === undefined) {
            return;
        }
        cancelBooking(booking);
    };

    const handleOnShareClick = (
        event: HTMLElement | null,
        shareDetails: ShareData
    ) => {
        if (navigator.share) {
            navigator.share(shareDetails).catch((error) => {
                console.error('Something went wrong sharing the link', error);
            });
        } else if (event != null) {
            console.log('Web Share API not enabled!');
            setShareAnchorEl(event);
            setShareMenuOpen(!shareMenuOpen);
        }
    };

    return (
        <BottomDrawer
            headerTitle={getName(
                booking === undefined ? undefined : booking.room
            )}
            iconLeft={'AccessTime'}
            iconRight={'Close'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={true}
            zindex={1200}
            testId={'BookingDrawer'}
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
                    {props.booking?.startTime !== 'Now' && (
                        <RowCentered>
                            {/*<AlertBox*/}
                            {/*    alertText={`Note! You are booking the room for a future time`}*/}
                            {/*    sx={{*/}
                            {/*        width: '100%',*/}
                            {/*        height: 60,*/}
                            {/*        margin: '8px 0'*/}
                            {/*    }}*/}
                            {/*/>*/}
                        </RowCentered>
                    )}
                    {props.booking && !bookingStarted && (
                        <RowCentered sx={{ margin: '8px 0' }}>
                            <RoomCardReservationStatusIndicator
                                reserved={ReservationStatus.RESERVED_LATER}
                                booking={props.booking}
                            />
                        </RowCentered>
                    )}
                    <RowCentered>
                        <Typography variant={'h2'}>
                            {duration} min remaining
                        </Typography>
                    </RowCentered>
                    <RowCentered>
                        <Typography variant={'h6'}>
                            Room booked for you until{' '}
                            {getSimpleEndTime(booking)}
                        </Typography>
                    </RowCentered>
                    <RowCentered>
                        <Typography variant={'h6'}>
                            {minutesToSimpleString(availableMinutes)} more
                            available
                        </Typography>
                    </RowCentered>
                    <Row>
                        <DrawerButtonSecondary
                            id="shareButton"
                            onClick={(
                                event: React.MouseEvent<HTMLButtonElement>
                            ) => {
                                handleOnShareClick(event.currentTarget, {
                                    url,
                                    title,
                                    text
                                });
                            }}
                        >
                            <ShareIcon /> <Spacer /> Share meeting
                        </DrawerButtonSecondary>
                        <ShareMenu
                            anchorEl={shareAnchorEl}
                            open={shareMenuOpen}
                            onClose={shareMenuOnClose}
                            url={url ? url : 'no link'}
                        ></ShareMenu>
                    </Row>

                    <Row>
                        <SmallText>
                            alter booking (rounded to next 5 min)
                        </SmallText>
                    </Row>
                    <Row>
                        <DrawerButtonPrimary
                            aria-label="subtract 15 minutes"
                            data-testid="subtract15"
                            onClick={() => handleAlterTime(-15)}
                            disabled={disableSubtractTime()}
                        >
                            <RemoveIcon /> 15 min
                        </DrawerButtonPrimary>
                        <Spacer />
                        <DrawerButtonPrimary
                            aria-label="add 15 minutes"
                            data-testid="add15"
                            onClick={() => handleAlterTime(15)}
                            disabled={disableAddTime()}
                        >
                            <AddIcon /> 15 min
                        </DrawerButtonPrimary>
                    </Row>
                    <Row>
                        <DrawerButtonSecondary
                            aria-label="next half hour"
                            onClick={handleNextHalfHour}
                            disabled={disableNextHalfHour()}
                        >
                            {nextHalfHour().toLocaleString(
                                DateTime.TIME_24_SIMPLE
                            )}
                        </DrawerButtonSecondary>
                        <Spacer />
                        <DrawerButtonSecondary
                            aria-label="next full hour"
                            onClick={handleNextFullHour}
                            disabled={disableNextFullHour()}
                        >
                            {nextFullHour().toLocaleString(
                                DateTime.TIME_24_SIMPLE
                            )}
                        </DrawerButtonSecondary>
                    </Row>
                    <Row>
                        <DrawerButtonSecondary
                            aria-label="Book the whole free slot"
                            onClick={handleUntilNextMeeting}
                        >
                            Book the whole free slot
                        </DrawerButtonSecondary>
                    </Row>
                    {booking &&
                    DateTime.fromISO(booking.startTime) <= DateTime.now() ? (
                        <Row>
                            <DrawerButtonPrimary
                                aria-label="End booking"
                                data-testid="EndBookingButton"
                                onClick={handleEndBooking}
                            >
                                End Booking
                            </DrawerButtonPrimary>
                        </Row>
                    ) : (
                        <Row>
                            <DrawerButtonPrimary
                                aria-label="Cancel booking"
                                data-testid="CancelBookingButton"
                                onClick={handleCancelBooking}
                            >
                                Cancel Booking
                            </DrawerButtonPrimary>
                        </Row>
                    )}
                </DrawerContent>
            </Box>
        </BottomDrawer>
    );
};

export default AlterBookingDrawer;
