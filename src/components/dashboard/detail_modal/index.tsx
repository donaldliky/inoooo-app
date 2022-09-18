import * as React from 'react';

import { AiOutlineClose } from 'react-icons/ai'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import './index.scss'

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const DetailModal = (props: any) => {
  const { open, setOpen, detail, name } = props

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <div className='detail-centered'>
          <div className="top">Detail Information about {name}
            <AiOutlineClose className='cross' onClick={handleClose} />
          </div>
          <div className="desc"> {detail} </div>
        </div>
      </Dialog>
    </>
  )
}

export default DetailModal