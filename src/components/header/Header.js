import React from 'react'
import './Header.css'
import Button from '../other/Button'

const Header = () => {
    return(
        <div id='header'>
            <Button id = 'question' image = 'question' title = 'Question'/>
            <Button id = 'langage' image = 'us' title = 'Change langage'/>
        </div>

    )
}

export default Header
