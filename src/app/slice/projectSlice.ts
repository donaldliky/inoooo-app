import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import axios from 'axios'
import { BACKEND_URL } from '../../config'

import { createAsyncThunk } from '@reduxjs/toolkit'

const initialState = {
  projects: [],
  ownedNfts: [],
  oneNft: {},
  oneProject: {
    _id: '',
    name: '',
    status: 0,
    subscriber: '',
    image: '',
    description: '',
    totalSupply: 0,
    mintPrice: 0,
    mintAddress: '',
    mintDate: '',
    daoHub: false,
    wlManagement: false,
    likes: 0,
    discord: '',
    twitter: '',
    website: '',
    creatorAddress: [],
    keyValue: '',
    nftNumber: 0
  }
}

export const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProjects: (state, action: PayloadAction<any>) => {
      state.projects = action.payload
    },
    setOwnedNfts: (state, action: PayloadAction<any>) => {
      state.ownedNfts = action.payload
    },
    setOneNft: (state, action: PayloadAction<any>) => {
      state.oneNft = action.payload
    },
    setOneProject: (state, action: PayloadAction<any>) => {
      state.oneProject = action.payload
    },
    setNftNumber: (state, action: PayloadAction<any>) => {
      state.oneProject.nftNumber = action.payload
    }
  },
})

export const { setProjects, setOwnedNfts, setOneProject, setOneNft, setNftNumber } = projectsSlice.actions

// export const selectCount = (state: RootState) => state.counter.value
export const selectProjects = (state: RootState) => state.projects.projects
export const selectOwnedNfts = (state: RootState) => state.projects.ownedNfts

export const selectOneProject = (state: RootState) => state.projects.oneProject
export const selectOneNft = (state: RootState) => state.projects.oneNft
// export const selectDiscordInfo = (state: RootState) => state.discord.discordInfo

// export const incrementAsync = (amount: number) => (dispatch: any) => {
//   setTimeout(() => {
//     dispatch(incrementByAmount(amount));
//   }, 1000);
// };
export default projectsSlice.reducer

// export const setProjectsAsync = createAsyncThunk(
//   'projects/fetchAllProjects',
//   async () => {
//     try {
//       const response = await axios.get(`${BACKEND_URL}/api/project/getAllData`)
//       if (response.data.success) {
//         console.log('data: ', response.data.data)
//         // dispatch(setProjects(response.data.data))
//       }
//     } catch (error) {
//       console.log(error)
//     }

//     // dispatch(setLoadingFlag(false))
//     // return response.data
//   }
// )
export const setProjectsAsync = async (dispatch: any) => {
  try {
    const res = await axios.get(`${BACKEND_URL}/api/project/getAllData`)
    if (res.data.success) {
      dispatch(setProjects(res.data.data))
    }
    // dispatch(setLoadingFlag(false))
  } catch (error) {
    console.log(error)
  }
}

export const setOneProjectAsync = async (projectId: string, dispatch: any) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/api/project/getDataByKeyValue?keyValue=${projectId}`)
    const result = response.data.data
    dispatch(setOneProject(result[0]))
  } catch (error) {
    console.log(error)
  }
}