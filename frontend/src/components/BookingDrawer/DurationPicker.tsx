import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled, Typography } from '@mui/material';

const DurationButton = styled(ToggleButton)(() => ({}));

const DurationButtonGroup = styled(ToggleButtonGroup)(() => ({
    overflow: 'scroll',
    width: '100%',
    marginBottom: '8px',
    paddingBottom: '8px'
}));

type DurationPickerProps = {
    onChange: (duration: number) => void;
    bookingDuration: number;
    setExpandDurationTimePickerDrawer: (show: boolean) => void;
    additionalDuration: number;
};

const DurationPicker = (props: DurationPickerProps) => {
    const {
        onChange,
        bookingDuration,
        setExpandDurationTimePickerDrawer,
        additionalDuration
    } = props;

    const bookingDurationTotal = bookingDuration + additionalDuration;
    let isCustomDuration: boolean =
        bookingDurationTotal !== 15 &&
        bookingDurationTotal !== 30 &&
        bookingDurationTotal !== 60 &&
        bookingDurationTotal !== 120;

    let quickDuration: string = bookingDurationTotal.toString();

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newDuration: string
    ) => {
        if (newDuration !== null) {
            if (newDuration === 'Custom') {
                setExpandDurationTimePickerDrawer(true);
                onChange(-1);
            } else {
                quickDuration = newDuration;
                onChange(parseInt(newDuration));
            }
        }
    };

    function toHourMinuteFormat(quickDuration: string): string | undefined {
        const min = parseInt(quickDuration);
        const h = Math.floor(min / 60);
        const m = min % 60;
        return (
            (h < 10 ? '0' : '') +
            h.toString() +
            ' h ' +
            (m < 10 ? '0' : '') +
            m.toString() +
            ' min'
        );
    }

    function CustomDurationValueButton(): React.ReactNode {
        if (isCustomDuration) {
            return (
                <DurationButton
                    data-testid="DurationPickerCustomValue"
                    value={quickDuration}
                    aria-label={toHourMinuteFormat(quickDuration)}
                >
                    {quickDuration} min
                </DurationButton>
            );
        }
        return '';
    }

    return (
        <DurationButtonGroup
            data-testid="DurationPicker"
            color="primary"
            value={quickDuration}
            exclusive
            onChange={handleChange}
            aria-label="duration picker"
            fullWidth
        >
            <DurationButton
                data-testid="DurationPicker15"
                value={'15'}
                aria-label="15 minutes"
            >
                15 min
            </DurationButton>
            <DurationButton
                data-testid="DurationPicker30"
                value={'30'}
                aria-label="30 minutes"
            >
                30 min
            </DurationButton>
            <DurationButton
                data-testid="DurationPicker60"
                value={'60'}
                aria-label="1 hour"
            >
                60 min
            </DurationButton>
            <DurationButton
                data-testid="DurationPicker120"
                value={'120'}
                aria-label="2 hours"
            >
                120 min
            </DurationButton>
            {CustomDurationValueButton()}
            <DurationButton
                data-testid="DurationPickerCustom"
                value={'Custom'}
                aria-label="Custom duration"
            >
                Custom
            </DurationButton>
        </DurationButtonGroup>
    );
};

export default DurationPicker;
