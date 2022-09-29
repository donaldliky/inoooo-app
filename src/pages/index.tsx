import { useState, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';

import {
  BrowserRouter as Router,
  Route,
  Routes,
} from 'react-router-dom'
import axios from 'axios';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

// custom components
import Dashboard from './dashboard'
import Raffles from './raffles'
import Whitelist from './whitelist'
import Calendar from './calendar'
import Header from './header'
import BurgerMenu from './burger_menu'
import Project from './project'
import Loading from '../components/loading'
import Owned from './project/owned';
import WhitelistOpp from './project/whitelist_opp';
import DaoVote from './project/dao_vote';

// css
import './index.scss'
import './burger.css'

// redux
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setAuthorizeInfo, setMyDiscordServers, setDiscordInfo, selectDiscordInfo } from '../app/slice/dashboardSlice'
import { setWalletAddress, selectLoadingFlag, setLoadingFlag } from '../app/slice/wallletSlice';

// config
import { DISCORD_API_URL, DISCORD_AVATAR_BASEURL, CLIENT_ID, CLIENT_SECRET } from '../config'
require('@solana/wallet-adapter-react-ui/styles.css');

const Login = () => {
  const dispatch = useAppDispatch()
  // get wallet address
  const wallet = useWallet()
  const myAddress = wallet.publicKey?.toString()

  // logo dropdown
  const [dropDisplay, setDropDisplay] = useState('none')

  const [mousePosState, setMousePosState] = useState(false)
  // redux
  const discordInfo = useAppSelector(selectDiscordInfo)
  const loadingFlag = useAppSelector(selectLoadingFlag)

  // params
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const code = params.get('code');

  const onClickLogo = () => {
    setDropDisplay(dropDisplay == 'block' ? 'none' : 'block')
  }
  const onClickLogoItem = () => {
    setDropDisplay('none')
  }

  const handleLogout = () => {
    console.log("logout")
    localStorage.removeItem('authorize')
    localStorage.removeItem('lastAuthTime')
    localStorage.removeItem('discordId')

    dispatch(setAuthorizeInfo({
      access_token: null,
      token_type: null,
      expires_in: null,
      scope: null
    }))

    dispatch(setDiscordInfo({
      id: null,
      username: null,
      avatar: null,
      avatar_decoration: null,
      discriminator: null,
      public_flags: null,
      flags: null,
      banner: null,
      banner_color: null,
      accent_color: null,
      locale: null,
      mfa_enabled: null
    }))

    toast.info("Logged out!", {
      position: toast.POSITION.TOP_CENTER,
      hideProgressBar: true,
      closeOnClick: true,
    });
  };

  const onBlurDrop = (cursorState: boolean) => {
    if (!cursorState) {
      setDropDisplay('none')
    }
  }

  const getAuthFromStorage = () => {
    const authorize = localStorage.getItem('authorize')
    if (authorize === null) {
      return false
    } else {
      return JSON.parse(localStorage.getItem('authorize')!)
    }
  }

  const parseHash = (type: String) => {
    const lochash = window.location.hash.substring(1)
    let value = ''
    switch (type) {
      case 'token_type':
        value = lochash.substring(lochash.search(/(?<=^|&)token_type=/)).split('&')[0].split('=')[1]
        break
      case 'access_token':
        value = lochash.substring(lochash.search(/(?<=^|&)access_token=/)).split('&')[0].split('=')[1]
        break
      case 'expires_in':
        value = lochash.substring(lochash.search(/(?<=^|&)expires_in=/)).split('&')[0].split('=')[1]
        break
      case 'scope':
        value = lochash.substring(lochash.search(/(?<=^|&)scope=/)).split('&')[0].split('=')[1]
        break
    }
    return value
  }

  const setAuthFromStorage = (data: any) => {
    localStorage.setItem('lastAuthTime', Date.now().toString())
    localStorage.setItem('authorize', JSON.stringify(data))
  }

  const getDiscordAccountInfo = async (params: any) => {
    const response = await axios.get(DISCORD_API_URL, {
      headers: {
        'Authorization': `${params.token_type} ${params.access_token}`
      }
    }).then((res: any) => {
      const result = res.data;
      if (result) {
        dispatch(setDiscordInfo(result))
        localStorage.setItem('discordId', result.id)
      }
    }).catch((err: any) => {
      console.log("error : ", err.message);
    })

    return response
  }

  const getMyServers = async (params: any) => {
    await axios.get(`${DISCORD_API_URL}/guilds`, {
      headers: {
        'Authorization': `${params.token_type} ${params.access_token}`
      }
    }).then((res: any) => {
      const result = res.data
      console.log('server: ', result)
      if (result) {
        dispatch(setMyDiscordServers(result))
        localStorage.setItem('servers', result)
      }
    }).catch((err: any) => {
      console.log("error : ", err.message);
    })
  }

  useEffect(() => {
    let authorize: any
    if (!!window.location.hash) {
      authorize = {
        token_type: parseHash('token_type'),
        access_token: parseHash('access_token'),
        expires_in: parseHash('expires_in'),
        scope: parseHash('scope'),
      }
      setAuthFromStorage(authorize)
    } else {
      const currentTime = Date.now()
      const lastTime = parseInt(localStorage.getItem('lastAuthTime') || '0')

      if (currentTime - lastTime > 6048000) {
        localStorage.removeItem('authorize')
      }
      authorize = getAuthFromStorage()
    }

    // authorize = {
    //   access_token: "ne9hfrCzfWS3GmaRpqznpX4VtU720n",
    //   expires_in: "604800",
    //   scope: "identify+guilds",
    //   token_type: "Bearer",
    // }

    // dispatch(setDiscordInfo({
    //   accent_color: 1913814,
    //   avatar: "f81fb33d77f5fae354b713a10a46d",
    //   avatar_decoration: null,
    //   banner: null,
    //   banner_color: "#1d33d6",
    //   discriminator: "8898",
    //   flags: 0,
    //   // id: "934002267340828682",
    //   id: "934002267340828682",
    //   locale: "en-US",
    //   mfa_enabled: false,
    //   public_flags: 0,
    //   username: "Megaman"
    // }))

    if (authorize.access_token !== null && !!authorize) {
      dispatch(setAuthorizeInfo(authorize))
      getDiscordAccountInfo({
        token_type: authorize['token_type'],
        access_token: authorize['access_token']
      })
      getMyServers({
        token_type: authorize['token_type'],
        access_token: authorize['access_token']
      })
      console.log('success discord connecting')
      // toast.success("Discord Authorization Success!", { theme: 'dark' })
    }
    setLoadingFlag(true)
  }, [])

  // set wallet address to store
  useEffect(() => {
    if (myAddress) {
      dispatch(setWalletAddress(myAddress))
    }
  }, [myAddress])

  return (
    <>
      {
        loadingFlag && (
          <Loading />
        )
      }
      <Router>
        <div className='body'>
          <div className='max-container'>
            <div className='header'>
              <div className='header-left' >
                <Link to={'/'}><img src='/assets/img/logo.png' /></Link>
              </div>
              <div className='header-right'>
                <WalletMultiButton />
                {
                  discordInfo.username && (
                    <div className="dropdown-header"
                      onMouseEnter={() => setMousePosState(true)}
                      onMouseLeave={() => setMousePosState(false)}
                      onBlur={() => onBlurDrop(mousePosState)}
                    >
                      <button
                        className="dropbtn-header"
                        onClick={() => onClickLogo()}
                        style={{ height: '100%', border: 'none' }}
                      >
                        <img src={`${DISCORD_AVATAR_BASEURL}/${discordInfo.id}/${discordInfo.avatar}.png`} alt='avatar' />
                        {discordInfo.username + '#' + discordInfo.discriminator}
                        <span>
                          {
                            dropDisplay === 'none' ? <FaCaretDown /> : <FaCaretUp />
                          }
                        </span>
                      </button>
                      <div className="dropdown-content-header"
                        style={{ display: dropDisplay }}
                      >
                        <a href="#" onClick={onClickLogoItem}>Profile</a>
                        <a href="#" onClick={onClickLogoItem}>DAO hub</a>
                        <a href='#' onClick={handleLogout} className='logout'>Logout</a>
                      </div>
                    </div>
                  )
                }

                <div className='burger-menu'>
                  <BurgerMenu />
                </div>
              </div>
            </div>
            <Header />

            <div className='tab-body'>
              <Routes>
                <Route path='/' element={<Dashboard />} />
                <Route path='/raffles' element={<Raffles />} />
                <Route path='/whitelist' element={<Whitelist />} />
                <Route path='/calendar' element={<Calendar />} />
                <Route path='/project' element={<Project />}>
                  <Route path=':projectId' element={<Owned />} />
                  <Route path=':projectId/wlopp' element={<WhitelistOpp />} />
                  <Route path=':projectId/vote' element={<DaoVote />} />
                </Route>
              </Routes>
            </div>
          </div>
        </div>
      </Router >
    </>
  )
}

export default Login
