import React from 'react';
import Header from './components/header/Header'
import StartPage from './components/startPage/StartPage'
import './App.css';

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            condComp : "startPage", // component displayed before starting game
        }
    }

    // changing which component is displayed in the middle part of the app
    changeComponent = (whichComp) => {
        // starting the game
        if (whichComp === "startPage"){this.setState({condComp : "startPage"})}
        // ending the game cuz player lost
        else if (whichComp === "startGame"){this.setState({condComp : "true"})}
    }

    render(){
        // conditional component evolving throughout the game
        let condComp

        // choosing the condComponent value: if game start, let's display the
        // welcome compoent, if game is on, let's display the game itself
        if(this.state.condComp === "startPage"){condComp = <StartPage func = {this.changeComponent}/>}
        else{condComp = <Header></Header>}

        return (
          <div className="App">
              <Header></Header>
              {condComp}

          </div>
        );
    }
}

export default App;
