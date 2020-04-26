//creating clickable buttons
import React from 'react'
import "./Button.css"

// since reactjs require function sucks, we can't pass arguments. So bruteforce approach

const pathImages = {
    "fr" : require('../img/Fr_flag.jpg'),
    "us" : require('../img/US_flag.jpg'),
    "play" : require('../img/play.png'),
    "question" : require('../img/question.png'),
    "restart" : require('../img/restart.png'),
    "homepage" : require('../img/homepage.png'),
    "close" : require('../img/close.png'),
}

const Button = ({id, image, alt, title = '', overWriteDefaultCss = {}, onClick = ()=>{} }) => {
    /* creating buttons
    id : name of the button, used by the css stylesheet to apply some transformation
    pathImage : path to the image to include into the button
    alt : alternative text if image not displayed
    title : text to display when hovering on the button
    overWriteDefaultCss : put css properties if theere is a need to overwrite the default properties defined here
    onclick : function to apply when clicking on the button
    */
    return(
        <div className = 'imageContainer'>
            <img id={id} src={pathImages[image]} className="button" alt={alt} title={title} onClick = {onClick} style = {{...overWriteDefaultCss}}/>
        </div>)
}

export default Button
