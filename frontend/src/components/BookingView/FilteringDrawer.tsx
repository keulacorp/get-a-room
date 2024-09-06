import React from 'react';
import { Box, Typography } from '@mui/material';

import TextField from '@mui/material/TextField';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import InputAdornment from '@mui/material/InputAdornment';
import styled from '@mui/styled-engine';
import { useUserSettings } from '../../contexts/UserSettingsContext';
import { COLORS } from '../../theme_2024';
import BottomDrawer, { DrawerContent } from '../BottomDrawer/BottomDrawer';
import { Bookmark, BookmarkBorder } from '@mui/icons-material';

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
    margin: '24px 8px 8px 0'
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
        setDuration
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

    const handleCustomFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCustomFilter(event.target.value);
    };

    const handleCustomDuration = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        let value = parseInt(event.target.value);
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
                    <TextField
                        onChange={handleCustomFilter}
                        value={customFilter}
                        placeholder="Room name, resource..."
                        size="small"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <Row>
                        <SmallText>Custom Duration (Minutes)</SmallText>
                    </Row>

                    <TextField
                        size="small"
                        type="number"
                        placeholder="Give duration in minutes"
                        inputProps={{ min: 0, max: 1439 }}
                        value={duration}
                        onChange={handleCustomDuration}
                    />

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
                        <SmallText>Favourites</SmallText>
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
