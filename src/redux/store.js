import { combineReducers, configureStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'reduxjs-toolkit-persist'
import EncryptedStorage from 'react-native-encrypted-storage'
import autoMergeLevel1 from 'reduxjs-toolkit-persist/lib/stateReconciler/autoMergeLevel1'
import userSlice from './slices/userSlice'
const persistConfig = {
  key: 'root',
  storage: EncryptedStorage,
  stateReconciler: autoMergeLevel1,
}

const reducers = combineReducers({
  userReducer: userSlice,
})

const _persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: _persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        /* ignore persistence actions */
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistedStore = persistStore(store)

