import React from 'react'
import './HeaderGame.css'
import Button from '../other/Button'
import PopUp from './PopUp'
import {connect} from 'react-redux'
import translations from '../translations/translations.js'


class HeaderGame extends React.Component{
    constructor(props){
        super(props)
        this.state = {show : false}
    }

    togglePopUp = () => {
        this.setState({show : this.state.show ? false : true})}

    render(){
        return(
            <div id='headerGame'>
                <Button id = 'restart' image = 'restart' title =  {translations[this.props.lang]['restart']} onClick = {() => {this.props.restart()}}/>
                <Button id = 'question' image = 'question' title = {translations[this.props.lang]['question']} onClick = {this.togglePopUp}/>

                {this.state.show ? <PopUp lang = {this.props.lang} exit = {this.togglePopUp}/> : undefined}
            </div>

        )
    }
}


export default connect()(HeaderGame)
