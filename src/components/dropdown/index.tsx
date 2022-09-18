import * as React from 'react';
import { useState } from 'react';
import { FaCaretDown, FaCaretUp } from 'react-icons/fa';

import './index.scss'

const DropDown = (props: any) => {
  const { caption, setCaption, dropList, width } = props
  const [mousePosState, setMousePosState] = useState(false)
  const [listDisplayFlag, setListDisplayFlag] = useState('none')

  const onClickDropBtn = () => {
    setListDisplayFlag(listDisplayFlag === 'block' ? 'none' : 'block')
  }

  const onClickList = (selectedList: string) => {
    setCaption(selectedList)
    setListDisplayFlag('none')
  }

  const onBlurDrop = (cursorState: boolean) => {
    if (!cursorState) {
      setListDisplayFlag('none')
    }
  }

  return (
    <div
      className="dropdown"
      onMouseEnter={() => setMousePosState(true)}
      onMouseLeave={() => setMousePosState(false)}
      onBlur={() => onBlurDrop(mousePosState)}
    >
      <button
        className="dropbtn"
        onClick={onClickDropBtn}
        style={{ width: width ? width + 'px' : '' }}
      >
        {caption}
        <span>
          {
            listDisplayFlag === 'none' ? <FaCaretDown /> : <FaCaretUp />
          }
        </span>
      </button>
      <div className="dropdown-content" style={{ display: listDisplayFlag }}>
        {
          dropList.map((item: any, index: number) => {
            return <a href="#" key={index} onClick={() => onClickList(item.value)}>{item.value}</a>
          })
        }
      </div>
    </div>
  )
}

export default DropDown