import {
    createTheme,
    Theme as MuiTheme,
    ThemeOptions
} from '@mui/material/styles';
import { TimeLeftTypography } from './components/util/TimeLeft';
import {
    ComponentsOverrides,
    ComponentsVariants,
    Container,
    Stack,
    styled
} from '@mui/material';
import { GarApp } from './components/App';
import { DoNotDisturbOn } from '@mui/icons-material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { RoomCardReservationStatusIndicator } from './components/RoomCard/RoomCard';

export const COLORS = {
    ACCENT_PINK: '#FFCAFF',
    ACCENT_GREEN: '#388641',
    ACCENT_YELLOW: '#F2BB32',
    ACCENT_BLUE: '#2C69D2',
    ACCENT_RED: '#E83520',
    TEXT_PRIMARY: '#1D1D1D',
    TEXT_DIMGREY: '#A4A4A4',
    BACKGROUND_PRIMARY: '#FFF',
    BACKGROUND_DIM: '#FBFBF6',
    ALTERNATE: '#FBFBF6'
};

export const DEFAULT_STYLES = {
    defaultSpacer: '24px',
    smallerSpacer: '16px'
};

export const DoNotDisturb = styled(DoNotDisturbOn)(({ theme }) => ({
    color: COLORS.ACCENT_RED
}));
export const CheckCircle = styled(CheckCircleIcon)(({ theme }) => ({
    color: COLORS.ACCENT_GREEN
}));

export const CenterAlignedStack = styled(Stack)(({ theme }) => ({
    alignItems: 'center',
    gap: 1
}));

export const DefaultVerticalSpacer = styled(Container)(({ theme }) => ({
    height: DEFAULT_STYLES.defaultSpacer,
    minHeight: DEFAULT_STYLES.defaultSpacer
}));
export const SmallerVerticalSpacer = styled(Container)(({ theme }) => ({
    height: DEFAULT_STYLES.smallerSpacer,
    minHeight: DEFAULT_STYLES.smallerSpacer
}));

export const StretchingHorizontalSpacer = styled(Container)(({ theme }) => ({
    alignSelf: 'stretch',
    flexDirection: 'column',
    justifyContent: 'space-between',
    display: 'flex'
}));

declare module '@mui/material/Button' {
    interface ButtonPropsVariantOverrides {
        dashed: true;
    }
}
type Theme = Omit<MuiTheme, 'components'>;

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        MuiStat: 'root' | 'value' | 'unit';
    }

    interface ComponentsPropsList {
        GarApp: Partial<typeof GarApp>;
        TimeLeftTypography: Partial<typeof TimeLeftTypography>;
        BackButtonAndHeader: Partial<typeof CenterAlignedStack>;
        RoomCardReservationStatusIndicator: Partial<
            typeof RoomCardReservationStatusIndicator
        >;
    }

    interface Components {
        GarApp?: {
            defaultProps?: ComponentsPropsList['MuiDivider'];
            styleOverrides?: ComponentsOverrides<Theme>['MuiDivider'];
            variants?: ComponentsVariants['MuiDivider'];
        };
        TimeLeftTypography?: {
            defaultProps?: ComponentsPropsList['MuiTypography'];
            styleOverrides?: ComponentsOverrides<Theme>['MuiTypography'];
            variants?: ComponentsVariants['MuiTypography'];
        };
        BackButtonAndHeader?: {
            defaultProps?: ComponentsPropsList['MuiStack'];
            styleOverrides?: ComponentsOverrides<Theme>['MuiStack'];
            variants?: ComponentsVariants['MuiStack'];
        };
        RoomCardReservationStatusIndicator?: {
            defaultProps?: ComponentsPropsList['MuiStack'];
            styleOverrides?: ComponentsOverrides<Theme>['MuiStack'];
            variants?: ComponentsVariants['MuiStack'];
        };
    }
}

