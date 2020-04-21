import React from 'react'
import './Score.css'
import translations from '../translations/translations.js'

const Score = (props) => {
    return(
        <div id='score'>
            {translations[props.lang]["bestScore"]}{props.score("get")}
        </div>
    )
}


export default Score
