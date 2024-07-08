import React, { useState, useEffect } from 'react';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TextField, Box } from '@mui/material';
import { DateTime } from 'luxon';

import {
    DrawerButtonPrimary,
    DrawerButtonSecondary,
    Row
} from '../BookingDrawer/BookingDrawer';
import SwipeableEdgeDrawer, {
    DrawerContent
} from '../SwipeableEdgeDrawer/SwipeableEdgeDrawer';
import dayjs from 'dayjs';

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

    const getHourMinute = (v: any) => {
        let h = v.get('hour').toString();
        if (v.get('hour') < 10) h = '0' + h;

        let m = v.get('minute').toString();
        if (v.get('minute') < 10) m = '0' + m;

        return h + ':' + m;
    };

    function nowDate() {
        const dt = new Date();
        const mm = dt.getMonth() + 1;
        const dd = dt.getDate();

        return [
            dt.getFullYear(),
            '-',
            (mm > 9 ? '' : '0') + mm,
            '-',
            (dd > 9 ? '' : '0') + dd
        ].join('');
    }

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
        <SwipeableEdgeDrawer
            headerTitle={'Custom duration'}
            iconLeft={'AccessTime'}
            iconRight={'Close'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={true}
            zindex={2000}
        >
            <Box
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    zIndex: 2000
                }}
            >
                <DrawerContent
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <form
                        noValidate
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap'
                        }}
                    >
                        <MultiSectionDigitalClock
                            timeSteps={{ hours: 1, minutes: 5 }}
                            views={['hours', 'minutes']}
                            onChange={(val) => {
                                setTime(val ? getHourMinute(val) : '03:00');
                            }}
                            ampm={false}
                            value={dayjs(nowDate() + ' ' + time)}
                            maxTime={maxDuration}
                        />
                    </form>
                    <Row>
                        <DrawerButtonPrimary
                            aria-label="confirm"
                            onClick={() => handleSetDuration()}
                        >
                            Confirm
                        </DrawerButtonPrimary>
                    </Row>
                </DrawerContent>
            </Box>
        </SwipeableEdgeDrawer>
    );
};

export default DurationTimePickerDrawer;
