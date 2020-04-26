import React from 'react'
import './Header.css'
import Button from '../other/Button'
import translations from '../translations/translations.js'

const Header = (props) => {
    return(
        <div id='header'>
            <Button id = 'homepage' image = 'homepage' title = {translations[props.lang]['homepage']} onClick = {()=>{window.location.href = 'https://eprevost3.github.io/homepage/'}}/>
            <Button id = 'langage' image = {props.lang} title = {translations[props.lang]['changeLanguage']} onClick = {props.onClick}/>
        </div>

    )
}

export default Header
