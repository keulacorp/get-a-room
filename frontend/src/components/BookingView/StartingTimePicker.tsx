import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled, Typography } from '@mui/material';
import { DateTime } from 'luxon';

const StartingTimeButton = styled(ToggleButton)(() => ({
    padding: '8px 16px'
}));

type StartingTimePickerProps = {
    onChange: (startingTime: string) => void;
    startingTime: string;
    title: string;
    setStartingTime: React.Dispatch<React.SetStateAction<string>>;
};

const timeFormat = (h: number, m: number) => {
    return h.toString() + ':' + (m < 10 ? '0' + m.toString() : m.toString());
};

const formatTimeToHalfAndFullHours = (
    startingTime: DateTime,
    addition: number
): string => {
    let timeObj = DateTime.fromObject({
        hour: Number(startingTime.hour),
        minute: Number(startingTime.minute),
        second: 0
    })
        .plus({ minutes: addition })
        .toObject();

    if (timeObj.minute! < 30) {
        timeObj.minute = 30;
    } else if (timeObj.minute! > 30) {
        timeObj = DateTime.fromObject({
            hour: Number(timeObj.hour),
            minute: 0,
            second: 0
        })
            .plus({ hours: 1 })
            .toObject();
    }
    return timeFormat(timeObj.hour!, timeObj.minute!);
};

const StartingTimePicker = (props: StartingTimePickerProps) => {
    const { onChange, title, startingTime, setStartingTime } = props;

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newStartingTime: string
    ) => {
        if (newStartingTime !== null) {
            setStartingTime(newStartingTime);
            onChange(newStartingTime);
        }
    };

    const now = DateTime.now();
    const startingTimeNow = 'Now'; //timeFormat(now.hour, now.minute);
    const startingTime2 = formatTimeToHalfAndFullHours(now, 0);
    const startingTime3 = formatTimeToHalfAndFullHours(now, 30);
    const startingTime4 = formatTimeToHalfAndFullHours(now, 60);

    return (
        <div>
            <Typography
                variant="subtitle1"
                textAlign="left"
                marginBottom={'8px'}
                marginLeft={'24px'}
            >
                {title}
            </Typography>
            <ToggleButtonGroup
                data-testid="StartingTimePicker"
                color="primary"
                value={startingTime}
                exclusive
                onChange={handleChange}
                aria-label="duration picker"
                sx={{ marginBottom: '24px' }}
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
            </ToggleButtonGroup>
        </div>
    );
};

export default StartingTimePicker;
