import * as React from 'react';
import { useState, useEffect } from 'react';

import './index.scss'

import { BACKEND_URL } from '../../../config';
const DateProjectItem = (props: any) => {
  const { name, image, mintPrice, totalSupply, twitter, discord, mintDate, whitelistStatus } = props

  return (
    <div className='date-project-item-body'>
      <div className='top'>
        <div className='top-left'>
          <a href={twitter} target='blank'><img src={BACKEND_URL + image} alt={name} /></a>
          <a href={twitter} target='blank'>{name}</a>
          <div className='whitelist'>{whitelistStatus ? 'Whitelisted' : 'Not Whitelisted'}</div>
        </div>
        <div className='top-right'>
          {/* <a href={`https://calendar.google.com/calendar/u/0/r/eventedit?dates=20220928T070000Z/20220928T080000Z&details=Mint+Price:+1+SOL%0ADiscord:+https://discord.gg/e2vWagFY%0ATwitter:+https://twitter.com/Lush_SafariClub%0A%0A%0APowered+by+%3Ca+href%3D%22https://mercury.blocksmithlabs.io/%22%3EMercury%3C/a%3E&text=Lush+Safari+Club+%F0%9F%A6%81%F0%9F%A6%A7+Mint`} target='blank'> */}
          <a href={`https://calendar.google.com/calendar/u/0/r/eventedit?dates=${mintDate}&details=Mint+Price:+${mintPrice}+SOL%0ADiscord:+${discord}%0ATwitter:+${twitter}%0A%0A%0APowered+by+%3Ca+href%3D%22${'https://isos.inooooworld.io'}%22%3E${'inoooo'}%3C/a%3E&text=${name}+Mint`} target='blank'>
            Add to Google Calendar
          </a>
        </div>
      </div>
      <div>
        Mint Price - {mintPrice} SOL
      </div>
      <div>Supply - {totalSupply}</div>
    </div>
  )
}

export default DateProjectItem