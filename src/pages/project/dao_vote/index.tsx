import * as React from 'react';
import { useState, useEffect } from 'react';

// module
import axios from 'axios';
import { Connection, PublicKey } from '@solana/web3.js'
import { useWalletNfts } from "@nfteyez/sol-rayz-react";

// custom components
import Agenda from '../../../components/dashboard/agenda';
import ProposalModal from '../../../components/dashboard/proposal_modal';
import { errorToast } from '../../../helpers/toast';
import './index.scss'

// redux
import { useAppSelector, useAppDispatch } from '../../../app/hooks';
import { selectOwnedNfts, selectOneProject } from '../../../app/slice/projectSlice';
import { setLoadingFlag } from '../../../app/slice/wallletSlice';

// const variable
import { BACKEND_URL, CLUSTER_API } from '../../../config';

const connection = new Connection(CLUSTER_API, 'confirmed')

const DaoVote = (props: any) => {
  // redux
  const dispatch = useAppDispatch()
  const data = useAppSelector(selectOwnedNfts)
  const currentProject = useAppSelector(selectOneProject)

  const [proposalModalShow, setProposalModalShow] = useState(false)
  const [daoVoting, setDaoVoting] = useState([])
  const nftNum = data.length

  useEffect(() => {
    (
      async () => {
        try {
          dispatch(setLoadingFlag(true))
          console.log('fetching vot...')
          const res = await axios.get(`${BACKEND_URL}/api/daoVoting/getDataByProjectId?projectId=${currentProject._id}`)
          if (res.data.success) {
            console.log('fetched voting: ', res.data.data)
            setDaoVoting(res.data.data)
          }
        } catch (error) {
          console.log(error)
          errorToast("Failed to fetch the data")
        }
        dispatch(setLoadingFlag(false))
      }
    )()
  }, [currentProject._id])

  return (
    <>
      {
        <div className='dao-vote-body'>
          <div className='top'>
            <div className='left'>
              Dao Vote
            </div>
            <div className='right'>
              <button onClick={() => setProposalModalShow(true)}>SUBMIT PROPOSAL</button>
            </div>
          </div>
          <div className='active-ended'>
            <div className="active">
              <div className='active-title'>
                ACTIVE
              </div>
              {
                daoVoting.filter((voting: any) => !voting.isEnded)
                  .map((voting, index) => {
                    return <Agenda key={index} type={0} data={voting} nftNum={nftNum} />
                  })
              }
            </div>
            <div className="active">
              <div className="active-title">
                ENDED
              </div>

              {
                daoVoting.filter((voting: any) => voting.isEnded)
                  .map((voting, index) => {
                    return <Agenda key={index} type={1} data={voting} nftNum={nftNum} />
                  })
              }
            </div>
          </div>
          <ProposalModal
            open={proposalModalShow}
            setOpen={setProposalModalShow}
            currentProjectId={currentProject._id}
          />
        </div>
      }
    </>
  )
}

export default DaoVote