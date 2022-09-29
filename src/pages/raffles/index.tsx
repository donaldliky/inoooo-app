import * as React from 'react';
import { useState, useEffect } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import RafflesHomeCard from '../../components/raffles/raffles_home_card';
import TicketModal from '../../components/raffles/ticket';
import { FaTicketAlt } from 'react-icons/fa'
import axios from 'axios';
// solana
import * as SolanaWeb3 from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
// This is the library you use to connect a wallet, import the React hook from it
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

// custom components
import SearchInput from '../../components/search_input';
import DropDown from '../../components/dropdown';
import { warnToast, successToast, errorToast } from '../../helpers/toast';

// redux
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setAuthorizeInfo, setDiscordInfo, selectAuthorizeInfo, selectDiscordInfo } from '../../app/slice/dashboardSlice';
import { selectLoadingFlag, setLoadingFlag } from '../../app/slice/wallletSlice';
import { DISCORD_REDIRECT_URL, BACKEND_URL, HUNT_TOKEN_ADDRESS, RECEIVER_ADDRESS } from '../../config';
import './index.scss'

const dropListRaffles = [
  { value: 'All Rafflles' },
  { value: 'Whitelist Raffles' },
  { value: 'NFT Raffles' },
  { value: 'Holders Only' }
]

const droplistOngoing = [
  { value: 'All' },
  { value: 'Ongoing' },
  { value: 'Ended' }
]

const webhookUrl = 'https://discord.com/api/webhooks/1023590740447739915/2QS5Ji3UcUTP4udsDfZBal-NF-hu6Gyk2u_tMQKEuFCy1CU68CaGJg7rBSYBAMcnUZS0'
// const webhookUrl = 'https://discord.com/api/webhooks/880147380966321/HycCH_DMzkD5zXASVVvj3QRXHUnxs0pxuRzSbBs_UH7p71PS_AXD002Mq'

