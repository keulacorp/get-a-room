import React, { useEffect, useState } from 'react';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { Box, styled } from '@mui/material';
import { DateTime } from 'luxon';

import { DrawerButtonPrimary, Row } from '../BookingDrawer/BookingDrawer';
import dayjs from 'dayjs';
import GetARoomForm from '../GetARoomForm/GetARoomForm';
import { getHourMinute, nowDate } from '../util/Time';
import BottomDrawer, { DrawerContent } from '../BottomDrawer/BottomDrawer';

const BoxForm = styled(GetARoomForm)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap'
}));

const DurationBox = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    zIndex: 2000
}));

const DurationDrawerContent = styled(DrawerContent)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
}));

interface DurationTimePickerDrawerProps {
    open: boolean;
    toggle: (open: boolean) => void;
    bookingDuration: number;
    setBookingDuration: (duration: number) => void;
    setExpandDurationTimePickerDrawer: (state: boolean) => void;
    maxDuration: any;
}

const DurationTimePickerDrawer = (props: DurationTimePickerDrawerProps) => {
    const {
        open,
        toggle,
        bookingDuration,
        setBookingDuration,
        setExpandDurationTimePickerDrawer,
        maxDuration
    } = props;

    const [time, setTime] = useState<string>(DateTime.now().toFormat('HH:mm'));

    const convertDurationToTime = (duration: number) => {
        const h = Math.floor(duration / 60);
        const m = duration % 60;
        return [(h > 9 ? '' : '0') + h, ':', (m > 9 ? '' : '0') + m].join('');
    };

    useEffect(() => {
        setTime(
            bookingDuration ? convertDurationToTime(bookingDuration) : '03:00'
        );
    }, [open]);

    const handleSetDuration = () => {
        const h = Number(time.split(':')[0]);
        const m = Number(time.split(':')[1]);

        setBookingDuration(h * 60 + m);

        setExpandDurationTimePickerDrawer(false);
    };

    return (
        <BottomDrawer
            headerTitle={'Custom duration'}
            iconLeft={'AccessTime'}
            iconRight={'Close'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={true}
            zindex={2000}
        >
            <DurationBox>
                <DurationDrawerContent>
                    <BoxForm>
                        <MultiSectionDigitalClock
                            timeSteps={{ hours: 1, minutes: 5 }}
                            views={['hours', 'minutes']}
                            onChange={(val) => {
                                setTime(val ? getHourMinute(val) : '03:00');
                            }}
                            ampm={false}
                            value={dayjs(nowDate() + ' ' + time)}
                            maxTime={maxDuration}
                            data-testid="CustomDurationClock"
                        />
                    </BoxForm>
                    <Row>
                        <DrawerButtonPrimary
                            aria-label="confirm"
                            data-testid={'set-duration-button'}
                            onClick={() => handleSetDuration()}
                        >
                            Confirm
                        </DrawerButtonPrimary>
                    </Row>
                </DurationDrawerContent>
            </DurationBox>
        </BottomDrawer>
    );
};

export default DurationTimePickerDrawer;
