import { configureStore } from '@reduxjs/toolkit';
import api from './api/entities'; // Import the default export
import entitiesReducer from './features/entities/entitiesSlice';

const store = configureStore({
  reducer: {
    entities: entitiesReducer.reducer,
    [api.reducerPath]: api.reducer,
    // Add other reducers if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export default store;
