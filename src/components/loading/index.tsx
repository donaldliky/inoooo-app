import React from "react";
import ReactLoading from "react-loading";
import './index.scss'

const Loading = () => {
  return (
    <div className="loading-body">
      <ReactLoading type={'spinningBubbles'} color="#FFFFFF" />
    </div>
  )
}

export default Loading