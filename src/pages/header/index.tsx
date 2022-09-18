import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { setProjects } from '../../app/slice/projectSlice';
import { setDiscordInfo } from '../../app/slice/dashboardSlice';
import { useAppDispatch } from '../../app/hooks';
import './index.scss'

const Header = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation();
  const [path, setPath] = useState(location.pathname)

  useEffect(() => {
    setPath(location.pathname)
  }, [location]);


  return (
    <div className='tab-header'>
      <div className={(path === '/' || path.indexOf('project') >= 0) ? 'tab-title-item-selected' : 'tab-title-item'} onClick={() => {
        // dispatch(setProjects({}))
        // dispatch(setDiscordInfo({}))
        navigate('/')

      }}>
        DASHBOARD
      </div>
      <div className={path === '/raffles' ? 'tab-title-item-selected' : 'tab-title-item'} onClick={() => navigate('/raffles')}>
        ISOS&nbsp;RAFFLES
      </div>
      <div className={path === '/whitelist' ? 'tab-title-item-selected' : 'tab-title-item'} onClick={() => navigate('/whitelist')}>
        WHITELIST&nbsp;MANAGER
      </div>
      <div className={path === '/calendar' ? 'tab-title-item-selected' : 'tab-title-item'} onClick={() => navigate('/calendar')}>
        CALENDAR
      </div>
    </div>
  )
}

export default Header