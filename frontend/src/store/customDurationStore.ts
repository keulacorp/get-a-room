import { configureStore, combineReducers } from '@reduxjs/toolkit'

import customDurationReducer from './customDurationReducer'

const rootReducer = combineReducers({
    customDurationReducer
})

const store = configureStore({
    reducer: rootReducer,
})
export default store;