import React from 'react'
import './StartPage.css'
import Score from './Score'
import Button from '../other/Button'

var f = () => {}

const StartPage = (props) => {
    return(
        <div id='startPage' className = "variableComponent">
            <Score score = {props.score}/>
            <Button id = "start" image = "play" title = "Click to start"
                                 onClick = {() => {props.func("startGame")}}/>
        </div>

    )
}

export default StartPage
