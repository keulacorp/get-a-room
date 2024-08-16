/// <reference types="vite-plugin-svgr/client" />
import { Box, Stack, Typography } from '@mui/material';
import GoogleLogin from './GoogleLogin';
import { styled } from '@mui/material/styles';
import { COLORS } from '../../theme_2024';

const LoginWrapper = styled('div')(({ theme }) => ({
    display: 'flex',
    width: '100%',
    minWidth: '375px',
    height: 'calc(431px+616px)',
    minHeight: 'calc(431px+616px)',
    flexShrink: 0,
    background: COLORS.BACKGROUND_PRIMARY,
    justifyContent: 'center'
}));

const LoginHeader = styled(Stack)(({ theme }) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundImage: 'url(login_background.jpeg)',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minWidth: '375px',
    height: 'calc(431px / (431px+616px) * 100%)',
    minHeight: '431px',
    flexShrink: 0,
    marginTop: 0,
    background:
        'linear-gradient(179deg, rgba(251, 251, 246, 0.00) 69.25%, rgba(251, 251, 246, 0.20) 99.55%), linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), url(login_background.jpeg) lightgray 50% / cover no-repeat'
}));

const LoginTitle = styled(Typography)(({ theme }) => ({
    lineHeight: 'normal',
    textTransform: 'uppercase',
    color: COLORS.BACKGROUND_WHITE,
    justifyContent: 'center',
    fontSize: '2em',
    marginBottom: '20%'
}));

const LoginContent = styled(Box)(({ theme }) => ({
    marginTop: '275px',
    width: '105%',
    display: 'inline-flex',
    height: '616px',
    padding: '70px 24px',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '54px',
    flexShrink: 0,
    zIndex: 100,

    borderRadius: '160px',
    background: 'var(--Colors-General-Layout-Colors-Background-Color, #FBFBF6)'
}));

const Logo = () => (
    <img width={'174px'} height={'168px'} src={'/new_logo.png'}></img>
);

const LoginView = () => {
    return (
        <LoginWrapper>
            <LoginHeader textAlign="center">
                <LoginTitle variant={'h1'}>
                    <LoginTitle variant="h2">Get a Room!</LoginTitle>
                </LoginTitle>
            </LoginHeader>
            <LoginContent id="login-view">
                <Box textAlign="center">
                    <Logo />
                    <Typography variant={'h3'}>
                        Meeting rooms on the fly
                    </Typography>
                </Box>
                <GoogleLogin />
            </LoginContent>
        </LoginWrapper>
    );
};

export default LoginView;
