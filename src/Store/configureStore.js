import { createStore, combineReducers } from 'redux';
import reducerUpdateScore from './reducerUpdateScore'
import reducerGameIsDisplayed from './reducerGameIsDisplayed'

export default createStore(combineReducers({reducerUpdateScore, reducerGameIsDisplayed}))
