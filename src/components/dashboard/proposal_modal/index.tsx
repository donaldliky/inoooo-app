import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as SolanaWeb3 from '@solana/web3.js'
import {
  getOrCreateAssociatedTokenAccount, TOKEN_PROGRAM_ID, createTransferInstruction, createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAccount
} from '@solana/spl-token';
// This is the library you use to connect a wallet, import the React hook from it
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

import { AiOutlineClose } from 'react-icons/ai'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import './index.scss'

import { BACKEND_URL } from '../../../config';
// redux
import { selectDiscordInfo } from '../../../app/slice/dashboardSlice';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectOneProject } from '../../../app/slice/projectSlice'

import { successToast, errorToast } from '../../../helpers/toast';
import { selectWalletAddress } from '../../../app/slice/wallletSlice';

import { CLUSTER_API } from '../../../config';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
// use the hook to get the pubkey and the signTransaction method:
// const { publicKey: fromPublicKey, signTransaction } = useWallet();

// const connection = new SolanaWeb3.Connection(CLUSTER_API)
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="down" ref={ref} {...props} />;
});

const ProposalModal = (props: any) => {
  const { open, setOpen } = props
  const discordInfo = useAppSelector(selectDiscordInfo)
  const selectedProject = useAppSelector(selectOneProject)
  const myWalletAddress = useAppSelector(selectWalletAddress)
  const [projectData, setProjectData] = useState({} as any)

  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const initInputs = {
    agenda: '',
    option0: '',
    option1: '',
    option2: '',
    option3: '',
    submittedUser: discordInfo.username + '#' + discordInfo.discriminator,
    hostedProjectId: selectedProject._id
  }
  const [inputs, setInputs] = useState(initInputs);

  const tempError = {
    agenda: false,
    option0: false,
    option1: false
  }

  const [errors, setErrors] = useState(tempError)

  const handleValidation = () => {
    const fields = inputs
    const errors = {}
    let formIsValid = true

    for (const key in fields) {
      if ((key === 'agenda' || key === 'option0' || key === 'option1')
        && (fields[key] === '')) {
        errors[key] = true
        formIsValid = false
      }
    }
    setErrors(errors as any)
    return formIsValid
  }


  const handleChange = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs(values => ({ ...values, [name]: value }))
  }

  const handleSubmit = async (isToken: boolean) => {
    const isValid = handleValidation()
    if (!isValid) {
      return
    }

    const submitData = JSON.stringify(inputs)
    try {
      // if (isToken) {
      const fromAddress = myWalletAddress
      // const toAddress = projectData.walletAddress
      // const tokenAddress = projectData.tokenAddress
      // const fromAddress = '8JvZKrTxrjLNNXxQnLWPUgAMaWUgFNVh6jwcRN5zZnJp'
      const toAddress = 'AtMM5AaWPwCGiyc5m9e4XmGsQEqdjMt7oKhmJLLzibs6'
      const tokenAddress = '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
      // console.log('from: ', fromPublicKey)
      const fromPublicKey = new SolanaWeb3.PublicKey(fromAddress);
      const toPublicKey = new SolanaWeb3.PublicKey(toAddress);
      const tokenPublicKey = new SolanaWeb3.PublicKey(tokenAddress);
      const tokenAccunt = await getAssociatedTokenAddress(
        tokenPublicKey,
        fromPublicKey
      )
      const transaction = new SolanaWeb3.Transaction()
        .add(
          createAssociatedTokenAccountInstruction(
            fromPublicKey,
            tokenAccunt,
            toPublicKey,
            tokenPublicKey
          )
        )
        .add(
          createTransferInstruction( // imported from '@solana/spl-token'
            fromPublicKey,
            toPublicKey,
            fromPublicKey,
            0.01 * Math.pow(10, 6), // tokens have 6 decimals of precision so your amount needs to have the same
            [],
            TOKEN_PROGRAM_ID // imported from '@solana/spl-token'
          )
        );

      // set a recent block hash on the transaction to make it pass smoothly
      const latestBlockHash = await connection.getLatestBlockhash();
      transaction.recentBlockhash = latestBlockHash.blockhash;

      // set who is the fee payer for that transaction
      transaction.feePayer = fromPublicKey;

      const signed = await wallet?.signTransaction(transaction)
      // await connection.confirmTransaction(signed?.signature?.toString() as string);
      if (signed) {
        console.log('signed: ', signed)
        const signature = await connection.sendRawTransaction(signed.serialize());
        console.log('signatrue: ', signature)
        await connection.confirmTransaction(signature);
      }
      // }

      const res = await axios.post(`${BACKEND_URL}/api/daoVoting/addEventByUser`, {
        data: submitData
      })
      if (res.data.success) {
        setErrors(tempError)
        setInputs(initInputs)
        setOpen(false)
        successToast('You submitted your proposal successfully')
      }
    } catch (error) {
      console.log(error)
      errorToast('You failed.')
    }
  }

  const handleClose = () => {
    setErrors(tempError)
    setInputs(initInputs)
    setOpen(false);
  };

  useEffect(() => {
    (
      async () => {
        try {
          const res = await axios.get(`${BACKEND_URL}/api/project/getOneData?id=${selectedProject._id}`)
          if (res.data.success) {
            setProjectData(res.data.data)
          }
        } catch (error) {
          console.log(error)
        }
      }
    )()
  }, [])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <div className='proposal-centered'>
        {/* <form onSubmit={handleSubmit}> */}
        <div className='top'>
          Submit Proposal
          <AiOutlineClose className='cross' onClick={handleClose} />
        </div>
        <div className='desc'>
          Please be aware that submitting a proposal requires 50 $HUNT. Your proposal will be available for voting once approved by the team.
        </div>
        <div className='subject'>
          <div className='subject-title'>
            What is your proposal?
          </div>
          <textarea
            placeholder='Tell us about your proposal or suggestion'
            name="agenda"
            onChange={handleChange}
            value={inputs.agenda || ""}
          ></textarea>
          {
            errors?.agenda && <p className='error-text'>Type your proposal.</p>
          }
        </div>
        <div className='item'>
          <div className='item-title'>Item 1:</div>
          <div>
            <input placeholder='Type your option here'
              name="option0"
              value={inputs.option0 || ""}
              onChange={handleChange}
            />
            {
              errors?.option0 && <p className='error-text'>Please fill this field.</p>
            }
          </div>
        </div>
        <div className='item'>
          <div className='item-title'>Item 2:</div>
          <div>
            <input placeholder='Type your option here'
              name="option1"
              value={inputs.option1 || ""}
              onChange={handleChange}
            />
            {
              errors?.option1 && <p className='error-text'>Please fill this field.</p>
            }
          </div>
        </div>
        <div className='item'>
          <div className='item-title'>Item 3:<br />(Optional)</div>
          <div>
            <input placeholder='Type your option here'
              name="option2"
              value={inputs.option2 || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='item'>
          <div className='item-title'>Item 4:<br />(Optional)</div>
          <div>
            <input placeholder='Type your option here'
              name="option3"
              value={inputs.option3 || ""}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className='submit-btn'>
          {
            projectData.walletAddress ? <button onClick={() => handleSubmit(true)}>Submit Proposal for $50 HUNT</button>
              : <button onClick={() => handleSubmit(false)}>Submit Proposal</button>
          }

        </div>
        {/* </form> */}
      </div>
    </Dialog>
  )
}

export default ProposalModal