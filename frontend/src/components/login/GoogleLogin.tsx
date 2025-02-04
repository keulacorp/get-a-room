/// <reference types="vite-plugin-svgr/client" />

import { login } from '../../services/authService';
import { ButtonBase, Paper } from '@mui/material';
import { GoogleSvg } from '../images/svgImages';

const GoogleLogin = () => {
    return (
        <ButtonBase
            onClick={login}
            disableRipple={true}
            aria-label="Sign in with Google"
            sx={{
                '&:hover': {
                    filter: 'brightness(90%)'
                },
                '&:active': {
                    filter: 'brightness(80%)'
                }
            }}
        >
            <Paper elevation={5} sx={{ p: '1px', pb: 0 }}>
                <GoogleSvg width="16rem" height="4rem" />
            </Paper>
        </ButtonBase>
    );
};

export default GoogleLogin;
