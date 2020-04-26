import React from 'react'
import './StartPage.css'
import Score from './Score'
import Button from '../other/Button'
import translations from '../translations/translations.js'


const StartPage = (props) => {
    return(
        <div id='startPage' className = "variableComponent">
            <Score score = {props.score} lang = {props.lang}/>
            <Button id = "start" image = "play" title = {translations[props.lang]["play"]}
                                 onClick = {() => {props.func("startGame")}}/>
        </div>

    )
}

export default StartPage
