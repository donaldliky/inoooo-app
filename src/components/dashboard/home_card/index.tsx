import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDiscord, FaTwitter, FaLink, FaRegThumbsUp, FaThumbsUp } from 'react-icons/fa';
import { Connection, PublicKey } from '@solana/web3.js'
import { toast } from 'react-toastify';
import axios from 'axios';
import { useWalletNfts } from "@nfteyez/sol-rayz-react";

// redux
import { setOwnedNfts, setOneProject } from '../../../app/slice/projectSlice';
import { selectDiscordInfo } from '../../../app/slice/dashboardSlice';
import { selectWalletAddress } from '../../../app/slice/wallletSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

import { successToast, errorToast, infoToast } from '../../../helpers/toast';
import { BACKEND_URL, CLUSTER_API } from '../../../config';
import './index.scss'

const connection = new Connection(CLUSTER_API, 'confirmed')

const HomeCard = (props: any) => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { _id, name, description, mintDate, mintPrice, totalSupply, image, status, creatorAddress, discord, website, twitter, keyValue, upvote } = props.data

  // redux
  const discordInfo = useAppSelector(selectDiscordInfo)
  const myAddress = useAppSelector(selectWalletAddress)

  const discordId = discordInfo.id
  const [upvoteData, setUpvoteData] = useState(upvote)

  const voteFlag = upvoteData.indexOf(discordId) > -1 ? true : false
  const voteNumber = upvoteData.length
  const [hasNft, setHasNft] = useState(false)
  const d = new Date(mintDate)

  const onClickView = async () => {
    dispatch(setOneProject(props.data))
    localStorage.setItem('lastProject', JSON.stringify(props.data))
    localStorage.setItem('lastTab', '/')
    navigate('/project/' + keyValue)
  }

  const onClickUpvote = async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/api/project/upvote`, { projectId: _id, discordId: discordId })
      if (res.data.success) {
        setUpvoteData(res.data.data)
      }
    } catch (error) {
      console.log(error)
      errorToast("Failed")
    }
  }

  const { nfts } = useWalletNfts({
    publicAddress: myAddress,
    connection,
  });

  useEffect(() => {
    if (nfts.length > 0) {
      let flag = false
      nfts.map((nft: any) => {
        creatorAddress.map((creator: string) => {
          if (nft.data === undefined) return
          if (nft.data.creators === undefined) return

          if (nft.data.creators[0].address === creator) {
            flag = true
          }
        })
      })
      setHasNft(flag)
    }
  }, [nfts.length])

  return (
    <div className='home-card-body'>
      <div className='body-left'>
        <div className='body-left-top'>
          <div className='name'>
            {name}
          </div>
          <div className='desc'>
            {description}
          </div>
        </div>
        <div className='body-left-bottom'>
          <div className='data'>
            <table>
              <tbody>
                <tr>
                  <td>Mint Price</td>
                  <td className='tr-right'>{mintPrice ? mintPrice + ' SOL' : 'TBA'}</td>
                </tr>
                <tr>
                  <td>Mint Supply</td>
                  <td className='tr-right'>{totalSupply ? totalSupply : 'TBA'}</td>
                </tr>
                <tr>
                  <td>Mint Date</td>
                  <td className='tr-right'>{d ? d.getMonth() + '/' + d.getDay() + '/' + d.getFullYear() : 'TBA'}</td>
                </tr>
                <tr>
                  <td>Status</td>
                  <td className='tr-right'>{status === 0 ? 'Upcoming' : 'Minted'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className='links'>
            <a href={twitter} target="_blank"><div><FaTwitter /></div></a>
            <a href={discord} target="_blank"><div><FaDiscord /></div></a>
            <a href={website} target="_blank"><div><FaLink /></div></a>
          </div>
        </div>
      </div>
      <div className='body-right'>
        <img src={`${BACKEND_URL + image}`} alt={`${BACKEND_URL + image}`} />
        <button disabled={!hasNft} onClick={() => onClickView()}
          style={{ background: hasNft ? '' : '#dea442' }}
        >
          VIEW&nbsp;PROJECT
        </button>
        <button onClick={onClickUpvote}
        >
          {voteFlag ? <FaThumbsUp /> : <FaRegThumbsUp />}
          &nbsp;{voteNumber}</button>
      </div>
    </div>
  )
}

export default HomeCard