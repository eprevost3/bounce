import React from 'react';
import { Provider } from 'react-redux'
import Store from './Store/configureStore'
import Header from './components/header/Header'
import HeaderGame from './components/headerGame/HeaderGame'
import StartPage from './components/startPage/StartPage'
import Game from './components/game/Game'
import './App.css';

class App extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            condComp : "startPage", // component displayed before starting game
            language : this.readCookie().language || 'us',
            bestScore : this.readCookie().bestScore || 0,
        }

        // check if cookies exist. If not, let's set them
        if (this.readCookie().language === ""){this.setValueCookie({language : "us", bestScore : 0})}
    }

    // change langage of website
    changeLanguage = () => {
        var lang = this.state.language === 'us' ? 'fr' : 'us'
        this.setState({language : lang})

        return(lang)
    }

    // get and modifies best Score
    setAndGetBestScore = (option, newValue = undefined) => {
        if (option === "get"){return(this.state.bestScore)}
        else if (option === "set"){
            var bestScore = this.state.bestScore > newValue ? this.state.bestScore : newValue

            // update state
            this.setState({bestScore : bestScore})
        }
    }

    // changing which component is displayed in the middle part of the app
    changeComponent = (whichComp) => {this.setState({condComp : whichComp})}

    // restart game :
    restart = () => {this.setState({condComp : "startPage"})}

    // read cookies we are using to customize the website
    readCookie(){
        var cookies = {"language" : "", "bestScore" : ""}

        var cooks = document.cookie
        // parse result
        cooks = cooks.split(";")

        // find langage and best score
        for (var k = 0; k < cooks.length; k++){
            var str = cooks[k].replace(/\s/g, '')

            if(str.substring(0, 8) === "language"){cookies.language = str.split("=")[1]}
            else if(str.substring(0, 9) === "bestScore"){cookies.bestScore = str.split("=")[1]}
            else{}
        }
        return(cookies)
    }

    // set the value of the cookies
    setValueCookie(dicCookies){
        // the input dictionnary contains the values of the cookies
        var keys = Object.keys(dicCookies)
        var date = new Date()
        date.setTime(date.getTime() + (365*24*60*60*1000));

        // cookie duration : one year
        var expires = "expires="+ date.toUTCString();

        keys.forEach((key, idx) => {document.cookie = key + "=" + dicCookies[key] + ";" + expires + ";path=/;"})
    }

    // update  cookies value
    udpdateCookies(cookies){this.setValueCookie(cookies)}

    render(){
        this.udpdateCookies({language : this.state.language, bestScore : this.state.bestScore})

        // conditional component evolving throughout the game
        let headComp, bodyComp

        // choosing the condComponent value: if game start, let's display the
        // welcome compoent, if game is on, let's display the game itself
        if(this.state.condComp === "startPage"){
            headComp = <Header lang = {this.state.language} onClick = {this.changeLanguage}/>
            bodyComp = <StartPage func = {this.changeComponent} lang = {this.state.language} score = {this.setAndGetBestScore}/>
        }else if (this.state.condComp === "startGame"){
            headComp = <HeaderGame lang = {this.state.language} restart = {this.restart}/>
            bodyComp = <Game func = {this.changeComponent} lang = {this.state.language} updateBestScore = {this.setAndGetBestScore}/>
        }

        return (
            <Provider store={Store}>
                <div className="App">
                    {headComp}
                    <div id = 'content'>
                        <div id = 'marginLeft'></div>

                        <div id = 'center'>
                            <div id = 'marginTop'></div>
                            {bodyComp}
                            <div id = 'marginBottom'></div>
                        </div>

                        <div id = 'marginRigth'></div>
                    </div>
                </div>
            </Provider>
        );
    }
}

/*
lier les cookies aux header et à la langue
régler le pfd
*/
export default App;
