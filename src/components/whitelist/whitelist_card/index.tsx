import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';

import { FaDiscord, FaTwitter, FaLink } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { errorToast } from '../../../helpers/toast';
import './index.scss'

import { BACKEND_URL } from '../../../config';
import { selectAuthorizeInfo, selectDiscordInfo } from '../../../app/slice/dashboardSlice';

const WhitelistCard = (props: any) => {
  const { _id, subscribeStatus, name, description, mintDate, mintPrice, totalSupply, image, discord, website, twitter, walletSubmission, whitelistActive, serverId } = props.data
  // const whitelistStatus = props.whitelistStatus
  const authorizeInfo = useAppSelector(selectAuthorizeInfo)
  const discordInfo = useAppSelector(selectDiscordInfo)
  const discordId = discordInfo.id
  const [wlStatus, setWlStatus] = useState(whitelistActive)

  const d = new Date(mintDate)

  const claimRole = async () => {
    // try {
    //   const result = await axios.post(`${BACKEND_URL}/api/project/claimRole`, {
    //     discordId: discordId,
    //     projectId: _id
    //   })

    //   if (result.data.success) {
    //     setWlStatus(result.data.data)
    //   } else {
    //     errorToast('You failed to get the role')
    //   }
    // } catch (error) {
    //   console.log(error)
    // }
  }

  // useEffect(() => {
  //   (
  //     async () => {
  //       if (authorizeInfo.token_type && authorizeInfo.access_token) {
  //         let temp: boolean = false
  //         try {
  //           const response = await axios.get(`https://discord.com/api/users/@me/guilds/${serverId}/member`, {
  //             headers: {
  //               'Authorization': `${authorizeInfo.token_type} ${authorizeInfo.access_token}`
  //             }
  //           })

  //           if (response.data) {
  //             console.log('user data: ', response.data)
  //             console.log('database: ', whitelistRoleIDs)
  //             for (let i = 0; i < response.data.roles.length; i++) {
  //               const whitelistRole = whitelistRoleIDs.filter((role: string) => role === response.data.roles[i])
  //               if (whitelistRole.length === 1) {
  //                 temp = true
  //               }
  //             }
  //           }
  //         } catch (error) {
  //           temp = false
  //         }
  //         setWlStatus(temp)
  //       }
  //     }
  //   )()
  // }, [authorizeInfo.token_type, authorizeInfo.access_token])

  // useEffect(() => {
  //   (
  //     async () => {
  //       if (serverId) {
  //         const response = await axios.get(`https://discord.com/api/users/@me/guilds/${serverId}/member`, {
  //           headers: {
  //             'Content-Type': 'application-x-www-form-urlencoded'
  //           },
  //           data: {
  //             'client_id': '',
  //             'client_secret': '',
  //             'grant_type': 'authorization_code',
  //             'code': '',
  //             'redirect_url': ''
  //           }
  //         })
  //         console.log('result: ', response.data)
  //       }
  //     }
  //   )()
  // }, [serverId])

  return (
    <div className='whitelist-card-body'>
      {
        subscribeStatus === 1 && (
          <div className='star'>
            <img src='/assets/img/star.png' alt='star' />
          </div>
        )
      }
      <div className='body-left'>
        <div className='name'>
          {name}
        </div>
        <div className='desc'>
          {description}
        </div>
        <div className='data'>
          <table>
            <tbody>
              <tr>
                <td>Mint Price</td>
                <td className='tr-right'>
                  {mintPrice ? mintPrice + ' SOL' : 'TBA'}
                </td>
              </tr>
              <tr>
                <td>Mint Supply</td>
                <td className='tr-right'>
                  {totalSupply ? totalSupply : 'TBA'}
                </td>
              </tr>
              <tr>
                <td>Mint Date</td>
                <td className='tr-right'>
                  {mintDate ? d.getMonth() + 1 + '/' + d.getDate() + '/' + d.getFullYear() : 'TBA'}
                </td>
              </tr>
              <tr></tr>
              <tr>
                <td>Status</td>
                <td className='tr-right'>
                  {subscribeStatus ? wlStatus ? 'Whitelisted' : 'Not Whitelisted' : 'Unknown'}
                </td>
              </tr>
              <tr>
                <td>Wallet&nbsp;Submission</td>
                <td className='tr-right'>
                  {subscribeStatus ? walletSubmission ? 'Active' : 'Inactive' : 'Unknown'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='links'>
          <a href={twitter}><div><FaTwitter /></div></a>
          <a href={discord}><div><FaDiscord /></div></a>
          <a href={website}><div><FaLink /></div></a>
        </div>
      </div>
      <div className='body-right'>
        <img src={`${BACKEND_URL + image}`} alt={`${image}`} />
        <button
          className={
            wlStatus ? 'status-whitelisted' : 'status-not-whitelisted'
          }
          disabled={subscribeStatus ? false : true}
          style={{ background: !subscribeStatus ? 'rgba(194, 130, 20, 0.5)' : '' }}
          onClick={claimRole}
        >
          {subscribeStatus && wlStatus ? 'Whitelisted' : 'Secure whitelist'}
        </button>
      </div>
    </div>
  )
}

export default WhitelistCard