export const DEFAULT_THEME_2024: ThemeOptions = {
    palette: {
        // background: { default: '#f6f5f5' },
        primary: { main: COLORS.BACKGROUND_PRIMARY },
        secondary: { main: COLORS.TEXT_PRIMARY },
        success: { main: COLORS.ACCENT_GREEN },
        warning: { main: COLORS.ACCENT_YELLOW },
        error: { main: COLORS.ACCENT_RED },
        text: {
            primary: COLORS.TEXT_PRIMARY,
            secondary: COLORS.BACKGROUND_PRIMARY,
            disabled: COLORS.TEXT_DIMGREY
        }
    },
    typography: {
        h1: {
            color: COLORS.TEXT_PRIMARY,
            fontFamily: 'Studio Feixen Sans',
            fontSize: '36px',
            fontStyle: 'normal',
            fontWeight: 4,
            lineHeight: 'normal',
            textTransform: 'uppercase'
        },
        h2: {
            color: COLORS.TEXT_PRIMARY,
            fontFamily: 'Studio Feixen Sans',
            fontStyle: 'normal',
            fontWeight: 4,
            fontSize: '24px',
            lineHeight: 'normal'
        },
        h3: {
            color: COLORS.TEXT_PRIMARY,
            fontFamily: 'Studio Feixen Sans',
            fontStyle: 'normal',
            fontWeight: 2,
            fontSize: '16px',
            lineHeight: 'normal'
        },
        body1: {
            fontFamily: 'Studio Feixen Sans',
            fontStyle: 'normal',
            fontWeight: 4,
            fontSize: '12px',
            lineHeight: 'normal'
        },
        subtitle1: {
            color: COLORS.TEXT_PRIMARY,
            fontFamily: 'Studio Feixen Sans',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '12px',
            lineHeight: '12px',
            textTransform: 'uppercase'
        },
        h4: {
            color: COLORS.TEXT_DIMGREY,
            fontFamily: 'Studio Feixen Sans',
            fontStyle: 'normal',
            fontWeight: 2,
            fontSize: '16px',
            lineHeight: 'normal'
        },
        h5: { color: COLORS.TEXT_PRIMARY, fontWeight: 'bold' }
    },
    zIndex: {
        snackbar: 1
    },
    components: {
        GarApp: {
            styleOverrides: {
                root: {
                    width: '100%',
                    minWidth: '100%',
                    backgroundColor: COLORS.BACKGROUND_PRIMARY,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }
            }
        },
        MuiToggleButton: {
            styleOverrides: {
                root: {
                    fontFamily: 'Studio Feixen Sans',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',

                    borderRadius: '50px',
                    border: '1px solid',
                    borderColor: COLORS.ACCENT_PINK,
                    boxSizing: 'border-box',
                    padding: '8px 24px',

                    color: COLORS.TEXT_PRIMARY,
                    fontStyle: 'normal',
                    fontWeight: 4,
                    fontSize: '16px',
                    lineHeight: 'normal',

                    '&.Mui-selected': {
                        color: COLORS.TEXT_PRIMARY,
                        background: COLORS.ACCENT_PINK
                    },
                    '&.Mui-selected:hover': {
                        background: COLORS.ACCENT_PINK
                    }
                }
            }
        },
        MuiToggleButtonGroup: {
            styleOverrides: {
                root: {
                    overflowX: 'auto',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    marginBottom: DEFAULT_STYLES.defaultSpacer
                }
            }
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    margin: '24px 0px'
                }
            }
        },
        TimeLeftTypography: {
            styleOverrides: {
                h2: {
                    color: COLORS.ACCENT_PINK,
                    textColor: COLORS.ACCENT_PINK,
                    fontStyle: 'normal',
                    fontWeight: 'bold',
                    fontSize: '24px',
                    lineHeight: '21px'
                }
            }
        },
        BackButtonAndHeader: {
            styleOverrides: {
                root: {
                    spacing: 0,
                    alignItems: 'center',
                    flexWrap: 'wrap'
                }
            }
        },
        RoomCardReservationStatusIndicator: {
            styleOverrides: {
                root: {
                    marginTop: '8px',
                    marginBottom: '8px'
                }
            }
        }
    }
};

export const theme_2024: Theme = createTheme(DEFAULT_THEME_2024);
