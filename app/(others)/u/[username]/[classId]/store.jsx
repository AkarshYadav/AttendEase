// store.js
import { configureStore } from '@reduxjs/toolkit';
import attendanceReducer from './slice'; // import your slice here

const store = configureStore({
    reducer: {
        attendance: attendanceReducer,
    },
});

export default store;
