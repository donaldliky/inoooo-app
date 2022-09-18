import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'

const initialState = {
  authorizeInfo: {
    access_token: null,
    token_type: null,
    expires_in: null,
    scope: null
  },
  discordInfo: {
    id: null,
    username: null,
    avatar: null,
    avatar_decoration: null,
    discriminator: null,
    public_flags: null,
    flags: null,
    banner: null,
    banner_color: null,
    accent_color: null,
    locale: null,
    mfa_enabled: null
  }
}

export const dashboardSlice = createSlice({
  name: 'discord',
  initialState,
  reducers: {
    setAuthorizeInfo: (state, action: PayloadAction<any>) => {
      state.authorizeInfo = action.payload
    },
    setDiscordInfo: (state, action: PayloadAction<any>) => {
      state.discordInfo = action.payload
    }
  },
})

export const { setAuthorizeInfo, setDiscordInfo } = dashboardSlice.actions

export const selectAuthorizeInfo = (state: RootState) => state.discord.authorizeInfo

export const selectDiscordInfo = (state: RootState) => state.discord.discordInfo

export default dashboardSlice.reducer

