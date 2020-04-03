import React from 'react'
import './Score.css'

const Score = (props) => {
    return(
        <div id='score'>
            Best score = {props.score("get")}
        </div>
    )
}


export default Score
