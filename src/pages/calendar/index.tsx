import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

import { useWallet } from '@solana/wallet-adapter-react';
// custom components
import DropDown from '../../components/dropdown';
import SearchInput from '../../components/search_input';
import DateProjectItem from "../../components/calendar/project_item";

// full calendar
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import "@fullcalendar/daygrid/main.css";
import "@fullcalendar/timegrid/main.css";
import './index.scss'

// redux
import { setLoadingFlag } from "../../app/slice/wallletSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { selectAuthorizeInfo, selectDiscordInfo } from "../../app/slice/dashboardSlice";

import { BACKEND_URL, DISCORD_REDIRECT_URL } from "../../config";

const calendarsColor = {
  true: 'success',
  false: 'danger',
}

const Calendar = () => {
  const dispatch = useAppDispatch()
  let tempDiscordId = localStorage.getItem('discordId')
  const [dateItems, setDateItems] = useState([])
  const [data, setData] = useState([])
  const calendarRef = useRef(null)
  const discordInfo = useAppSelector(selectDiscordInfo)
  const authorizeInfo = useAppSelector(selectAuthorizeInfo)
  const discordId = discordInfo.id || tempDiscordId

  const blankEvent = {
    title: '',
    start: '',
    end: '',
    allDay: false,
    url: '',
    extendedProps: {
      whitelistStatus: '',
      guests: [],
      location: '',
      description: ''
    }
  }

  const calendarOptions = {
    events: data,
    plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
    initialView: 'dayGridMonth',
    editable: true,
    eventResizableFromStart: true,
    dragScroll: true,
    dayMaxEvents: 2,
    navLinks: false,
    // eventColor: '#FF0000',

    eventClassNames({ event: calendarEvent }) {
      const colorName = calendarsColor['true']

      return [
        // Background Color
        `bg-light-${colorName}`
      ]
    },

    eventClick(info: any) {
      info.jsEvent.preventDefault();

      if (info.event.url) {
        window.open(info.event.url);
      }
    },

    dateClick(info: any) {
      const ev = blankEvent
      ev.start = info.date
      ev.end = info.date
      getDateItems(info.date)
    },

    ref: calendarRef,
  }

  const getDateItems = async (date: string) => {

    const d = new Date(date)
    console.log('selected date: ', d.toISOString())
    const res = await axios.get(`${BACKEND_URL}/api/project/getDateItems?discordId=${discordId}&selectedDate=${d.toISOString()}&tokenType=${authorizeInfo.token_type}&accessToken=${authorizeInfo.access_token}`)
    if (res.data.success) {
      console.log('selected items: ', res.data.data)
      setDateItems(res.data.data)
    }
  }

  const onClickDiscordConnect = () => {
    window.location.href = DISCORD_REDIRECT_URL
  }

  useEffect(() => {
    (
      async () => {
        if (discordId) {
          dispatch(setLoadingFlag(true))
          try {
            const result = await axios.get(`${BACKEND_URL}/api/project/getCalendarData?discordId=${discordId}&tokenType=${authorizeInfo.token_type}&accessToken=${authorizeInfo.access_token}`)
            if (result.data.success) {
              setData(result.data.data)
            }
          } catch (error) {
            console.log(error)
            throw error
          }
          dispatch(setLoadingFlag(false))
        }
      }
    )()
  }, [discordId])

  return (
    <div className='dash-body'>
      <div className='tab-content'>
        {
          discordId ?
            <div className='connect-body'>
              <div className="calendar-com">
                {
                  data && (
                    <FullCalendar
                      {...calendarOptions}
                      displayEventTime={false}
                    />
                  )
                }
              </div>

              {
                dateItems.length > 0 && (
                  <div className="items-body">
                    {
                      dateItems.map((item: any, index: number) => {
                        return <DateProjectItem
                          key={index}
                          name={item.name}
                          image={item.image}
                          mintPrice={item.mintPrice}
                          totalSupply={item.totalSupply}
                          twitter={item.twitter}
                          mintDate={item.mintDate}
                          discord={item.discord}
                          whitelistStatus={item.whitelistStatus}
                        />
                      })
                    }
                  </div>
                )
              }
            </div>
            :
            <div className='disconnect-body'>
              <div className='message'>
                Connect your discord to gain access to the dashboard
              </div>
              <div className='connect-btn'>
                <button onClick={onClickDiscordConnect}>CONNECT DISCORD</button>
              </div>
            </div>
        }
      </div>
    </div>
  )
}

export default Calendar