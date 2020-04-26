import React from 'react'
import './Game.css'
import {connect} from 'react-redux'
import CurrentScore from './CurrentScore'


// draw upper and lower boundaries
const drawFloor = (height, width) => {
    var canvas = document.getElementById("canvas");
    const context = canvas.getContext('2d')
    const image = new Image();
    image.src = require("../img/brick.png");
    image.onload = () => {context.drawImage(image, 0, canvas.height, canvas.width, - height / 20 + .5);};

}

const drawRoof = (height, width) => {
    var canvas = document.getElementById("canvas");
    const context = canvas.getContext('2d')
    const image = new Image();
    image.src = require("../img/brick1.png");
    image.onload = () => {context.drawImage(image, 0, 0, canvas.width, height / 20);};
}

const drawSquare = (x, y, side = 20, color = 'black') => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = color
    ctx.fillRect(x, y, side, side);
}

const drawRect = (x, y, height = 20, width = 10, color = 'black') => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height);
}

// check if we didn't touch the boundaries or the obstacles
const isStillAlive = (xPlayer, yPlayer, widthPlayer, heightObstacle, widthObstacle,
                                            yMin, yMax, xObstacles, yObstacles) => {
    var isAlive = (yPlayer > yMin) && (yPlayer + widthPlayer < yMax)
    var xMin = xPlayer - widthObstacle, xMax = xPlayer + widthPlayer

    for (var k = 0; k < xObstacles.length; k ++){
        var xObstacle = xObstacles[k], yObstacle = yObstacles[k]

        // if player is in the range of the obstacle let's do the test otherwise there's no need to check
        // player is touching the obstacle (cuz it's not possible)
        isAlive *= (xMin <= xObstacle) && (xObstacle <= xMax) ?
                !((yObstacle - widthPlayer <= yPlayer) && (yPlayer <= yObstacle + heightObstacle)) : 1

    }

    return(isAlive)
}

// check if we update the score: we have to be sure the obstacle can't be touched now
// and that we do not count an obstacle multiple times
const updateScore = (xPlayer, xObstacles, widthObstacle, deltaX, currentScore) => {
    var n = xObstacles.length

    for (var k = 0; k < n ; k ++){
        if ((xObstacles[k] + widthObstacle < xPlayer) && (xPlayer - xObstacles[k] <= deltaX)){return(currentScore + 1);}
        else{}
    }
    // if we reach here, that means no new obstacle has been passed, score remains the same
    return(currentScore)
}


// cleans the canvas
const clear = (canvas, yMin, yMax) => {
    const context = canvas.getContext('2d')
    context.clearRect(0, yMin, canvas.width, yMax - yMin)
}

// computes the jump equation
const computePos = (initialPos, initialSpeed, time, yMin, yMax) => {
    // careful tricky part, cuz y is oriented toward the bottom (as opposed to what
    // we used to do in physics)
    const g = 9.81 * 70

    // equation derived from the Newton fundamental principle of dynamics
    var newY = 1 / 2 * g * time ** 2 + initialSpeed * time + initialPos

    // threshold the value so it doesn't get above or below maximum values
    if (newY <= yMin){newY = yMin}
    else if (newY >= yMax){newY = yMax}

    return(newY)
}

const posObstacles = (listX, listY, deltaX, deltaY, xRange, yRange, heightObstacle, difficulty = 1) => {
    // deltaX : width of obstacles
    var newListX = [], newListY = []

    // initialize the obstacle
    if (listX[0] === undefined){
        // put 2 obstacles
        newListX = [xRange[1], xRange[1] * 1.5]

        var y0 = Math.floor(Math.random() * (yRange[1] - heightObstacle))
        var y1 = Math.floor(Math.random() * (yRange[1] - heightObstacle))

        // make sure the obstacles don't touch the upper and lower border
        y0 = y0 <= yRange[0] ? yRange[0] : y0
        y1 = y1 <= yRange[0] ? yRange[0] : y1
        newListY = [y0, y1]



    }else{
        // if obstacle are already existing : move them
        for (var k = 0; k < listX.length; k ++){
            // if obstacle is out of the frame, let's remove it and add a new one
            if (listX[k] <= 0){
                newListX.push(xRange[1])
                var newY = Math.floor(Math.random() * (yRange[1] - heightObstacle))

                // make sure the obstacles don't touch the upper and lower border
                newY = newY <= yRange[0] ? yRange[0] : newY
                newListY.push(newY)
            }else{
                newListX.push(listX[k] - deltaX)
                newListY.push(listY[k] + deltaY)
            }
        }
    }
    return([newListX, newListY])
}

// move the obstacles on the game
const moveObstacles = (listX, listY, heightObstacle, widthObstacle, colorObstacle) => {
    for (var k = 0; k < listX.length; k++){
        drawRect(listX[k], listY[k], heightObstacle, widthObstacle, colorObstacle)
    }
}

const drawImage = (canvas) => {
    const context = canvas.getContext('2d')
    const image = new Image();
    image.src = require("../img/sky.png");
    image.onload = () => {context.drawImage(image, 0, 0, canvas.width, canvas.height);};
}


