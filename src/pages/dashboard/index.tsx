import { useState, useEffect } from 'react';

import axios from 'axios';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

// custom component
import HomeCard from '../../components/dashboard/home_card';
import SearchInput from '../../components/search_input';
import DropDown from '../../components/dropdown';

// redux
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectDiscordInfo } from '../../app/slice/dashboardSlice';
import { selectProjects, setOwnedNfts, setProjectsAsync, setOneProject } from '../../app/slice/projectSlice';
import { setLoadingFlag } from '../../app/slice/wallletSlice';

// variable
import { DISCORD_REDIRECT_URL, BACKEND_URL } from '../../config';

// css
import './index.scss'

const Dashboard = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [searchValue, setSearchValue] = useState('')
  // get parameter value from url
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const oauth_token = params.get('oauth_token');
  const oauth_verifier = params.get('oauth_verifier')
  const id = params.get('id')
  const username = params.get('username')

  const dropList = [
    { value: 'All Projects' },
    { value: 'Upcoming' },
    { value: 'Minted' }
  ]
  const [caption, setCaption] = useState(dropList[0].value)

  // redux
  const discordInfo = useAppSelector(selectDiscordInfo)
  const projects = useAppSelector(selectProjects)

  const onClickUpvote = async (name: string) => {
    await axios.get(`${BACKEND_URL}/api/upvote/${name}`)
  }

  const onClickDiscordConnect = () => {
    window.location.href = DISCORD_REDIRECT_URL
  }

  useEffect(() => {
    (
      async () => {
        if (discordInfo.username && discordInfo.discriminator) {
          dispatch(setLoadingFlag(true))
          await setProjectsAsync(dispatch)
          dispatch(setLoadingFlag(false))
        }
      }
    )()
  }, [discordInfo.username])

  useEffect(() => {
    dispatch(setOwnedNfts([]))
  }, [])

  useEffect(() => {
    (
      async () => {
        if (oauth_token && oauth_verifier && id && username && discordInfo.id) {
          const res = await axios.post(`${BACKEND_URL}/api/follower/add-event`, {
            data: {
              discordId: discordInfo.id,
              discordName: discordInfo.username + '#' + discordInfo.discriminator,
              oauth_token: oauth_token,
              oauth_verifier: oauth_verifier,
              twitterId: id,
              twitterUserName: username
            },
          })
          const temp: any = localStorage.getItem('lastProject')
          const lastProject = JSON.parse(temp)

          dispatch(setOneProject(lastProject))
          if (res.data.success) {
            navigate(`/project/${lastProject.keyValue}/wlopp`)
          }
        }
      }
    )()
  }, [discordInfo.id])

  return (
    <div className='dash-body'>
      <div className='filter'>
        <div className='filter-left'>
          <DropDown dropList={dropList} caption={caption} setCaption={setCaption} />
        </div>
        <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} placeholderVal="Projects" />
      </div>
      <div className='dash-tab-content'>
        {
          discordInfo.username ?
            <div className='connect-body'>
              {
                projects.length > 0 && (
                  projects.filter((item: any) => caption === 'Upcoming' ? (item.status === 0 && item.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) : caption === 'Minted'
                    ? (item.status === 1 && item.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0) : item.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0).map((item: any, index: number) => {
                      return (
                        <HomeCard
                          key={index}
                          data={item}
                          type={0}
                          onClickUpvote={onClickUpvote}
                        />
                      )
                    })
                )
              }
            </div>
            :
            <div className='disconnect-body'>
              <div className='message'>
                Connect your discord to gain access to the dashboard
              </div>
              <div className='connect-btn'>
                <button onClick={onClickDiscordConnect}>CONNECT DISCORD</button>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Dashboard