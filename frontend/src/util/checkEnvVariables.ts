import GETAROOM_ENV from './getARoomEnv';

export const checkEnvVariables = () => {
    const { VITE_REACT_APP_SERVER_KEY, VITE_CLARITY_ID } = GETAROOM_ENV();

    if (!VITE_REACT_APP_SERVER_KEY) {
        throw new Error('Application server key not set');
    }
};
