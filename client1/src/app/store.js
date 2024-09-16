import { configureStore } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
    key: 'root',
    storage,
    // whitelist: []
}

const persistedReducer = persistReducer(persistConfig, counterReducer)

const store = configureStore({
    reducer: {
        counter: persistedReducer, // Include the persisted reducer
      },
})

const persistor = persistStore(store)

export { store, persistor }