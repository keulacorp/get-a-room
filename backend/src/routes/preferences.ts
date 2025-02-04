import express from 'express';
import * as controller from '../controllers/preferencesController';
import { validateBuildingInOrg } from '../controllers/validateBuildingInOrg';

export const router = express.Router();

// Returns preferences
router.get('/', controller.getPreferences(), (req, res) => {
    res.status(200).json({
        building: res.locals.preferences.building || {},
        fav_rooms: res.locals.preferences.fav_rooms || [],
        showRoomResources: res.locals.preferences.showRoomResources || false
    });
});

// Update preferences
router.put(
    '/',
    controller.readPreferenceBody(),
    validateBuildingInOrg(),
    controller.updatePreferencesToDatabase(),
    (req, res) => {
        res.status(200).json(res.locals.preferences);
    }
);
