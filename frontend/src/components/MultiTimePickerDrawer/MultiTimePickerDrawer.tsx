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

interface MultiTimePickerDrawerProps {
    open: boolean;
    toggle: (open: boolean) => void;
    startingTime: string;
    setStartingTime: (time: string) => void;
    setExpandTimePickerDrawer: (state: boolean) => void;
}

function nowDate() {
    const dt = new Date();
    const mm = dt.getMonth() + 1;
    const dd = dt.getDate();
  
    return [
      dt.getFullYear(),
      "-",
      (mm > 9 ? "" : "0") + mm,
      "-",
      (dd > 9 ? "" : "0") + dd,
    ].join("");
  }

const MultiTimePickerDrawer = (props: MultiTimePickerDrawerProps) => {
    const {
        open,
        toggle,
        startingTime,
        setStartingTime,
        setExpandTimePickerDrawer
    } = props;
    const [time, setTime] = useState<string>(DateTime.now().toFormat('hh:mm'));

    // Whenever drawer is opened, set the time to current time - otherwise it can display old time as the default
    useEffect(() => {
        if (!(open && startingTime === 'Now')) {
            return;
        }
        setTime(DateTime.now().toFormat('hh:mm'));
    }, [open, startingTime]);

    const getHourMinute = (v: any) => {
        let h = v.get('hour').toString()
        if (v.get('hour') < 10) h = '0' + h;

        let m = v.get('minute').toString()
        if (v.get('minute') < 10) m = '0' + m;

        return h + ':' + m;
    }

    const handleSetTime = (isNow: Boolean) => {
        const h = Number(time.split(':')[0]);
        const m = Number(time.split(':')[1]);
        const currentTime = DateTime.now();

        if (
            h < currentTime.hour ||
            isNow ||
            (h === currentTime.hour && m <= currentTime.minute)
        ) {
            setStartingTime('Now');
            setTime(currentTime.toFormat('hh:mm'));
        } else {
            setStartingTime(time);
        }
        setExpandTimePickerDrawer(false);
    };

    return (
        <SwipeableEdgeDrawer
            headerTitle={'Edit starting time'}
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
                                console.log(val)
                                setTime(val
                                        ? getHourMinute(val)
                                        : DateTime.now().toFormat('hh:mm'));
                                console.log(time)
                            }}
                            ampm={false}
                            value={dayjs(nowDate() + ' ' + time)}
                        />
                    </form>
                    <Row>
                        <DrawerButtonSecondary
                            aria-label="set to now"
                            onClick={() => handleSetTime(true)}
                        >
                            Set to Now
                        </DrawerButtonSecondary>
                    </Row>
                    <Row>
                        <DrawerButtonPrimary
                            aria-label="confirm"
                            onClick={() => handleSetTime(false)}
                        >
                            Confirm
                        </DrawerButtonPrimary>
                    </Row>
                </DrawerContent>
            </Box>
        </SwipeableEdgeDrawer>
    );
};

export default MultiTimePickerDrawer;
