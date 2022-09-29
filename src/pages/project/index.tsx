import { useState, useEffect } from 'react';

import { useNavigate, useParams, Outlet } from 'react-router-dom';

// custom components
import Owned from './owned';
import WhitelistOpp from './whitelist_opp';
import DaoVote from './dao_vote';
import DropDown from '../../components/dropdown';

import './index.scss'

// redux
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  selectOneProject,
  setOneProject,
  setOwnedNfts,
  selectProjects,
  selectDropList
} from '../../app/slice/projectSlice'
import { selectWalletAddress } from '../../app/slice/wallletSlice';
import { setLoadingFlag } from '../../app/slice/wallletSlice';
import { setOneProjectAsync } from '../../app/slice/projectSlice';
import { setProjectsAsync } from '../../app/slice/projectSlice';

import { SolanaClient } from '../../helpers';
import { BACKEND_URL, CLUSTER_API, DISCORD_REDIRECT_URL } from '../../config';
import { selectDiscordInfo } from '../../app/slice/dashboardSlice';

const initDropList = [
  { value: ' ' }
]

const Project = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const allProjects = useAppSelector(selectProjects)
  const discordInfo = useAppSelector(selectDiscordInfo)
  const discordId = discordInfo.id
  const { projectId } = useParams()

  // redux
  const selectedProject = useAppSelector(selectOneProject)
  const walletAddress = useAppSelector(selectWalletAddress)
  const dropList = useAppSelector(selectDropList)

  // state
  const [caption, setCaption] = useState(selectedProject.name || 'Select DAO')
  // const [dropList, setDropList] = useState(initDropList)

  const onClickLeftMenu = (path: string) => {
    localStorage.setItem('lastTab', path)
    navigate('/project/' + projectId + path)
  }

  const onClickDiscordConnect = () => {
    window.location.href = DISCORD_REDIRECT_URL
    // window.location.reload()
  }

  const onClickDao = (selectedDao: string) => {
    if (caption === selectedDao) {
      return
    }
    setCaption(selectedDao)

    if (allProjects.length > 0) {
      let tempProject: any
      allProjects.map((project: any) => {
        if (selectedDao === project.name) {
          tempProject = project
        }
      })
      dispatch(setOwnedNfts([]))
      dispatch(setOneProject(tempProject))
      const lastTab = localStorage.getItem('lastTab')
      setLoadingFlag(false)
      navigate('/project/' + tempProject.keyValue + lastTab)
    }
  }

  const gotoOwnedNfts = () => {
    navigate(`/project/${selectedProject.keyValue}`)
  }

  useEffect(() => {
    (async () => {
      dispatch(setLoadingFlag(true))
      if (!selectedProject._id) {
        await setOneProjectAsync(projectId as string, dispatch)
        if (allProjects.length === 0) {
          await setProjectsAsync(dispatch)
        }
      }
    })()
  }, [])

  // get owned nft
  useEffect(() => {
    (async () => {
      try {
        dispatch(setLoadingFlag(true))
        if (walletAddress && selectedProject._id) {
          // dispatch(setLoadingFlag(true))
          console.log('get owned nft...')
          const solanaClient = new SolanaClient({ rpcEndpoint: process.env.CLUSTER_API || CLUSTER_API })
          console.log('selected project: ', selectedProject)
          const ownedNfts = await solanaClient.getAllCollectiblesWithCreator([walletAddress as string], selectedProject.creatorAddress)
          console.log('owned: ', ownedNfts)
          if (!(selectedProject.creatorAddress && selectedProject.creatorAddress.length > 0)) {
            dispatch(setOwnedNfts([]))
          } else {
            dispatch(setOwnedNfts(ownedNfts[walletAddress as string]))
          }
        }
      } catch (e) {
        console.log(e)
      }
      dispatch(setLoadingFlag(false))
      const lastTab = localStorage.getItem('lastTab')
      if (lastTab === '/') {
        dispatch(setLoadingFlag(false))
      }
    })()
  }, [selectedProject._id, walletAddress])

  // get dao drop down list
  // useEffect(() => {
  //   if (allProjects.length > 0) {
  //     const temp = allProjects.map((item: any) => {
  //       return { value: item.name }
  //     })

  //     setDropList(temp)
  //     setCaption(selectedProject.name)
  //   }
  // }, [allProjects.length])

  return (
    <div className='project-body'>
      <div className='project-tab-header'>
        <DropDown dropList={dropList} caption={caption} setCaption={onClickDao} />
      </div>
      <br />
      {
        discordId ? (
          <div className='project-tab-body'>
            <div className='left-section'>
              <div>
                <img src={BACKEND_URL + selectedProject.image} alt='dao' onClick={gotoOwnedNfts} />
                <div className='bottom-button'>
                  <button onClick={() => navigate('/wlopp')}>whitelist&nbsp;opportunities</button>
                  <button onClick={() => navigate('/project/' + projectId + '/vote')}>DAO VOTE</button>
                </div>
              </div>

              <div>
                <div className='project-name' onClick={gotoOwnedNfts}>
                  {selectedProject.name}
                </div>
                <div className='desc'>
                  {selectedProject.description}
                </div>
                <button onClick={() => onClickLeftMenu('/wlopp')}>whitelist&nbsp;opportunities</button>
                <button onClick={() => onClickLeftMenu('/vote')}>DAO&nbsp;VOTE</button>
              </div>
            </div>
            <div className='right-section'>
              <Outlet />
            </div>
          </div>
        ) : (
          <div className='disconnect-body'>
            <div className='message'>
              Connect your discord to gain access to the dashboard
            </div>
            <div className='connect-btn'>
              <button onClick={onClickDiscordConnect}>CONNECT DISCORD</button>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default Project