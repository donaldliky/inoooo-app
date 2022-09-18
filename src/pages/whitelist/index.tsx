import * as React from 'react';

import { useState, useEffect, useMemo } from 'react';

import { useWallet } from '@solana/wallet-adapter-react';
// axios
import axios from 'axios';
// custom components
import WhitelistCard from '../../components/whitelist/whitelist_card';
import SearchInput from '../../components/search_input';
import DropDown from '../../components/dropdown';
// custom css
import './index.scss'

import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
// redux
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAuthorizeInfo, setDiscordInfo, selectAuthorizeInfo, selectDiscordInfo } from '../../app/slice/dashboardSlice';
import { setLoadingFlag, selectLoadingFlag } from '../../app/slice/wallletSlice';

import { BACKEND_URL, DISCORD_REDIRECT_URL } from '../../config';

const dropList = [
  { value: 'All Servers' },
  { value: 'Subscribed Projects' },
  { value: 'My Servers' }
]

const Whitelist = () => {
  const dispatch = useAppDispatch()
  let tempDiscordId = localStorage.getItem('discordId')
  const [searchValue, setSearchValue] = useState('')
  const [caption, setCaption] = useState(dropList[0].value)
  const [data, setData] = useState([])

  const discordInfo = useAppSelector(selectDiscordInfo)
  const authorizeInfo = useAppSelector(selectAuthorizeInfo)
  const loadingFlag = useAppSelector(selectLoadingFlag)
  const discordId = discordInfo.id || tempDiscordId

  const onClickDiscordConnect = () => {
    window.location.href = DISCORD_REDIRECT_URL
    // navigate('/')
  }

  const getProjectData = async (type: string) => {
    try {
      let tempType: string
      if (type === 'All Servers') {
        tempType = '0'
      } else if (type === 'Subscribed Projects') {
        tempType = '1'
      } else {
        tempType = '2'
      }

      const res = await axios.get(
        `${BACKEND_URL}/api/project/getProjectBySubscribeStatus?discordId=${discordId}&subscribeStatus=${tempType}&tokenType=${authorizeInfo.token_type}&accessToken=${authorizeInfo.access_token}`
        // `${BACKEND_URL}/api/project/getProjectBySubscribeStatus?discordId=${discordId}&subscribeStatus=${tempType}&tokenType=${'aaa'}&accessToken=${'bbb'}`
      )
      if (res.data.success) {
        return res.data.data
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    (
      async () => {
        if (discordId) {
          dispatch(setLoadingFlag(true))
          const res = await getProjectData(caption)
          console.log('res: ', res)
          if (res) {
            setData(res)
          } else {
            setData([])
          }
          dispatch(setLoadingFlag(false))
        }
      }
    )()
  }, [caption, discordId])

  return (
    <div className='dash-body'>
      <div className='filter'>
        <div className='filter-left'>
          <DropDown caption={caption} setCaption={setCaption} dropList={dropList} width={210} />
        </div>
        <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} placeholderVal="Projects" />
      </div>
      <div className='dash-tab-content'>
        {
          discordInfo.username ?
            <div className='connect-body'>
              {
                data.length > 0 && data.filter((item: any) => item.project.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0)
                  .map((item: any, index: number) => {
                    return (
                      <WhitelistCard
                        key={index}
                        data={item.project}
                        whitelistStatus={item.whitelistStatus}
                      />
                    )
                  })
              }
              {
                data.length === 0 && (
                  <div className='no-data'>
                    {loadingFlag ? '' : 'No data'}
                  </div>
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

export default Whitelist