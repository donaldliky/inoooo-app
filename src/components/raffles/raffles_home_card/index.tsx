import * as React from 'react';
import { FaDiscord, FaTwitter, FaLink } from 'react-icons/fa';
import { FaTicketAlt } from 'react-icons/fa'
import './index.scss'

const RafflesHomeCard = (props: any) => {
  const { img, name, datas, status } = props

  return (
    <div className='raffles-card-body'>
      <div className='left'>
        <img src={`/assets/img/${img}`} alt='right2' />

      </div>
      <div className='right'>
        <div className='nft-name'>{name}</div>
        <div className='links'>
          <FaTwitter />
          <FaDiscord />
          <FaLink />
        </div>
        <div className='datas'>
          <div className='data'>Supply: {datas.supply}</div>
          <div className='data'>Mint Price: {datas.price}</div>
          <div className='data'>Mint Date: {datas.date}</div>
          {
            (status !== 2) ? <div className='data'>Ends in: {datas.endDate}</div>
              : <div className='data'>Whitelist: {'Active'}</div>
          }

        </div>
        <div className='winner top'>
          {/* Winners: {datas.winners} */}
        </div>
        <div className='winner bottom'>
          Entries: {datas.entries}
        </div>
        <div className='bottom-btn'>
          <button className='left-button'><FaTicketAlt />&nbsp;3</button>
          <button className='right-button'>ENTER&nbsp;RAFFLE</button>
        </div>
      </div>
    </div>
  )
}

export default RafflesHomeCard