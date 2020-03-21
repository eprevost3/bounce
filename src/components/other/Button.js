//creating clickable buttons
import React from 'react'
import "./Button.css"

// since reactjs require function sucks, we can't pass arguments. So bruteforce approach

const pathImages = {
    "fr" : require('../img/Fr_flag.jpg'),
    "us" : require('../img/US_flag.jpg'),
    "play" : require('../img/play.png'),
    "question" : require('../img/question.png'),
}

const Button = ({id, image, alt, title = '', onClick = ()=>{} }) => {
    /* creating buttons
    id : name of the button, used by the css stylesheet to apply some transformation
    pathImage : path to the image to include into the button
    alt : alternative text if image not displayed
    title : text to display when hovering on the button
    onclick : function to apply when clicking on the button
    */
    return(
        <div>
            <img id={id} src={pathImages[image]} className="button" alt={alt} title={title} onClick = {onClick}/>
        </div>)
}

export default Button
