import React from 'react'
import {connect} from 'react-redux'
import './CurrentScore.css'

const CurrentScore = (props) => {
    return(
        <div id="currentScore">
            {props.score}
        </div>
    )}

const mapStateToProps = (state) => {return({score : state.reducerUpdateScore.score})}

export default connect(mapStateToProps)(CurrentScore)
