import React from 'react';
import Header from './components/header/Header'
import StartPage from './components/startPage/StartPage'
import Game from './components/game/Game'
import './App.css';

class App extends React.Component{
    constructor(props){
        super(props)
        this.bestScore = 0
        this.state = {
            condComp : "startPage", // component displayed before starting game
        }
    }

    // get and modifies best Score
    setAndGetBestScore = (option, newValue = undefined) => {
        if (option === "get"){return(this.bestScore)}
        else if (option === "set"){
            this.bestScore = this.bestScore > newValue ? this.bestScore : newValue
        }
    }

    // changing which component is displayed in the middle part of the app
    changeComponent = (whichComp) => {this.setState({condComp : whichComp})}

    render(){
        // conditional component evolving throughout the game
        let condComp

        // choosing the condComponent value: if game start, let's display the
        // welcome compoent, if game is on, let's display the game itself
        if(this.state.condComp === "startPage"){
            condComp = <StartPage func = {this.changeComponent} score = {this.setAndGetBestScore}/>
        }else if (this.state.condComp === "startGame"){condComp = <Game func = {this.changeComponent}/>}

        return (
            <div className="App">
                <Header></Header>
                <div id = 'content'>
                    <div id = 'marginLeft'></div>

                    <div id = 'center'>
                        <div id = 'marginTop'></div>
                        {condComp}
                        <div id = 'marginBottom'></div>
                    </div>

                    <div id = 'marginRigth'></div>
                </div>
            </div>
        );
    }
}

export default App;
