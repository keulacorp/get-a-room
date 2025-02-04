import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SnackbarAction, useSnackbar } from 'notistack';
import { ReactElement, ReactNode, useCallback } from 'react';

type NotificationType = 'default' | 'error' | 'success' | 'warning' | 'info';

const useCreateNotification = () => {
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    // @ts-ignore TODO villep: Fix type
    const closeAction: ReactElement = useCallback(
        (key: number) => {
            return (
                <IconButton
                    onClick={() => closeSnackbar(key)}
                    aria-label="close"
                >
                    <CloseIcon />
                </IconButton>
            );
        },
        [closeSnackbar]
    );

    const createNotificationWithType = useCallback(
        (message: string, type: NotificationType) => {
            enqueueSnackbar(message, {
                variant: type,
                action: closeAction
            });
        },
        [enqueueSnackbar, closeAction]
    );

    const createSuccessNotification = useCallback(
        (message: string) => {
            enqueueSnackbar(message, {
                variant: 'success',
                action: closeAction
            });
        },
        [enqueueSnackbar, closeAction]
    );

    const createErrorNotification = useCallback(
        (message: string) => {
            enqueueSnackbar(message, {
                variant: 'error',
                action: closeAction,
                autoHideDuration: 30000
            });
        },
        [enqueueSnackbar, closeAction]
    );

    return {
        createSuccessNotification,
        createErrorNotification,
        createNotificationWithType
    };
};

export default useCreateNotification;
