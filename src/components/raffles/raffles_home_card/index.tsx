import * as React from 'react';
import { useState, useEffect } from 'react'
import { FaDiscord, FaTwitter, FaLink } from 'react-icons/fa';
import { FaTicketAlt } from 'react-icons/fa'
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import './index.scss'

import { BACKEND_URL } from '../../../config';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAppSelector } from '../../../app/hooks';
import { selectDiscordInfo } from '../../../app/slice/dashboardSlice';
import { warnToast } from '../../../helpers/toast';
import WinnerModal from '../winner_modal';

const RafflesHomeCard = (props: any) => {
  const { getCurrentTickets, getMyRaffles } = props
  const [data, setData] = useState(props.data)
  const { publicKey } = useWallet()

  // redux
  const discordInfo = useAppSelector(selectDiscordInfo)
  const discordId = discordInfo.id
  const [raffleWinner, setRaffleWinner] = useState({ discordName: '', walletAddress: '' })
  const [ticketToEnter, setTicketToEnter] = useState(0)
  const [winnerModalShow, setWinnerModalShow] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  const shortDisplay = (origin: string) => {
    return origin.slice(0, 4) + '...' + origin.slice(origin.length - 4, origin.length)
  }


  const getMyEntries = () => {
    let temp: number = 0
    if (data.raffle.rafflers && data.isRaffleJoined) {
      data.raffle.rafflers.map((raffler: any) => {
        if (raffler.discordId === discordId) {
          temp += raffler.entries
        }
      })
    }
    return temp
  }

  const myEntries = getMyEntries()

  const enterRaffle = async () => {
    console.log('Enter raffle')
    if (!publicKey) {
      warnToast("Please connect wallet!")
      return
    }
    if (!(ticketToEnter > 0)) {
      warnToast("Please correct type ticket number")
      return
    }

    if (data.raffle.type === 0) { // NFT
      if (ticketToEnter > props.nftTicketNumber) {
        warnToast("You don't have enough ticket.")
        return
      }
      if (ticketToEnter > data.raffle.maxTicket) {
        warnToast(`You can use maxium ${data.raffle.maxTicket} tickets`)
        return
      }
    } else {
      if (ticketToEnter > props.wlTicketNumber) {
        warnToast("You don't have enough ticket.")
        return
      }
    }
    setIsLoading(true)
    const id = toast.loading("Entering raffle in progress...")
    try {
      const result = await axios.post(`${BACKEND_URL}/api/raffles/enterRaffle`, {
        data: {
          discordId,
          discordName: discordInfo.username + '#' + discordInfo.discriminator,
          walletAddress: publicKey?.toString(),
          raffleId: data.raffle._id,
          ticketNumber: ticketToEnter
        }
      })

      if (result.data.success) {
        setData(result.data.data)
        // setDate(result.data.data.mintDate)
        toast.update(id, { render: "You entered successfully", type: "success", isLoading: false, autoClose: 3000, closeOnClick: true });
        await getCurrentTickets()
        await getMyRaffles()
      } else {
        toast.update(id, {
          render: "You failed to enter raffle", type: "error", isLoading: false, autoClose: 3000, closeOnClick: true,
        });
      }
    } catch (error) {
      console.log(error)
      toast.update(id, {
        render: "Something went wrong!", type: "error", isLoading: false, autoClose: 3000, closeOnClick: true,
      });
    }
    setIsLoading(false)
  }

  const getWinner = (discordId: string) => {
    if (data.raffle.isEnded) {
      let temp: any = { discordName: '', walletAddress: '' }
      if (data.raffle.rafflers && data.raffle.type === 0) {
        data.raffle.rafflers.map((raffler: any) => {
          if (raffler.discordId === discordId) {
            temp.discordName = raffler.discordName
            temp.walletAddress = raffler.walletAddress
          }
        })
      }
      return temp
    }
  }

  const viewWinners = () => {
    setWinnerModalShow(true)
  }

  const date = new Date(data.raffle.mintDate)

  return (
    <>
      <div className='raffles-card-body'>
        <div className='type' style={{ color: data.raffle.type === 0 ? '#FFFFFF' : '#5F4314', background: data.raffle.type === 0 ? '#FBAD27' : '#FFFFFF' }}>
          {data.raffle.type === 0 ? 'NFT RAFFLE' : 'WL RAFFLE'}
        </div>
        <div className='left'>
          <img src={`${BACKEND_URL + data.raffle.image}`} alt={data.raffle.raffleName} />
        </div>
        <div className='right'>
          <div className='nft-name'>{data.raffle.raffleName}</div>
          <div className='links'>
            <a href={data.raffle.twitter} target='_blank'><FaTwitter /></a>
            <a href={data.raffle.discord} target='_blank'><FaDiscord /></a>
            <a href={data.raffle.website} target='_blank'><FaLink /></a>
          </div>
          <div className='datas'>
            {
              data.raffle.type === 1 ? (
                <>
                  <div className='data'>Supply: {data.raffle.supply}</div>
                  <div className='data'>Mint Price: {data.raffle.mintPrice}</div>
                  <div className='data'>
                    Mint Date: {data.raffle.mintDate ? date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() : 'TBA'}
                  </div>
                  <div className='data'>Ends in: {data.raffle.isEnded ? '00:00:00' : data.leftTime}</div>
                </>
              ) : (
                <>
                  <div className='data'>Project: {data.raffle.projectName}</div>
                  <div className='data'>Tickets Available: {data.raffle.maxTicket}</div>
                  <div className='data'>Availability: {data.raffle.availability === 0 ? 'Holders Only' : 'Public'}</div>
                  <div className='data'>Ends in: {data.raffle.isEnded ? '00:00:00' : data.leftTime}</div>
                </>
              )
            }
          </div>
          {
            data.raffle.isEnded ? ( // Ended
              <>
                {
                  data.raffle.type === 0 ? ( // NFT
                    <div className='winner'>

                      Winner:<br /> {raffleWinner ? (
                        // <>{raffleWinner.discordName + '/'}{shortDisplay(raffleWinner.walletAddress)}</>
                        <>{getWinner(data.raffle.winners[0]).discordName + ' / '}{shortDisplay(getWinner(data.raffle.winners[0]).walletAddress)}</>
                      ) : (
                        <></>
                      )}
                    </div>
                  ) : ( // Whitelist
                    <button className='right-button' onClick={viewWinners}>View Winners</button>
                  )
                }
                <button
                  className='right-button'
                  disabled={true}
                  onClick={enterRaffle}
                  style={{
                    background: 'rgba(95, 67, 20, 0.5)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    marginTop: '10px',
                  }}
                >
                  Raffle Ended
                </button>
              </>
            ) : (
              <>
                {
                  data.type === 1 && (
                    <div className='winner top'>
                      Winners: {data.raffle.winnerNumber}
                    </div>
                  )
                }
                <div className='winner bottom'>
                  Entries: {data.entries}&nbsp;({myEntries || 0})
                </div>
                <div className='bottom-btn'>
                  {/* {
                    !data.isRaffleJoined && ( */}
                  <button className='left-button'>
                    <FaTicketAlt />
                    {/* <input type='number' value={ticketToEnter} onChange={(e) => setTicketToEnter(e.target.value)} />&nbsp;{data.raffle.type === 0 ? props.nftTicketNumber : props.wlTicketNumber} */}
                    <input type='text'
                      value={ticketToEnter >= 0 ? ticketToEnter : ''}
                      onChange={(e) => setTicketToEnter(Number(e.target.value))}
                    />
                  </button>
                  {/* )
                  } */}

                  <button
                    className='right-button'
                    // disabled={data.isRaffleJoined || (data.raffle.type === 0 ? props.nftTicketNumber > 0 : props.wlTicketNumber > 0) === false || isLoading}
                    disabled={(data.raffle.type === 0 ? props.nftTicketNumber > 0 : props.wlTicketNumber > 0) === false || isLoading}
                    onClick={enterRaffle}
                    style={{
                      background: ((data.raffle.type === 0 ? props.nftTicketNumber > 0 : props.wlTicketNumber > 0) === false) ? 'rgba(95, 67, 20, 0.5)' : '#5F4314',
                      // color: data.isRaffleJoined ? 'rgba(255, 255, 255, 0.5)' : '#FFFFFF'
                    }}
                  >
                    {/* {data.isRaffleJoined ? 'Raffle Joined' : 'Enter Raffle'} */}
                    Enter&nbsp;Raffle
                  </button>
                </div>
              </>
            )
          }
        </div>
      </div>
      <WinnerModal open={winnerModalShow} setOpen={setWinnerModalShow} data={data.raffle} />
    </>
  )
}

export default RafflesHomeCard