const Raffles = (props: any) => {
  const dispatch = useAppDispatch()
  const [data, setData] = useState([])
  const [searchValue, setSearchValue] = useState('')
  let tempDiscordId = localStorage.getItem('discordId')

  const [captionRaffles, setCaptionRaffles] = useState(dropListRaffles[0].value)
  // const [captionAvailabilty, setCaptionAvailiabilty] = useState(droplistPublic[0].value)
  const [captionTimeStatus, setCaptionTimeStatus] = useState(droplistOngoing[0].value)

  const [ticketModalShow, setTicketModalShow] = useState(false)
  const [ticketType, setTicketType] = useState(0)
  // const [nftTickets, setNftTickets] = useState(0)
  // const [wlTickets, setWlTickets] = useState(0)
  const [userData, setUserData] = useState({
    discordId: '',
    wlTickets: 0,
    nftTickets: 0
  })
  const [myRaffles, setMyRaffles] = useState([])

  const loadingFlag = useAppSelector(selectLoadingFlag)
  const discordInfo = useAppSelector(selectDiscordInfo)
  const discordId = discordInfo.id || tempDiscordId

  // solana
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const { publicKey, signTransaction } = useWallet()

  const onClickBuy = async (type: number) => {
    setTicketType(type)
    setTicketModalShow(true)
  }

  const onClickDiscordConnect = () => {
    window.location.href = DISCORD_REDIRECT_URL
  }

  const getRafflesData = async () => {
    try {
      let filters: any[] = []
      let filter: any
      switch (captionRaffles) {
        case 'All Raffles':
          filter = 3
          break;
        case 'Holders Only':
          filter = 2
          break;
        case 'Whitelist Raffles':
          filter = 1
          break;
        case 'NFT Raffles':
          filter = 0
          break;
        default:
          filter = 3
          break;
      }
      filters.push(filter)

      filters.push(captionTimeStatus)

      const res = await axios.post(`${BACKEND_URL}/api/raffles/getDataByStatus`, {
        discordId,
        filters
      })
      if (res.data.success) {
        return res.data.data
      }
      dispatch(setLoadingFlag(false))
    } catch (error) {
      console.log(error)
      dispatch(setLoadingFlag(false))
    }
  }

  const buyTicket = async (type: number, ticketNumber: number) => {
    if (!(ticketNumber > 0)) {
      warnToast('Please type correct number of tickets to buy.')
      return
    }

    try {
      // transfer HUNT token
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError()
      if (!HUNT_TOKEN_ADDRESS || !RECEIVER_ADDRESS) {
        console.log('not defined HUNT token address or receiver address')
        errorToast("Something went wrong!")
        return
      }

      const toPublicKey = new SolanaWeb3.PublicKey(RECEIVER_ADDRESS)
      const tokenPublicKey = new SolanaWeb3.PublicKey(HUNT_TOKEN_ADDRESS)

      const fromTokenAccount = await getAssociatedTokenAddress(
        tokenPublicKey,
        publicKey
      )

      const toTokenAccount = await getAssociatedTokenAddress(
        tokenPublicKey,
        toPublicKey,
        true
      )

      const ataTokenToInfo = await connection.getAccountInfo(toTokenAccount)
      let transaction = new SolanaWeb3.Transaction()
      if (!ataTokenToInfo) {
        transaction.add(
          createAssociatedTokenAccountInstruction(
            publicKey,
            toTokenAccount,
            toPublicKey,
            tokenPublicKey
          )
        )
      }
      transaction.add(
        createTransferInstruction(
          fromTokenAccount,
          toTokenAccount,
          publicKey,
          ticketNumber * 10 * Math.pow(10, 9),
          [],
          TOKEN_PROGRAM_ID
        )
      )

      const latestBlockHash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockHash.blockhash;
      transaction.feePayer = publicKey;
      const signed = await wallet?.signTransaction(transaction)

      if (signed) {
        const signature = await connection.sendRawTransaction(signed.serialize());
        console.log('signatrue: ', signature)
        await connection.confirmTransaction(signature)
      }

      // database
      const res = await axios.post(`${BACKEND_URL}/api/follower/buyTicket`, {
        data: {
          discordId,
          discordName: discordInfo.username + '#' + discordInfo.discriminator,
          ticketType: type,
          ticketNumber: ticketNumber
        }
      })

      if (res.data.success) {
        setUserData(res.data.data)
      }
      successToast(`You bought ${ticketNumber} ${type === 1 ? 'Whitelist' : 'NFT'} ticket!`)
      setTicketModalShow(false)
    } catch (error) {
      console.log(error)
      errorToast("Something went wrong.")
    }
  }

  // get current tickets number
  const getCurrentTickets = async () => {
    const resTickets = await axios.get(`${BACKEND_URL}/api/follower/getUser?discordId=${discordId}`)
    if (resTickets.data.success && resTickets.data.data) {
      setUserData(resTickets.data.data)
    }
  }

  // get my raffles
  const getMyRaffles = async () => {
    const resMyRaffels = await axios.get(`${BACKEND_URL}/api/raffles/getMyRaffles?discordId=${discordId}`)
    if (resMyRaffels.data.success && resMyRaffels.data.data) {
      setMyRaffles(resMyRaffels.data.data)
      console.log('raffles: ', resMyRaffels.data.data)
    }
  }

  // Raffles
  useEffect(() => {
    (
      async () => {
        if (discordId) {
          dispatch(setLoadingFlag(true))
          const res = await getRafflesData()
          if (res) {
            setData([])
            setData(res)
          } else {
            setData([])
          }
          dispatch(setLoadingFlag(false))
        }
      }
    )()
  }, [discordId, captionRaffles, captionTimeStatus])

  // Tickets and My Raffles
  useEffect(() => {
    (
      async () => {
        try {
          if (discordId) {
            await getCurrentTickets()
            await getMyRaffles()
          }
        } catch (error) {
          console.log(error)
        }

      }
    )()
  }, [discordId])

  return (
    <div className='raffles-body'>
      <div className='raffles-tab-header'>
        <div className="raffles-tab-header-left">
          <DropDown caption={captionRaffles} setCaption={setCaptionRaffles} dropList={dropListRaffles} />
          <DropDown caption={captionTimeStatus} setCaption={setCaptionTimeStatus} dropList={droplistOngoing} />
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
                    Whitelist Tickets: {(userData && userData.wlTickets) ? userData.wlTickets : 0}
                  </div>
                  <div className='buy-section-right'>
                    <button onClick={() => onClickBuy(1)}>BUY <FaTicketAlt /></button>
                  </div>
                </div>
                <div className="buy-section">
                  <div className='buy-section-left'>
                    NFT Tickets: {(userData && userData.nftTickets) ? userData.nftTickets : 0}
                  </div>
                  <div className='buy-section-right'>
                    <button className='nft-btn' onClick={() => onClickBuy(0)}>BUY <FaTicketAlt /></button>
                  </div>
                </div>
              </div>

              <div>
                <div className="top-title" >
                  JOINED WHITELIST RAFFLES
                </div>
                <hr />
                {
                  myRaffles ? myRaffles.map((raffle: any, index: number) => {
                    if (raffle.type === 1) {
                      return <div key={index} className='join-title'>{raffle.name}</div>
                    }
                  }) : (
                    <>No data</>
                  )
                }
              </div>

              <div>
                <div className="top-title" style={{ marginTop: '20px' }}>
                  JOINED NFT RAFFLES
                </div>
                <hr />
                {
                  myRaffles ? myRaffles.map((raffle: any, index: number) => {
                    if (raffle.type === 0) {
                      return <div key={index} className='join-title'>{raffle.name}</div>
                    }
                  }) : (
                    <>No data</>
                  )
                }
              </div>

            </div>
            <div className="raffles-tab-right-section">
              {
                (data && data.length > 0) ? data.filter((item: any) => item.raffle.raffleName.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0)
                  .map((item: any, index: number) => {
                    return <RafflesHomeCard
                      key={index}
                      data={item}
                      nftTicketNumber={userData.nftTickets}
                      wlTicketNumber={userData.wlTickets}
                      getCurrentTickets={getCurrentTickets}
                      getMyRaffles={getMyRaffles}
                    />
                  }) : (
                  <div className='no-data'>No data</div>
                )
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

      <TicketModal ticketModalShow={ticketModalShow} setTicketModalShow={setTicketModalShow} type={ticketType} buyTicket={buyTicket} />
    </div>
  )
}

export default Raffles