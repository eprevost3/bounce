var defaultState = {score : 0}


function reducerUpdateScore(state = defaultState, action){
    let nextState

    switch (action.type) {
        case 'plusOne':
            nextState = {...defaultState, score : action.value}
            return(nextState || state)

        case 'zero':
            nextState = {...defaultState, score : 0}
            return(nextState)

        default: return(nextState || state)

    }
}

export default reducerUpdateScore
