import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import * as SolanaWeb3 from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  createTransferInstruction,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
// This is the library you use to connect a wallet, import the React hook from it
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { useAnchorWallet } from '@solana/wallet-adapter-react';
// mui
import { AiOutlineClose } from 'react-icons/ai'
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import './index.scss'
// redux
import { selectDiscordInfo } from '../../../app/slice/dashboardSlice';
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectOneProject } from '../../../app/slice/projectSlice'

import { successToast, errorToast } from '../../../helpers/toast';
import { selectWalletAddress } from '../../../app/slice/wallletSlice';

import { BACKEND_URL } from '../../../config';

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
  const [projectData, setProjectData] = useState({} as any)

  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const { publicKey, signTransaction, sendTransaction } = useWallet()

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
      if (!publicKey || !signTransaction) throw new WalletNotConnectedError()

      if (selectedProject.tokenAddress && isToken) {
        const toAddress: string = selectedProject.receiverAddress
        const tokenAddress: string = selectedProject.tokenAddress
        const tokenAmount: number = selectedProject.tokenAmount

        const toPublicKey = new SolanaWeb3.PublicKey(toAddress);
        const tokenPublicKey = new SolanaWeb3.PublicKey(tokenAddress);

        const fromTokenAccount = await getAssociatedTokenAddress(
          tokenPublicKey,
          publicKey
        )
        const toTokenAccount = await getAssociatedTokenAddress(
          tokenPublicKey,
          toPublicKey,
          true
        )

        const ataTokenToInfo = await connection.getAccountInfo(toTokenAccount);

        let transaction = new SolanaWeb3.Transaction()
        if (!ataTokenToInfo) {
          console.log('added create token account')
          transaction.add(
            createAssociatedTokenAccountInstruction(
              wallet!.publicKey!,
              toTokenAccount,
              toPublicKey,
              tokenPublicKey
            )
          )
        }
        transaction.add(
          createTransferInstruction( // imported from '@solana/spl-token'
            fromTokenAccount,
            toTokenAccount,
            publicKey,
            tokenAmount * Math.pow(10, 9), // tokens have 6 decimals of precision so your amount needs to have the same
            [],
            TOKEN_PROGRAM_ID // imported from '@solana/spl-token'
          )
        )

        const latestBlockHash = await connection.getLatestBlockhash();
        transaction.recentBlockhash = latestBlockHash.blockhash;
        transaction.feePayer = publicKey;
        const signed = await wallet?.signTransaction(transaction)

        if (signed) {
          const signature = await connection.sendRawTransaction(signed.serialize());
          console.log('signatrue: ', signature)
          await connection.confirmTransaction(signature)
        }
      }

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
        <div className='top'>
          Submit Proposal
          <AiOutlineClose className='cross' onClick={handleClose} />
        </div>
        <div className='desc'>
          {selectedProject.tokenAddress &&
            <div>
              Please be aware that submitting a proposal requires <b>{selectedProject.tokenAmount} {selectedProject.tokenSymbol}</b>.
            </div>
          }
          Your proposal will be available for voting once approved by the team.
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
            projectData.tokenAddress ? <button onClick={() => handleSubmit(true)}>Submit Proposal for&nbsp;{selectedProject.tokenAmount}&nbsp;{selectedProject.tokenSymbol}</button>
              : <button onClick={() => handleSubmit(false)}>Submit Proposal</button>
          }
        </div>
      </div>
    </Dialog>
  )
}

export default ProposalModal