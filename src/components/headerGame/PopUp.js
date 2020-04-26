import React from 'react'
import './PopUp.css'
import Button from '../other/Button'
import translations from '../translations/translations.js'

const PopUp = (props) => {

    return(
        <div id='popUp'>
            <div id='headerQuestion'>
                <Button id = 'exit'
                        image = 'close'
                        title =  {translations[props.lang]['questionClose']}
                        onClick = {props.exit}
                        overWriteDefaultCss = {{height : '50px', width : '50px', margin : '10px'}}/>
            </div>
            <div id='textQuestion'>{translations[props.lang]['questionText']}</div>
            <div id='imageBlock'>
                <img id='imageQuestion' src={require('../img/popUp.png')} alt='game pic'/>
            </div>
        </div>)
}

export default PopUp
