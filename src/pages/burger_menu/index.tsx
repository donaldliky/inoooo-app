import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'
import { slide as Menu } from 'react-burger-menu'
// import './index.css'

const BurgerMenu = (props: any) => {
  const navigate = useNavigate()
  const onClickMenu = (path: string) => {
    navigate(path)
  }
  return (
    <Menu right>
      <div onClick={() => onClickMenu('/')}>Dashboard</div>
      <div onClick={() => onClickMenu('/raffles')}>Raffles</div>
      <div onClick={() => onClickMenu('/whitelist')}>Whitelist Manager</div>
      <div onClick={() => onClickMenu('/calendar')}>Calendar</div>
    </Menu>
  )
}

export default BurgerMenu