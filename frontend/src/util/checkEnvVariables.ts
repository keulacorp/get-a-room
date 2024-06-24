export const checkEnvVariables = () => {
    const { VITE_REACT_APP_SERVER_KEY } = import.meta.env;

    if (!VITE_REACT_APP_SERVER_KEY) {
        throw new Error('Application server key not set');
    }
};
