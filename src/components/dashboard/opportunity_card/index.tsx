import * as React from 'react';
import { useState, useEffect } from 'react';
import { FaDiscord, FaTwitter, FaLink } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
// custom components
import WinnerTable from '../winner_table';
import ClaimModal from '../claim';
import DetailModal from '../detail_modal';
// css
import './index.scss'
import { BACKEND_URL } from '../../../config';
import { warnToast, errorToast } from '../../../helpers/toast';
// type
// 0: ongoing   1: ended  2: unclaimed 

// const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const OpportunityCard = (props: any) => {
  const { status, discordId, isTwitterAuthorized, walletAddress, creators } = props
  // modal
  const [tableShow, setTableShow] = useState(false)
  const [claimShow, setClaimShow] = useState(false)
  const [detailShow, setDetailShow] = useState(false)
  // data
  const [data, setData] = useState(props.data)
  const [isLoading, setIsLoading] = useState(false)

  // verify twitter
  const verifyTwitter = async (twitterLink: string) => {
    console.log('isTwitterAuthorized: ', isTwitterAuthorized)
    if (isTwitterAuthorized) {
      window.open(twitterLink, "_blank");
      // window.location.href = twitterLink
    } else {
      warnToast('You have to authorize twitter')
    }
  }

  // enter raffle
  const enterRaffle = async () => {
    if (data.isTwitterFollowed === false) {
      warnToast("Please follow twitter");
      return
    }
    setIsLoading(true)
    const id = toast.loading("Entering raffle in progress...")
    try {
      const res = await axios.post(`${BACKEND_URL}/api/wlRaffle/enterRaffle`, {
        data: {
          raffleProjectId: data.raffle._id,
          walletAddress: walletAddress,
          discordId: discordId,
          creators: creators
        }
      })
      if (res.data.success) {
        setData(res.data.data)
        toast.update(id, { render: "You entered successfully", type: "success", isLoading: false, autoClose: 3000, closeOnClick: true });
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

  const claimRole = async () => {
    try {
      const result = await axios.post(`${BACKEND_URL}/api/wlRaffle/claimRole`, {
        discordId: discordId,
        projectId: data.raffle._id
      })

      if (result.data.success) {
        setData(result.data.data)
      } else {
        errorToast('You failed to get the role')
      }
    } catch (error) {
      console.log(error)
    }
    setClaimShow(false)
  }

  // when click winners button
  const onClickViewWinners = async () => {
    setTableShow(true)
  }

  // when click claim button
  const onClickClaim = () => {
    if (data.isObtained) {
      warnToast("You have already obtained role")
      return
    }
    setClaimShow(true)
  }

  const onClickDetail = () => {
    setDetailShow(true)
  }

  const d = new Date(data.raffle.mintDate)

  return (
    <div className='opp-card-body'>
      <div className='left'>
        <img src={BACKEND_URL + data.raffle.image} alt='image' />
        <div>
          {
            status === 'Ongoing' ? (
              <div>
                <button
                  disabled={isLoading || data.isTwitterFollowed} onClick={() => verifyTwitter(data.raffle.twitter)}
                  style={{
                    background: data.isTwitterFollowed ? '#A3B554' : '',
                    color: data.isTwitterFollowed ? '#FCE2B7' : ''
                  }}
                >
                  {
                    data.isTwitterFollowed ? 'Twitter followed' : 'Follow Twitter'
                  }
                </button>
                <button
                  onClick={enterRaffle}
                  disabled={isLoading || data.isRaffleJoined}
                  style={{
                    background: data.isRaffleJoined ? '#AC8542' : '',
                    color: data.isRaffleJoined ? '#FCE2B7' : ''
                  }}
                >
                  {data.isRaffleJoined ? 'RAFFLE JOINED' : 'Enter Raffle'}
                </button>
              </div>
            ) : status === 'Ended' ? (
              <div>
                <button onClick={onClickViewWinners}>View Winners</button>
                <button
                  style={{ color: '#FCE2B7', backgroundColor: data.isWinner ? '#A3B554' : '#BCA377' }}
                  disabled={true}
                >
                  {data.isWinner ? 'WON' : 'LOST'}
                </button>
              </div>
            ) : (
              <div>
                <button
                  disabled={data.isObtained || (data.isWinner === false) || (data.subscribedStatus === false)}
                  onClick={onClickClaim}
                  // style={{ background: data.isObtained ? '#4DA438' : '' }}
                  style={{
                    background: data.subscribedStatus ? data.isObtained ? '#4DA438' : '' : '#BCA377',
                    color: data.subscribedStatus ? '#FFFFFF' : '#FCE2B7'
                  }}
                >
                  {data.subscribedStatus ? data.isObtained ? 'ROLE OBTAINED' : 'SECURE WHITELIST' : 'UNCLAIMED'}
                </button>
                <button style={{ color: '#FCE2B7', backgroundColor: data.isWinner ? '#A3B554' : '#BCA377' }} disabled={true}>
                  {data.isWinner ? 'WON' : 'LOST'}
                </button>
              </div>
            )
          }
          <button style={{ background: '#5F4314' }} onClick={onClickDetail}>View detail</button>
        </div>
      </div>
      <div className='right'>
        <div className='nft-name'>{data.raffle.projectName}</div>
        <div className='desc'>
          {data.raffle.description}
        </div>
        <div className='links'>
          <a href={data.raffle.twitter} target='_blank'><div><FaTwitter /></div></a>
          <a href={data.raffle.discord} target='_blank'><div><FaDiscord /></div></a >
          <a href={data.raffle.website} target='_blank'><div><FaLink /></div></a >
        </div >
        <div className='data-list'>
          <div className='data'>Supply: {data.raffle.supply ? data.raffle.supply : 'TBA'}</div>
          <div className='data'>Mint Price: {data.raffle.mintPrice ? data.raffle.mintPrice : 'TBA'}</div>
          <div className='data'>Mint Date: {data.raffle.mintDate ? d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear() : 'TBA'}
          </div>
          {
            status === 'Ongoing' ? (
              <div className='data'>
                Ends in: {data.leftTime}
              </div>
            ) : status === 'Ended' ? (
              <div className='data'>
                Ends in: Ended
              </div>
            ) : (
              <div className='data'>Whitelist: {data.subscribedStatus ? 'Active' : 'Closed'}</div>
            )
          }
        </div>
        <div className='winner top'>
          Winners: {data.raffle.wlSpots ? data.raffle.wlSpots : 'TBA'}
        </div>
        <div className='winner bottom'>
          Entries: {data.entries ? data.entries : 0}
        </div>
      </div>
      {
        status === 'Ended' && <WinnerTable open={tableShow} setOpen={setTableShow} data={data} discordId={discordId} winnerNames={data.winnerNames} hostedProjectName={data.hostedProjectName} />
      }
      {
        status === 'Unclaimed' && <ClaimModal open={claimShow} setOpen={setClaimShow} claimRole={claimRole} data={data.raffle} />
      }
      <DetailModal open={detailShow} setOpen={setDetailShow} detail={data.raffle.detail} name={data.raffle.projectName} />
    </div >
  )
}

export default OpportunityCard

