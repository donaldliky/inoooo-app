import * as React from 'react';
import { useState } from 'react'
import './index.scss'

import { AiOutlineClose } from 'react-icons/ai'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import { BACKEND_URL } from '../../../config';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ClaimModal = (props: any) => {
  const { open, setOpen, claimRole, data } = props
  const [isObtained, setIsObtained] = useState(false)

  const handleClose = () => {
    setOpen(false);
  };

  const onCliamRole = async () => {
    await claimRole()

    setIsObtained(true)
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <div className='claim-centered'>
        <div className="top">Secure whitelist
          <AiOutlineClose className='cross' onClick={handleClose} />
        </div>
        <div className='center'>
          <div className="center-left">
            <img src={`${BACKEND_URL + data.image}`} alt='ape' />
          </div>
          <div className="center-right">
            <div className="project-name">
              Project: {data.projectName}
            </div>
            <div className="datas">Suppy: {data.supply}</div>
            <div className="datas">Mint Price: {data.mintPrice} SOL</div>
            <div className="datas">Mint Date: {new Date(data.mintDate).toDateString()}</div>
            <div className="datas">Whitelist: Active</div>
          </div>
        </div>
        <hr />
        <div className="claim-bottom">
          <div className="bottom-left">
            {data.role}
          </div>
          <div className="bottom-right">
            <div className="bottom-right-left-btn">
              <button disabled>ELIGIBLE</button>
            </div>
            <div className="bottom-right-right-btn">
              <button disabled={isObtained} onClick={onCliamRole}
                style={{ background: isObtained ? '#4DA438' : '' }}
              >
                {isObtained ? 'ROLE OBTAINED' : 'CLAIM ROLE'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  )
}

export default ClaimModal