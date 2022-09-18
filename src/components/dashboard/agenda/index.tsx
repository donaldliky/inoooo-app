import * as React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import './index.scss'

//redux
import { useAppSelector } from '../../../app/hooks';
import { selectDiscordInfo } from '../../../app/slice/dashboardSlice';
import { selectOneProject } from '../../../app/slice/projectSlice'
import { selectWalletAddress } from '../../../app/slice/wallletSlice';

import { warnToast } from '../../../helpers/toast';
import { BACKEND_URL } from '../../../config';

// type 0: active  1: inactive
const Agenda = (props: any) => {
  const { type, data, nftNum } = props

  // redux
  const discordInfo = useAppSelector(selectDiscordInfo)
  const selectedProject = useAppSelector(selectOneProject)
  const myAddress = useAppSelector(selectWalletAddress)

  const discordId = discordInfo.id

  const [value, setValue] = React.useState(data.options[0].option);
  const [leftVote, setLeftVote] = useState(0)
  const [disableBtnFlag, setDisableBtnFlag] = useState(false)
  const [voteNumber, setVoteNumber] = useState('1')

  // type = 1
  const getMaxVoteNumber = (values: string[]) => {
    if (type === 1) {
      let maxNumber = 0
      values.map((option: any, index: number) => {
        if (option.voteNumber.length > data.options[maxNumber].voteNumber.length) {
          maxNumber = index
        }
      })
      return maxNumber
    }
  }

  const maxVotesOption = getMaxVoteNumber(data.options)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const onVote = async () => {
    if (!(parseInt(voteNumber) > 0 && parseInt(voteNumber) <= leftVote)) {
      warnToast("Please type voting number correctly.")
      return
    }
    const id = toast.loading("Voting in progress...")

    let number = 0
    const tempOptions = [...data.options]
    tempOptions.map((item: any, index: number) => {
      if (item.option === value) {
        number = index
      }
    })

    const temp = data

    setDisableBtnFlag(true)
    // const res = await axios.post(`${BACKEND_URL}/api/daoVoting/vote`, {
    //   data: JSON.stringify(temp), discordId: discordId,
    //   walletAddress: myAddress, creators: selectedProject.creatorAddress, optionIndex: number
    // })
    const res = await axios.post(`${BACKEND_URL}/api/daoVoting/vote`, {
      projectId: temp._id, discordId: discordId,
      walletAddress: myAddress, creators: selectedProject.creatorAddress, optionIndex: number,
      voteNumber: parseInt(voteNumber)
    })

    if (res.data.success) {
      toast.update(id, { render: "You voted successfully", type: "success", isLoading: false, autoClose: 5000, closeOnClick: true, });
      setLeftVote((leftVote - parseInt(voteNumber)) >= 0 ? (leftVote - parseInt(voteNumber)) : 0)
      for (let i = 0; i < parseInt(voteNumber); i++) {
        temp.options[number].voteNumber.push(discordId)
      }
    } else {
      toast.update(id, { render: "You failed", type: "error", isLoading: false, autoClose: 5000, closeOnClick: true, });
    }
    setDisableBtnFlag(false)
  }

  const getPercentage = (index: number) => {
    let totalVotes = 0
    data.options.map((option: any) => {
      totalVotes += option.voteNumber.length
    })
    return Math.round((data.options[index].voteNumber.length / totalVotes) * 100)
  }

  // calculate left number
  useEffect(() => {
    let total = 0
    data.options.map((option: any) => {
      let temp = option.voteNumber.filter((id: any) => id === discordId).length
      total += temp
    })

    setLeftVote((nftNum - total) >= 0 ? (nftNum - total) : 0)
  }, [nftNum])

  return (
    <div>
      {
        (data !== undefined) && (
          <div className='agenda-body'>
            <div className="agenda">
              Agenda: {data.agenda}
            </div>
            <div className="suggested">
              Suggested by: {data.submittedUser}
            </div>
            {
              type === 0 ? ( // active
                <>
                  <div className="select">
                    <RadioGroup
                      aria-labelledby="demo-controlled-radio-buttons-group"
                      name="controlled-radio-buttons-group"
                      value={value}
                      onChange={handleChange}
                      sx={{ color: 'black', 'span': { color: '#5F4314', fontFamily: 'Inter' } }}
                    >
                      {
                        data.options.map((item: any, index: number) => {
                          return (
                            <div key={index}>
                              <FormControlLabel key={index} value={item.option} control={<Radio />} label={item.option} className='select-left' />
                              <span className='select-right'>
                                {
                                  item.voteNumber.filter((id: any) => id === discordId).length > 0
                                  && `Your votes: ${item.voteNumber.filter((id: any) => id === discordId).length}`
                                }
                              </span>
                            </div>
                          )
                        })
                      }
                    </RadioGroup>
                  </div>
                  <div className='bottom'>
                    {
                      leftVote > 0 && <input type='text' value={voteNumber} onChange={(e) => setVoteNumber(e.target.value)} />
                    }
                    <button
                      disabled={(leftVote === 0 ? true : false) || disableBtnFlag} onClick={onVote}
                      style={{ background: leftVote === 0 ? '#AF8D52' : '', color: leftVote === 0 ? 'FFEAC7' : '' }}
                    >
                      VOTE&nbsp;({leftVote}&nbsp;left)
                    </button>
                  </div>
                </>
              ) : ( // ended
                <>
                  {
                    data.options.map((item: any, index: number) => {
                      return (
                        <div key={index} className={`vote ${index === maxVotesOption && 'max'}`}>
                          <div className="vote-left">
                            {item.option} &nbsp;
                            <span>
                              {
                                item.voteNumber.filter((id: any) => id === discordId).length > 0
                                && `Your votes: ${item.voteNumber.filter((id: any) => id === discordId).length}`
                              }
                            </span>
                          </div>
                          <div
                            className="vote-right"
                            style={{ fontWeight: index === maxVotesOption ? '700' : '' }}
                          >{item.voteNumber.length > 0 ? item.voteNumber.length : 0} Votes ({item.voteNumber.length === 0 ? '0' : getPercentage(index)}%)</div>
                        </div>
                      )
                    })
                  }
                </>
              )
            }
          </div>
        )
      }
    </div>


  )
}

export default Agenda