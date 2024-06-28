import React, {
    Dispatch,
    PropsWithChildren,
    ProviderProps,
    useState
} from 'react';
import { logout } from '../services/authService';
import useCreateNotification from '../hooks/useCreateNotification';
import { useHistory } from 'react-router-dom';

export interface UserSettingsContextProps {
    showUserSettingsMenu: boolean;
    setShowUserSettingsMenu: (show: boolean) => void;
    expandedFeaturesAll: boolean;
    setExpandedFeaturesAll: (expand: boolean) => void;
    doLogout: () => void;
}

export const userSettingsContextDefaults = {
    showUserSettingsMenu: false,
    expandedFeaturesAll: false
};
export const UserSettingsContext = React.createContext<
    Partial<UserSettingsContextProps>
>({
    ...userSettingsContextDefaults
});

export const UserSettingsProvider = (
    props: PropsWithChildren<ProviderProps<Partial<UserSettingsContextProps>>>
) => {
    const { createSuccessNotification, createErrorNotification } =
        useCreateNotification();
    const history = useHistory();
    const doLogout = () => {
        logout()
            .then(() => {
                createSuccessNotification('Logout successful');
                history.push('/login');
            })
            .catch(() => {
                createErrorNotification('Error in logout, try again later');
                history.push('/login');
            });
    };

    const [showUserSettingsMenu, setShowUserSettingsMenu] = React.useState(
        props.value?.showUserSettingsMenu || false
    );
    const [expandedFeaturesAll, setExpandedFeaturesAll] = useState(
        false as boolean
    );

    const ctx = {
        showUserSettingsMenu,
        setShowUserSettingsMenu,
        doLogout,
        expandedFeaturesAll,
        setExpandedFeaturesAll
    };

    return (
        <UserSettingsContext.Provider
            value={{ ...userSettingsContextDefaults, ...props.value, ...ctx }}
        >
            {props.children}
        </UserSettingsContext.Provider>
    );
};

export const useUserSettings = (): UserSettingsContextProps => {
    const ctx = React.useContext(UserSettingsContext);
    return ctx as UserSettingsContextProps;
};