class Game extends React.Component{
    constructor(props){
        super(props)
        this.canvasHeight = undefined
        this.canvasWidth = undefined
        this.sideSquare = 15

        // updating the animation every x ms
        this.deltaTime = 50
        this.time = 0
        this.speed = - 200

        // boundaries we musn't touch / limits of the canvas
        this.xRange = [undefined]
        this.yRange = [undefined]

        // while false, don't start playing the game
        this.startPlay = false

        // starting position
        this.posX = undefined
        this.posY = undefined

        // position of obstacles on the dataframe
        this.listX = [undefined]
        this.listY = [undefined]

        // speed at which the obstacles move
        this.deltaX = 10
        this.deltaY = 0

        this.posInit = undefined
        this.heightObstacle = undefined
        this.widthObstacle = undefined

        // overall score
        this.score = 0
    }

    // update current score in the global state
    dispatchScore = (score) => {
        var action = {type : "plusOne", value : score}

        this.props.dispatch(action)
    }


    play = (y, canvas) => {
        if (!this.props.checkGameIsOn()){return(0);/* do nothing, since the game component is not displayed*/}
        else{}

        setTimeout(() => {
            if (this.jump){
                this.jump = false
                this.startPlay = true
                this.posInit = this.posY

                // reinit time
                this.time = 0
            }

            if (this.startPlay){
                // position y of player
                this.posY = computePos(this.posInit, this.speed, this.time, this.yRange[0], this.yRange[1] - this.sideSquare)

                // update time
                this.time += this.deltaTime * 1e-3

                clear(canvas, this.yRange[0], this.yRange[1])

                // find new positions for obstacles
                var newPositions = posObstacles(this.listX, this.listY,
                                        this.deltaX, this.deltaY, this.xRange, this.yRange, this.heightObstacle,)

                this.listX = newPositions[0]
                this.listY = newPositions[1]

                // move obstacles
                moveObstacles(this.listX, this.listY, this.heightObstacle, this.widhtObstacles, "grey")

                // draw new position of square
                drawSquare(this.posX, this.posY, this.sideSquare)

                var isAlive = isStillAlive(this.posX, this.posY, this.sideSquare, this.heightObstacle,
                                           this.widthObstacle, this.yRange[0], this.yRange[1],
                                           this.listX, this.listY,)

                // check if we need to update the score
                if(this.score !== updateScore(this.posX, this.listX, this.widthObstacle, this.deltaX, this.score)){
                    this.score ++

                    // if score changes update the global score, to update the other components indicating the score
                    this.dispatchScore(this.score)
                }

                if (isAlive){
                     // wait until next animation
                     this.play(this.posY, canvas)
                }else{
                    this.startPlay = false
                    // reinitialize the positions
                    this.posY = (this.yRange[0] + this.yRange[1]) / 2

                    // since we lost, let's update the score if we the record was beaten
                    this.props.updateBestScore("set", this.score)

                    // since game is over display a new component
                    setTimeout(() => {
                        this.props.func("startPage")

                        // set the score back to 0
                        this.score = 0

                        // dispatch the score change to all components
                        const action = {type : "zero"}
                        this.props.dispatch(action)
                    }, 1000)

                }
            }

            else{this.play(this.posY, canvas)}

        }, this.deltaTime);
    }

    componentDidMount(){
        // getting canvas size and drawing background image
        var canvas = document.getElementById("canvas")
        var canvasBackground = document.getElementById("canvasBackground")

        drawImage(canvasBackground)

        this.canvasHeight = canvas.height
        this.canvasWidth = canvas.width

        // boundaries we musn't touch
        this.yRange[0] = this.canvasHeight * 1 / 20 - .5
        this.yRange[1] = this.canvasHeight * 19 / 20 + .5

        // x boundaries
        this.xRange[0] = 0
        this.xRange[1] = this.canvasWidth

        // size of obstacles
        this.heightObstacle = this.canvasHeight / 20 * 7
        this.widthObstacle = this.heightObstacle / 20

        // starting position
        this.posX = this.canvasWidth / 2 - this.sideSquare / 2 + .5
        this.posY = (this.yRange[0] + this.yRange[1]) / 2

        // add event listener to be able to jump
        document.addEventListener("keydown", (event) => {if(event.code === 'Space'){this.jump = true}})

        // draw the floor
        window.onload = drawFloor
        drawFloor(this.canvasHeight, this.canvasWidth)

        // draw roof
        drawRoof(this.canvasHeight, this.canvasWidth)

        // draw the player (+ .5 to avoid blurry borders)
        drawSquare(this.posX, this.posY, this.sideSquare)

        this.play(this.posY, canvas)

    }

    render(){
        return(
            <div id = 'game' className = "variableComponent">
                <canvas id ='canvasBackground'/>
                <canvas id="canvas"/>
                <CurrentScore/>
            </div>
        )
    }

}

// bool value indicating if the game is displayed. This is useful to stop some functions like the
// play function (which will continue running otherwise, even when the game is not displayed)
//NOW USELESS BUT KEEPING IT FOR OTHER PROJECTS WHERE I'LL NEED A TEMPLATE
const mapStateToProps = (state) => {return({gameIsDisplayed : state.reducerGameIsDisplayed.gameIsDisplayed})}

export default connect(mapStateToProps)(Game)
