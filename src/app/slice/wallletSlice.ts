import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

const initialState = {
  walletAddress: '',
  connected: false,
  loadingFlag: false
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setWalletAddress: (state, action: PayloadAction<any>) => {
      state.walletAddress = action.payload
    },
    setConnected: (state, action: PayloadAction<any>) => {
      state.connected = action.payload
    },
    setLoadingFlag: (state, action: PayloadAction<any>) => {
      state.loadingFlag = action.payload
    },
  },
})

export const { setWalletAddress, setConnected, setLoadingFlag } = walletSlice.actions

export const selectWalletAddress = (state: RootState) => state.wallet.walletAddress
export const selectConneted = (state: RootState) => state.wallet.connected
export const selectLoadingFlag = (state: RootState) => state.wallet.loadingFlag

export default walletSlice.reducer