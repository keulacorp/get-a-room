import { configureStore, combineReducers } from '@reduxjs/toolkit'

import customDurationReducer from './customDurationReducer'
import customStartingTimeReducer from './customStartingTimeReducer'

const rootReducer = combineReducers({
    customDurationReducer,
    customStartingTimeReducer
})

const store = configureStore({
    reducer: rootReducer,
})
export default store;