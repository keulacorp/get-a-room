import {
    createTheme,
    Theme as MuiTheme,
    ThemeOptions
} from '@mui/material/styles';
import TimeLeft, { TimeLeftTypography } from './components/util/TimeLeft';
import { ComponentsOverrides, ComponentsVariants } from '@mui/material';

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
        TimeLeftTypography: Partial<typeof TimeLeftTypography>;
    }

    interface Components {
        TimeLeftTypography?: {
            defaultProps?: ComponentsPropsList['MuiTypography'];
            styleOverrides?: ComponentsOverrides<Theme>['MuiTypography'];
            variants?: ComponentsVariants['MuiTypography'];
        };
    }
}

export const COLORS = {
    ACCENT_PINK: '#FFCAFF',
    ACCENT_GREEN: '#388641',
    ACCENT_YELLOW: '#F2BB32',
    ACCENT_BLUE: '#2C69D2',
    ACCENT_RED: '#E83520',
    TEXT_PRIMARY: '#1D1D1D',
    TEXT_DISABLED: '#A4A4A4',
    BACKGROUND_PRIMARY: '#FFF',
    BACKGROUND_DIM: '#FBFBF6',
    ALTERNATE: '#FBFBF6'
};

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
            disabled: COLORS.TEXT_DISABLED
        }
    },
    typography: {
        h1: {
            color: COLORS.BACKGROUND_DIM,
            fontFamily: 'Studio Feixen Sans',
            fontSize: '36px',
            fontStyle: 'normal',
            fontWeight: 'bold',
            lineHeight: 'normal',
            textTransform: 'uppercase'
        },
        h2: {
            color: COLORS.TEXT_PRIMARY,
            fontFamily: 'Studio Feixen Sans',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '24px',
            lineHeight: 'normal'
        },
        h3: {
            color: COLORS.TEXT_PRIMARY,
            fontFamily: 'Studio Feixen Sans',
            fontStyle: 'normal',
            fontWeight: 'bold',
            fontSize: '16px',
            lineHeight: 'normal'
        },
        body1: {
            fontFamily: 'Studio Feixen Sans',
            fontStyle: 'normal',
            fontWeight: 'bold',
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
        h4: { color: COLORS.TEXT_PRIMARY, fontWeight: 'bold' },
        h5: { color: COLORS.TEXT_PRIMARY, fontWeight: 'bold' }
    },
    zIndex: {
        snackbar: 1
    },
    components: {
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
                    fontWeight: 'bold',
                    fontSize: '24px',
                    lineHeight: '21px',

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
                    alignItems: 'flex-start'
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
        }
    }
};

export const theme_2024: Theme = createTheme(DEFAULT_THEME_2024);
