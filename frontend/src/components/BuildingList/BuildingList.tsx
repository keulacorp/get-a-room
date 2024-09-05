import * as React from 'react';
import { Building } from '../../types';
import {
    Card,
    CardActionArea,
    CardContent,
    FormGroup,
    Stack,
    styled,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';

import Box from '@mui/material/Box';
import { GpsFixed } from '@mui/icons-material';
import LocationOffIcon from '@mui/icons-material/LocationOff';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import {
    CenterAlignedStack,
    StretchingHorizontalSpacer
} from '../../theme_2024';
import { useUserSettings } from '../../contexts/UserSettingsContext';
import UserDrawer from '../UserDrawer/UserDrawer';
import { UserIconButton } from '../BookingView/BookingView';

type BuildingSelectProps = {
    selectedBuildingId: string;
    setSelectedBuildingId: (buildingId: string) => any;
    buildings: Building[];
    handlePreferencesSubmit: (buildingId: string) => void;
    name: String | undefined;
};

const GridContainer = styled(Box)(({ theme }) => ({
    // container: true, FIXME villep: Check
    flexDirection: 'column',
    alignItems: 'flex-start'
}));

const Row = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between'
}));

const EndBox = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center'
}));

const handleProfileMenuOpen = (e: React.MouseEvent<HTMLElement>) => {
    // TODO villep NOT IMPLEMENTED
};

const BuildingList = (props: BuildingSelectProps) => {
    const { setSelectedBuildingId, buildings, handlePreferencesSubmit, name } =
        props;
    const [alignment, setAlignment] = React.useState('names');

    const clickFunction = (buildingId: string) => {
        setSelectedBuildingId(buildingId);
        handlePreferencesSubmit(buildingId);
    };

    const handleChange = (
        event: React.MouseEvent<HTMLElement>,
        newAlignment: string | null
    ) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
        }
    };
    const {
        showUserSettingsMenu,
        setShowUserSettingsMenu,
        expandedFeaturesAll,
        setExpandedFeaturesAll
    } = useUserSettings();

    const renderBuildingList = (): JSX.Element[] => {
        if (alignment === 'names') {
            buildings.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            buildings.sort((a, b) => {
                if (a.distance && b.distance) {
                    return a.distance - b.distance;
                } else {
                    return 999999;
                }
            });
        }
        return buildings.map((building) => {
            return (
                <Card
                    elevation={3}
                    key={building.name}
                    sx={{
                        borderRadius: '10px',
                        marginTop: '16px',
                        marginBottom: '16px'
                    }}
                >
                    <CardActionArea onClick={() => clickFunction(building.id)}>
                        <CardContent>
                            <GridContainer>
                                <Row>
                                    <Typography variant="h2">
                                        {building.name}
                                    </Typography>

                                    <EndBox>
                                        {building.distance ? (
                                            <>
                                                <Typography
                                                    variant="subtitle1"
                                                    align="right"
                                                    style={{
                                                        fontSize: '16px',
                                                        width: '68px',
                                                        lineHeight: '24px'
                                                    }}
                                                >
                                                    {Math.round(
                                                        building.distance
                                                    )}{' '}
                                                    km
                                                </Typography>
                                            </>
                                        ) : (
                                            <LocationOffIcon></LocationOffIcon>
                                        )}
                                    </EndBox>
                                </Row>
                            </GridContainer>
                        </CardContent>
                    </CardActionArea>
                </Card>
            );
        });
    };

    return (
        <div style={{ padding: '16px' }}>
            <Stack
                id="preferences-view"
                height="100%"
                justifyContent="space-around"
                alignItems="left"
            >
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        padding: '0px 16px'
                    }}
                >
                    <FormGroup sx={{ alignItems: 'left' }}>
                        <Typography textAlign="left" variant="h5">
                            Welcome, {name}!
                        </Typography>

                        <CenterAlignedStack direction={'row'}>
                            <Typography textAlign="left" variant="h1">
                                offices
                            </Typography>
                            <StretchingHorizontalSpacer />
                            {/*TODO villep: NOT IMPLEMENTED*/}
                            <UserIconButton
                                open={showUserSettingsMenu}
                                onClick={() => setShowUserSettingsMenu(true)}
                            />
                        </CenterAlignedStack>
                        <Typography
                            textAlign="left"
                            variant="subtitle1"
                            paddingTop="24px"
                            paddingBottom="8px"
                        >
                            SORT BASED ON
                        </Typography>
                    </FormGroup>
                </div>

                <ToggleButtonGroup
                    className="ToggleButtonGroupStyle"
                    color="primary"
                    value={alignment}
                    exclusive
                    onChange={handleChange}
                    style={{
                        overflow: 'auto',
                        display: 'flex',
                        padding: '0px',
                        width: '100%'
                    }}
                >
                    <ToggleButton
                        style={{
                            minWidth: '150px',
                            maxWidth: '250px',
                            width: '50%'
                        }}
                        value="proximity"
                    >
                        <GpsFixed style={{ minWidth: '40px' }}></GpsFixed>
                        Proximity
                    </ToggleButton>

                    <ToggleButton
                        style={{
                            minWidth: '150px',
                            maxWidth: '250px',
                            width: '50%'
                        }}
                        value="names"
                    >
                        <SortByAlphaIcon
                            style={{ minWidth: '40px' }}
                        ></SortByAlphaIcon>
                        Names
                    </ToggleButton>
                </ToggleButtonGroup>
                <div
                    style={{
                        height: '100%',
                        width: '100%',
                        padding: '0px 16px'
                    }}
                >
                    <Typography
                        textAlign="left"
                        variant="subtitle1"
                        paddingTop="24px"
                        marginBottom="-8px"
                    >
                        OFFICES
                    </Typography>
                </div>
            </Stack>

            {renderBuildingList()}

            <UserDrawer
                open={showUserSettingsMenu}
                toggle={() => setShowUserSettingsMenu(!showUserSettingsMenu)}
                name={name}
                expandedFeaturesAll={expandedFeaturesAll}
                setExpandedFeaturesAll={setExpandedFeaturesAll}
            />
        </div>
    );
};

export default BuildingList;
