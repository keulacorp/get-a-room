import buildingData from './buildingData';

type Preferences = {
    building?: buildingData;
    fav_rooms?: string[] | null | undefined;
    showRoomResources?: boolean;
};

export default Preferences;
