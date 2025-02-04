import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import styled from '@mui/styled-engine';
import { useUserSettings } from '../../contexts/UserSettingsContext';
import { COLORS } from '../../theme_2024';
import BottomDrawer, { DrawerContent } from '../BottomDrawer/BottomDrawer';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';
import DurationPicker from '../BookingDrawer/DurationPicker';

export const Row = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: '0px',
    width: '100%'
}));

export const SmallText = styled(Typography)(({ theme }) => ({
    textTransform: 'uppercase',
    fontSize: '12px',
    lineHeight: '12px',
    fontWeight: 'bold',
    fontStyle: 'normal',
    margin: '8px 0px'
}));

interface Props {
    open: boolean;
    toggle: (open: boolean) => void;
    roomSize: string[];
    setRoomSize: (size: string[]) => void;
    resources: string[];
    setResources: (resource: string[]) => void;
    customFilter: string;
    setCustomFilter: (customFilter: string) => void;
    onlyFavourites: boolean;
    setOnlyFavourites: (value: boolean) => void;
    filterCount: number;
    allFeatures: string[];
    onChange: (duration: number) => void;
    duration: number;
    setDuration: React.Dispatch<React.SetStateAction<number>>;
    setExpandDurationTimePickerDrawer: (show: boolean) => void;
    additionalDuration: number;
    setAdditionalDuration: (minutes: number) => void;
    setBookingDuration: (minutes: number) => void;
}

function CustomFilterTextField(props: {
    value: string;
    setCustomFilter: (customFilter: string) => void;
}) {
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            props.setCustomFilter(searchTerm);
            // Send Axios request here
        }, 2000);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    useEffect(() => {
        setSearchTerm(props.value);
    }, [props.value]);

    return (
        <TextField
            onChange={(event) => setSearchTerm(event.target.value)}
            value={searchTerm}
            placeholder="Room name, resource..."
            size="small"
            slotProps={{
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    ),
                    sx: {
                        fontFamily: 'StudioFeixenSans-Regular',
                        fontSize: '16px',
                        fontStyle: 'normal',
                        fontWeight: 2,
                        lineHeight: 'normal',
                        borderRadius: '20px'
                    }
                }
            }}
        />
    );
}

// Note: Actual filtering of the rooms is done one level up in booking view
const FilteringDrawer = (props: Props) => {
    const { showUserSettingsMenu } = useUserSettings();
    const {
        open,
        toggle,
        roomSize,
        setRoomSize,
        resources,
        setResources,
        customFilter,
        setCustomFilter,
        onlyFavourites,
        setOnlyFavourites,
        filterCount,
        allFeatures,
        onChange,
        duration,
        setDuration,
        additionalDuration,
        setAdditionalDuration,
        setBookingDuration
    } = props;

    const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
        paddingBottom: '8px',
        '& .MuiToggleButtonGroup-grouped': {
            borderWidth: '1px',
            borderStyle: 'solid',
            borderColor: COLORS.ACCENT_PINK,
            borderRadius: '20px',
            '&:not(:first-of-type)': {
                borderLeft: '1px solid COLORS.ACCENT_PINK', // Ensure the left border is visible
                borderRadius: '20px', // Maintain the rounded corners
                marginLeft: '-1px' // To prevent gaps between buttons
            },
            '&:first-of-type': {
                backgroundColor: COLORS.ACCENT_PINK
            }
        }
    }));

    const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
        borderRadius: '20px',
        marginRight: '8px'
    }));

    const StyledDrawerWrapper = styled(Box)(({ theme }) => ({
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }));

    const handleRoomSizeChange = (
        event: React.MouseEvent<HTMLElement>,
        newRoomSize: string[]
    ) => {
        setRoomSize(newRoomSize);
    };

    const handleResourcesChange = (
        event: React.MouseEvent<HTMLElement>,
        newResources: string[]
    ) => {
        setResources(newResources);
    };

    const handleDurationChange = (newDuration: number) => {
        if (newDuration !== -1) {
            setBookingDuration(newDuration);
        } else {
            setDuration(duration);
        }
        setAdditionalDuration(0);
    };

    const handleCustomDuration = (
        event: React.MouseEvent<HTMLElement>,
        customDuration: string
    ) => {
        if (customDuration === 'Custom') {
        }
        let value = parseInt(customDuration);
        if (!isNaN(value)) {
            value = Math.max(0, value);
            setDuration(value);
            onChange(value);
        } else {
            setDuration(NaN);
        }
    };

    return (
        <BottomDrawer
            headerTitle={'Filters'}
            filterCount={filterCount}
            iconLeft={'FilterList'}
            iconRight={'Expand'}
            isOpen={open}
            toggle={toggle}
            disableSwipeToOpen={showUserSettingsMenu}
            mounted={true}
            zindex={1200}
        >
            <StyledDrawerWrapper>
                <DrawerContent>
                    <Row>
                        <SmallText>Custom Filter</SmallText>
                    </Row>
                    <CustomFilterTextField
                        setCustomFilter={setCustomFilter}
                        value={customFilter}
                    />

                    <Row sx={{ marginTop: '24px' }}>
                        <SmallText>Custom Duration (Minutes)</SmallText>
                    </Row>
                    <Row>
                        <DurationPicker
                            onChange={handleDurationChange}
                            bookingDuration={duration}
                            setExpandDurationTimePickerDrawer={
                                props.setExpandDurationTimePickerDrawer
                            }
                            additionalDuration={additionalDuration}
                        />
                    </Row>
                    <Row>
                        <SmallText>Room Size (People)</SmallText>
                    </Row>
                    <StyledToggleButtonGroup
                        value={roomSize}
                        onChange={handleRoomSizeChange}
                    >
                        <StyledToggleButton value="1-2">1-2</StyledToggleButton>
                        <StyledToggleButton value="3-5">3-5</StyledToggleButton>
                        <StyledToggleButton value="6-7">6-7</StyledToggleButton>
                        <StyledToggleButton value="8-99999">
                            8+
                        </StyledToggleButton>
                    </StyledToggleButtonGroup>
                    <Row>
                        <SmallText>Resources</SmallText>
                    </Row>
                    <StyledToggleButtonGroup
                        value={resources}
                        onChange={handleResourcesChange}
                        sx={{ minHeight: '56px' }}
                    >
                        {allFeatures.map((feature) => (
                            <StyledToggleButton key={feature} value={feature}>
                                {feature}
                            </StyledToggleButton>
                        ))}
                    </StyledToggleButtonGroup>
                    <Row>
                        <SmallText>Pinned rooms</SmallText>
                    </Row>
                    <ToggleButton
                        value="favourites"
                        selected={onlyFavourites}
                        onChange={() => setOnlyFavourites(!onlyFavourites)}
                    >
                        {props.onlyFavourites ? (
                            <Bookmark sx={{ color: '#F04E30' }} />
                        ) : (
                            <BookmarkBorder />
                        )}
                        &nbsp; Only bookmarked
                    </ToggleButton>
                </DrawerContent>
            </StyledDrawerWrapper>
        </BottomDrawer>
    );
};

export default FilteringDrawer;
