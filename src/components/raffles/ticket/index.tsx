import * as React from 'react';
import { useState, useEffect } from 'react';
import './index.scss'

import { AiOutlineClose } from 'react-icons/ai'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { warnToast } from '../../../helpers/toast';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const TicketModal = (props: any) => {
  const { ticketModalShow, setTicketModalShow, buyTicket, type } = props
  const [ticketNumber, setTicketNumber] = useState(1)

  const handleClose = () => {
    setTicketNumber(1)
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
          <div className="top">BUY {type === 1 ? 'WHITELIST' : 'NFT'} TICKETS
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
              <input type='text' value={ticketNumber > 0 ? ticketNumber : ''} onChange={(e) => setTicketNumber(Number(e.target.value))} />&nbsp;=&nbsp;{ticketNumber > 0 && ticketNumber * 10}&nbsp;$HUNT
            </div>
            <div className="bottom-right">
              <button onClick={() => buyTicket(type, ticketNumber)}>BUY&nbsp;TICKETS</button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default TicketModal