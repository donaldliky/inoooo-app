import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import dashboardSlice from './slice/dashboardSlice'
import projectSlice from './slice/projectSlice'
import walletSlice from './slice/wallletSlice'

const store = configureStore({
  reducer: {
    discord: dashboardSlice,
    projects: projectSlice,
    wallet: walletSlice
  },
  middleware: [...getDefaultMiddleware({ serializableCheck: false })]
})

export default store

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch