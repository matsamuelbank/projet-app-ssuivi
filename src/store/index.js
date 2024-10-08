import { configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { userInfoReducer } from './userInfo/user-info-slice';
import { projectsListReducer } from './project/projects-list-slice'; // Importation du reducer de projectsList

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
};

// Configurer les reducers persistants
const persistedUserInfoReducer = persistReducer(persistConfig, userInfoReducer);

export const store = configureStore({
  reducer: {
    USERINFO: persistedUserInfoReducer,
    PROJECTS_LIST: projectsListReducer, // Ajouter le reducer pour projectsList
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
