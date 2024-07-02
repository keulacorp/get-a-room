import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled, Typography } from '@mui/material';

const DurationButton = styled(ToggleButton)(() => ({
    padding: '8px 16px'
}));

const DurationButtonGroup = styled(ToggleButtonGroup)(() => ({
    minWidth: '100%',
    padding: '6px 8px',
    marginBottom: '0px !important'
}));

type DurationPickerProps = {
    onChange: (duration: number) => void;
    title: string;
    bookingDuration: number;
    setBookingDuration: (dur: number) => void;
    setExpandDurationTimePickerDrawer: (show: boolean) => void;
};

const DurationPicker = (props: DurationPickerProps) => {
    const { onChange, title, bookingDuration, setBookingDuration, setExpandDurationTimePickerDrawer } = props;

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newDuration: number
    ) => {
        if (newDuration !== null) {
            if (newDuration !== 15 &&
                newDuration !== 30 &&
                newDuration !== 60 &&
                newDuration !== 120
            ) {
                setExpandDurationTimePickerDrawer(true)
            } else {
                setBookingDuration(newDuration);
                onChange(newDuration);
            }
        }
    };

    return (
        <div>
            <DurationButtonGroup
                data-testid="DurationPicker"
                color="primary"
                value={bookingDuration}
                exclusive
                onChange={handleChange}
                aria-label="duration picker"
                sx={{ marginBottom: '24px' }}
                fullWidth
            >
                <DurationButton
                    data-testid="DurationPicker15"
                    value={15}
                    aria-label="15 minutes"
                >
                    15 min
                </DurationButton>
                <DurationButton
                    data-testid="DurationPicker30"
                    value={30}
                    aria-label="30 minutes"
                >
                    30 min
                </DurationButton>
                <DurationButton
                    data-testid="DurationPicker60"
                    value={60}
                    aria-label="1 hour"
                >
                    1 h
                </DurationButton>
                <DurationButton
                    data-testid="DurationPicker120"
                    value={120}
                    aria-label="2 hours"
                >
                    2 h
                </DurationButton>
                <DurationButton
                    data-testid="DurationPickerCustom"
                    value={-1}
                    aria-label="Custom duration"
                >
                    Custom
                </DurationButton>
            </DurationButtonGroup>
        </div>
    );
};

export default DurationPicker;
