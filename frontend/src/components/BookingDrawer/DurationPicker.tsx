import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled, Typography } from '@mui/material';
import {useSelector, useDispatch} from 'react-redux'

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
    additionalDuration: number;
};

const DurationPicker = (props: DurationPickerProps) => {
    const { onChange, title, bookingDuration, setBookingDuration, setExpandDurationTimePickerDrawer, additionalDuration } = props;

    const getQuickDuration = (bookingDuration: number): string => {
        if(bookingDuration === 15 ||
            bookingDuration === 30 ||
            bookingDuration === 60 ||
            bookingDuration === 120) {
                dispatch({ type: 'FALSE' });
                return bookingDuration.toString();
            }
        dispatch({ type: 'TRUE' });
        return bookingDuration.toString();
    }

    const isCustomDuration = useSelector((state: any) => state.customDurationReducer.custom)

    const dispatch = useDispatch();

    let quickDuration = getQuickDuration(bookingDuration + additionalDuration);

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
                dispatch({ type: "FALSE" });
                onChange(parseInt(newDuration));
            }
        }
    }

    function CustomDurationValueButton(): React.ReactNode {
        if (isCustomDuration) {
            return (<DurationButton
            data-testid="DurationPickerCustomValue"
            value={quickDuration}
            aria-label={quickDuration.toString() + ' min'}
            >
                {
                    quickDuration.toString() + ' min'
                }
            </DurationButton>)
        }
        return ("")
    }

    return (
        <div>
            <DurationButtonGroup
                data-testid="DurationPicker"
                color="primary"
                value={quickDuration}
                exclusive
                onChange={handleChange}
                aria-label="duration picker"
                sx={{ marginBottom: '24px' }}
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
                    1 h
                </DurationButton>
                <DurationButton
                    data-testid="DurationPicker120"
                    value={'120'}
                    aria-label="2 hours"
                >
                    2 h
                </DurationButton>
                {
                    CustomDurationValueButton()
                }
                <DurationButton
                    data-testid="DurationPickerCustom"
                    value={'Custom'}
                    aria-label="Custom duration"
                >
                    Custom
                </DurationButton>
            </DurationButtonGroup>
        </div>
    );
};

export default DurationPicker;
