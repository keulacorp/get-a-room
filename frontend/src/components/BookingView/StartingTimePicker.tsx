import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { Box, styled, Typography } from '@mui/material';
import { DateTime } from 'luxon';
import { formatTimeToHalfAndFullHours } from '../util/Time';
import AlertBox from '../util/alertBox';

const StartingTimeButton = styled(ToggleButton)(() => ({}));
const StartingTimePickerContent = styled(Box)(({ theme }) => ({}));

type StartingTimePickerProps = {
    startingTime: string;
    title: string;
    setStartingTime: React.Dispatch<React.SetStateAction<string>>;
    setExpandTimePickerDrawer: (kia: boolean) => void;
};

const StartingTimePicker = (props: StartingTimePickerProps) => {
    const { title, startingTime, setStartingTime, setExpandTimePickerDrawer } =
        props;

    const now = DateTime.now();
    const startingTimeNow = 'Now';
    const startingTime2 = formatTimeToHalfAndFullHours(now, 0);
    const startingTime3 = formatTimeToHalfAndFullHours(now, 30);
    const startingTime4 = formatTimeToHalfAndFullHours(now, 60);
    const startingTimeCustom = 'Custom';

    const isCustomStartingTime =
        startingTime !== startingTimeNow &&
        startingTime !== startingTime2 &&
        startingTime !== startingTime3 &&
        startingTime !== startingTime4;

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newStartingTime: string
    ) => {
        if (newStartingTime !== null) {
            if (newStartingTime !== 'Custom') {
                setStartingTime(newStartingTime);
            } else {
                setExpandTimePickerDrawer(true);
            }
        }
    };

    const CustomStartingTimeButton = () => {
        if (isCustomStartingTime) {
            return (
                <StartingTimeButton
                    data-testid="StartingTimePickerCustomValue"
                    value={startingTime}
                    aria-label={startingTime}
                >
                    {startingTime}
                </StartingTimeButton>
            );
        } else {
            return '';
        }
    };

    return (
        <>
            <Typography
                variant="subtitle1"
                textAlign="left"
                sx={{ marginLeft: '16px', marginBottom: '16px' }}
            >
                {title}
            </Typography>
            <StartingTimePickerContent>
                <ToggleButtonGroup
                    data-testid="StartingTimePicker"
                    color="primary"
                    value={startingTime}
                    exclusive
                    onChange={handleChange}
                    aria-label="duration picker"
                    sx={{ marginTop: '8px', paddingBottom: '8px' }}
                    fullWidth
                >
                    <StartingTimeButton
                        data-testid="StartingTimePicker1"
                        value={startingTimeNow}
                        aria-label={startingTimeNow}
                    >
                        {startingTimeNow}
                    </StartingTimeButton>
                    <StartingTimeButton
                        data-testid="StartingTimePicker2"
                        value={startingTime2}
                        aria-label={startingTime2}
                    >
                        {startingTime2}
                    </StartingTimeButton>
                    <StartingTimeButton
                        data-testid="StartingTimePicker3"
                        value={startingTime3}
                        aria-label={startingTime3}
                    >
                        {startingTime3}
                    </StartingTimeButton>
                    <StartingTimeButton
                        data-testid="StartingTimePicker4"
                        value={startingTime4}
                        aria-label={startingTime4}
                    >
                        {startingTime4}
                    </StartingTimeButton>
                    {CustomStartingTimeButton()}
                    <StartingTimeButton
                        data-testid="StartingTimePickerCustom"
                        value={startingTimeCustom}
                        aria-label={startingTimeCustom}
                    >
                        {startingTimeCustom}
                    </StartingTimeButton>
                </ToggleButtonGroup>
                {props.startingTime !== 'Now' && (
                    <AlertBox
                        alertText={`Note! You are booking the room for a future time`}
                        sx={{ marginBottom: '8px' }}
                    />
                )}
            </StartingTimePickerContent>
        </>
    );
};

export default StartingTimePicker;
