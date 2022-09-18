import * as React from 'react';
import { useState, useEffect } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import RafflesHomeCard from '../../components/raffles/raffles_home_card';
import TicketModal from '../../components/raffles/ticket';
import { FaTicketAlt } from 'react-icons/fa'

// custom components
import SearchInput from '../../components/search_input';
import DropDown from '../../components/dropdown';

import { useNavigate } from 'react-router-dom';

// redux
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAuthorizeInfo, setDiscordInfo, selectAuthorizeInfo, selectDiscordInfo } from '../../app/slice/dashboardSlice';
import { DISCORD_REDIRECT_URL } from '../../config';
import './index.scss'


const ongoingDatas = [
  {
    img: 'right2.png', name: 'Chimpnana',
    datas: {
      supply: 4444,
      price: 1,
      date: 'TBA',
      endDate: 1,
      winners: 50,
      entries: 300
    },
    status: 0
  },
  {
    img: 'zoonies.png', name: 'Zoonies',
    datas: {
      supply: 4444,
      price: 1,
      date: 'TBA',
      endDate: 1,
      winners: 50,
      entries: 300
    },
    status: 0
  },
  {
    img: 'right2.png', name: 'Chimpnana',
    datas: {
      supply: 4444,
      price: 1,
      date: 'TBA',
      endDate: 1,
      winners: 50,
      entries: 300
    },
    status: 0
  },
  {
    img: 'zoonies.png', name: 'Zoonies',
    datas: {
      supply: 4444,
      price: 1,
      date: 'TBA',
      endDate: 1,
      winners: 50,
      entries: 300
    },
    status: 0
  },
  {
    img: 'right2.png', name: 'Chimpnana',
    datas: {
      supply: 4444,
      price: 1,
      date: 'TBA',
      endDate: 1,
      winners: 50,
      entries: 300
    },
    status: 0
  },
  {
    img: 'zoonies.png', name: 'Zoonies',
    datas: {
      supply: 4444,
      price: 1,
      date: 'TBA',
      endDate: 1,
      winners: 50,
      entries: 300
    },
    status: 0
  }
]

const dropListRaffles = [
  { value: 'All Rafflles' },
  { value: 'Whitelist Raffles' },
  { value: 'NFT Raffles' }
]

const droplistPublic = [
  { value: 'Public' },
  { value: 'Holders Only' }
]

const droplistOngoing = [
  { value: 'Ongoing' },
  { value: 'Ended' }
]

const Raffles = (props: any) => {
  const navigate = useNavigate()


  const [datas, setDatas] = useState(ongoingDatas)
  const [searchValue, setSearchValue] = useState('')

  const [captionRaffles, setCaptionRaffles] = useState(dropListRaffles[0].value)
  const [captionPublic, setCaptionPublic] = useState(droplistPublic[0].value)
  const [captionOngoing, setCaptionOngoing] = useState(droplistOngoing[0].value)

  const [ticketModalShow, setTicketModalShow] = useState(false)
  const [ticketType, setTicketType] = useState(0)

  const discordInfo = useAppSelector(selectDiscordInfo)

  const onClickBuy = (type: number) => {
    setTicketModalShow(true)
    setTicketType(type)
  }

  const onClickDiscordConnect = () => {
    window.location.href = DISCORD_REDIRECT_URL
    // navigate('/')
  }

  return (
    <div className='raffles-body'>
      <div className='raffles-tab-header'>
        <div className="raffles-tab-header-left">
          <DropDown caption={captionRaffles} setCaption={setCaptionRaffles} dropList={dropListRaffles} />
          <DropDown caption={captionPublic} setCaption={setCaptionPublic} dropList={droplistPublic} />
          <DropDown caption={captionOngoing} setCaption={setCaptionOngoing} dropList={droplistOngoing} />
        </div>
        <SearchInput searchValue={searchValue} setSearchValue={setSearchValue} placeholderVal='Raffles' />
      </div>
      {
        discordInfo.username ? (
          <div className='raffles-tab-body'>
            <div className="raffles-tab-left-section">
              <div>
                <div className="top-title">Your Tickets</div>
                <hr />
                <div className="buy-section">
                  <div className='buy-section-left'>
                    Whitelist Tickets: 3
                  </div>
                  <div className='buy-section-right'>
                    <button onClick={() => onClickBuy(0)}>BUY <FaTicketAlt /></button>
                  </div>
                </div>
                <div className="buy-section">
                  <div className='buy-section-left'>
                    NFT Tickets: 3
                  </div>
                  <div className='buy-section-right'>
                    <button className='nft-btn' onClick={() => onClickBuy(1)}>BUY <FaTicketAlt /></button>
                  </div>
                </div>
              </div>

              <div>
                <div className="top-title">
                  JOINED RAFFLES
                </div>
                <hr />
                <div className='join-title top-title-top'>Chimpnana Whitelist</div>
                <div className='join-title'>Just Ape #8012</div>
              </div>
            </div>
            <div className="raffles-tab-right-section">
              {
                datas.map((item: any, index: number) => {
                  return <RafflesHomeCard key={index} name={item.name} img={item.img} datas={item.datas} />
                })
              }
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

      <TicketModal ticketModalShow={ticketModalShow} setTicketModalShow={setTicketModalShow} type={ticketType} />
    </div>
  )
}

export default Raffles