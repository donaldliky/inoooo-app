import * as React from 'react';

import { AiOutlineClose } from 'react-icons/ai'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { shortDisplay } from '../../../helpers/custom';
import './index.scss'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const WinnerModal = (props: any) => {
  const { open, setOpen, data } = props
  const handleClose = () => {
    setOpen(false);
  };

  const getWinner = (discordId: string) => {
    if (data.isEnded) {
      const temp = { discordName: '', walletAddress: '' }
      if (data.rafflers) {
        data.rafflers.map((raffler: any) => {
          if (raffler.discordId === discordId) {
            temp.discordName = raffler.discordName
            temp.walletAddress = raffler.walletAddress
          }
        })
      }
      return temp
    }
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className='centered'>
          <div className="top">{'Winners of ' + data.raffleName}
            <AiOutlineClose className='cross' onClick={handleClose} />
          </div>
          {
            data && data.winners.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Discord Name</th>
                    <th>Wallet Address</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    data.winners.map((discordId: string, index: number) => {
                      let temp = getWinner(discordId)
                      return (
                        <tr key={index}>
                          <td>{temp?.discordName}</td>
                          <td>{shortDisplay(temp?.walletAddress as string)}</td>
                        </tr>
                      )
                    })
                  }
                </tbody>
              </table>
            ) : (
              <div>No winners</div>
            )
          }
        </div>
      </Dialog>
    </>
  )
}

export default WinnerModal