import React from 'react'
import "../styles/StatCard.css"

const StatCard = (props) => {
  return (
    <div className="stat-card">
      <h2>{props.number}</h2>
      <p>{props.title}</p>
    </div>
  )
}

export default StatCard