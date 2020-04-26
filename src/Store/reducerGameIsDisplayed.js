const defaultState = {gameIsDisplayed : false}

function reducerGameIsDisplayed(state = defaultState, action){
    let nextState

    switch (action.type) {
        case 'isDisplayed':
            nextState = {...defaultState, gameIsDisplayed : true}
            return(nextState || state)

        case 'isNotDisplayed':
            nextState = {...defaultState, gameIsDisplayed : false}
            return(nextState || state)

        default: return(state)

    }
}

export default reducerGameIsDisplayed
