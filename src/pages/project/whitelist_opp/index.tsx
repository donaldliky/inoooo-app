import { useState, useEffect } from 'react';

import axios from 'axios';
import { FaCaretDown, FaCaretUp, FaTwitter } from 'react-icons/fa';

// custom components
import OpportunityCard from '../../../components/dashboard/opportunity_card';
import DropDown from '../../../components/dropdown';
import './index.scss'

// redux
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectOwnedNfts, selectOneProject } from '../../../app/slice/projectSlice';
import { selectWalletAddress } from '../../../app/slice/wallletSlice';
import { selectDiscordInfo } from '../../../app/slice/dashboardSlice';
import { setLoadingFlag } from '../../../app/slice/wallletSlice';

import { BACKEND_URL } from '../../../config';

const dropList = [
  { value: 'Ongoing' },
  { value: 'Ended' },
  { value: 'Unclaimed' }
]

const WhitelistOpp = (props: any) => {
  // redux
  const dispatch = useAppDispatch()
  const currentProject = useAppSelector(selectOneProject)
  const discordInfo = useAppSelector(selectDiscordInfo)
  const walletAddress = useAppSelector(selectWalletAddress)
  const discordId = discordInfo.id

  const [data, setData] = useState([])
  const [caption, setCaption] = useState(dropList[0].value)
  const [isTwitterAuthorized, setIsTwitterAuthorized] = useState(false)

  // authorize twitter
  const authorizeTwitter = () => {
    window.location.href = `${BACKEND_URL}/auth/twitter`
  }

  useEffect(() => {
    (
      async () => {
        console.log('discord id: ', discordId)
        let tempDiscordId = localStorage.getItem('discordId')

        dispatch(setLoadingFlag(true))

        if (currentProject._id && (discordId || tempDiscordId)) {
          try {
            console.log('fetching raffles...')
            const res = await axios.post(`${BACKEND_URL}/api/wlRaffle/getDataByStatus`, {
              data: {
                hostedProjectId: currentProject._id,
                status: caption,
                discordId: discordId || tempDiscordId
              }
            })
            console.log('raffles result: ', res.data.data)
            if (res.data.success) {
              setData([])
              setData(res.data.data)
              if (caption === 'Ongoing') {
                console.log('real: ', res.data.isTwitterAuthorized)
                setIsTwitterAuthorized(res.data.isTwitterAuthorized)
              }
            }
          } catch (e) {
            console.log(e)
          }
          dispatch(setLoadingFlag(false))
          console.log('loading false')
        }
      }
    )()
  }, [currentProject._id, caption, discordId])

  return (
    <div className='whitelist-opp-body'>
      <div className='header'>
        <div className='top'>
          <div className='left'>Whitelist&nbsp;Opportunities</div>
          <div className='right'>
            <button
              className='twitterBtn'
              onClick={authorizeTwitter}
            >
              <FaTwitter /> Authorize Twitter
            </button>
            <DropDown dropList={dropList} caption={caption} setCaption={setCaption} />
          </div>
        </div>
        <div className='bottom'>
          <div className='text'>{caption}</div>
          <hr />
        </div>
      </div>
      {
        isTwitterAuthorized ? (
          <div className='nft-section'>
            {
              data.length > 0 ? data.map((item: any, index: number) => {
                return <OpportunityCard
                  key={index}
                  data={item}
                  status={caption}
                  discordId={discordId}
                  isTwitterAuthorized={isTwitterAuthorized}
                  walletAddress={walletAddress}
                  creators={currentProject.creatorAddress}
                />
              }) : data.length === 0 && (
                <div className='no-exist'>
                  No whitelist opportunity.
                </div>
              )
            }
          </div>
        ) : (
          <div className='authorize-section'>
            <button onClick={authorizeTwitter}>Authorize Twitter</button>
          </div>
        )
      }
    </div>
  )
}

export default WhitelistOpp