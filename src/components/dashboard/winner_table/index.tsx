import * as React from 'react';

import { AiOutlineClose } from 'react-icons/ai'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';
import './index.scss'

// redux
import { useAppSelector } from '../../../app/hooks';
import { selectDiscordInfo } from '../../../app/slice/dashboardSlice';

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const WinnerTable = (props: any) => {
  const { open, setOpen, data, hostedProjectName } = props
  const discordInfo = useAppSelector(selectDiscordInfo)
  const discordName = discordInfo.username + '#' + discordInfo.discriminator

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
        <div className='centered'>
          <div className="top">{data.raffle.projectName}
            <AiOutlineClose className='cross' onClick={handleClose} />
          </div>
          <div className="desc">Whitlist Raffle Winners</div>
          <div className="desc">Hosted by: {hostedProjectName}</div>
          <div className='id-title'>
            Discord ID
          </div>
          <div className='id-names'>
            {
              props.winnerNames && props.winnerNames.map((item: any, index: number) => {
                return <div className='id-name'
                  style={{
                    background: (index % 2 === 0) ? '' : '#EFEFEF',
                    color: (discordName === item) ? '#000000' : ''
                  }}
                  key={index}
                >
                  {item}

                </div>
              })
            }
            {
              data.raffle.winners.length === 0 && (
                <div className="id-name">
                  No one winner
                </div>
              )
            }
          </div>
        </div>
      </Dialog>
    </>
  )
}

export default WinnerTable