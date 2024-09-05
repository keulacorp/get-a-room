import React, { useState, useEffect } from 'react';
import { MultiSectionDigitalClock } from '@mui/x-date-pickers/MultiSectionDigitalClock';
import { TextField, Box, styled } from '@mui/material';
import { DateTime } from 'luxon';

import {
    DrawerButtonPrimary,
    DrawerButtonSecondary,
    Row
} from '../BookingDrawer/BookingDrawer';

import dayjs from 'dayjs';
import GetARoomForm from '../GetARoomForm/GetARoomForm';
import { getHourMinute, nowDate } from '../util/Time';
import BottomDrawer, { DrawerContent } from '../BottomDrawer/BottomDrawer';

export const BoxForm = styled(GetARoomForm)(({ theme }) => ({
    display: 'flex',
    flexWrap: 'wrap'
}));

interface StartingTimePickerDrawerProps {
    open: boolean;
    toggle: (open: boolean) => void;
    startingTime: string;
    setStartingTime: (time: string) => void;
    setExpandTimePickerDrawer: (state: boolean) => void;
}

const StartingTimePickerDrawer = (props: StartingTimePickerDrawerProps) => {
    const {
        open,
        toggle,
        startingTime,
        setStartingTime,
        setExpandTimePickerDrawer
    } = props;
    const [time, setTime] = useState<string>(DateTime.now().toFormat('HH:mm'));

    // Whenever drawer is opened, set the time to current time - otherwise it can display old time as the default
    useEffect(() => {
        if (!(open && startingTime === 'Now')) {
            return;
        }
        setTime(DateTime.now().toFormat('hh:mm'));
    }, [open, startingTime]);

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

    function getStartingTimeDefaultSelection(): any {
        dayjs(nowDate() + ' ' + time);
    }

    return (
        <BottomDrawer
            headerTitle={'Edit starting time'}
            iconLeft={'AccessTime'}
            iconRight={'Close'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={true}
            zindex={1201}
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
                    <BoxForm>
                        <MultiSectionDigitalClock
                            timeSteps={{ hours: 1, minutes: 5 }}
                            views={['hours', 'minutes']}
                            onChange={(val) => {
                                setTime(
                                    val
                                        ? getHourMinute(val)
                                        : DateTime.now().toFormat('HH:mm')
                                );
                            }}
                            ampm={false}
                            value={getStartingTimeDefaultSelection()}
                            minTime={dayjs()}
                            data-testid="CustomStartingTimeClock"
                        />
                    </BoxForm>
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
                            data-testid="ConfirmStartingTimeButton"
                        >
                            Confirm
                        </DrawerButtonPrimary>
                    </Row>
                </DrawerContent>
            </Box>
        </BottomDrawer>
    );
};

export default StartingTimePickerDrawer;
