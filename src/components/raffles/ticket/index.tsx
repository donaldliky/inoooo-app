import * as React from 'react';
import { useState, useEffect } from 'react';
import './index.scss'

import { AiOutlineClose } from 'react-icons/ai'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const TicketModal = (props: any) => {
  const { ticketModalShow, setTicketModalShow } = props

  const handleClose = () => {
    setTicketModalShow(false)
  }
  return (
    <Dialog
      open={ticketModalShow}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className='ticket-body'>
        <div className="centered">
          <div className="top">BUY TICKETS
            <AiOutlineClose className='cross' onClick={handleClose} />
          </div>
          <div className="center">
            <div className="price">1 NFT Ticket = 10 $HUNT</div>
            <div className="instructions">INSTRUCTIONS</div>
            <div className="desc">
              Type in the amount of NFT Tickets you would like to purchase using $HUNT.<br />
              Click on the “Buy Tickets” button.<br />
              Approve the transaction from your connected wallet.
            </div>
          </div>
          <div className="bottom">
            <div className="bottom-left">
              <input />&nbsp;=&nbsp;100&nbsp;$HUNT
            </div>
            <div className="bottom-right">
              <button>BUY&nbsp;TICKETS</button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default TicketModal