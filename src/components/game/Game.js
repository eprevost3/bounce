import React from 'react'
import './Game.css'

// draw upper and lower boundaries
const drawFloor = (height, width) => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "grey"
    ctx.fillRect(0, height, width, - height / 20 + .5);
}

const drawRoof = (height, width) => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "grey"
    ctx.fillRect(0, 0, width, height / 20 + .5);
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

// cleans the canvas
const clear = (canvas, yMin, yMax) => {
    const context = canvas.getContext('2d')
    context.clearRect(0, yMin, canvas.width, yMax - yMin)
}

// computes the jump equation
const computePos = (y, time, yMin, yMax) => {
    // careful tricky part, cuz y is oriented toward the bottom (as opposed to what
    // we used to do in physics)

    // equation derived from the Newton fundamental principle of dynamics
    var newY = y - (-200 * time ** 2 + 80 * time)

    // threshold the value so it doesn't get above or below maximum values
    if (newY <= yMin){newY = yMin}
    else if (newY >= yMax){newY = yMax}

    return(newY)
}

const posObstacles = (listX, listY, deltaX, deltaY, xRange, yRange, difficulty = 1) => {
    // deltaX : width of obstacles
    var newListX = [], newListY = []

    // initialize the obstacle
    if (listX[0] === undefined){
        var newListX = [xRange[1]], newListY = [Math.floor(Math.random() * yRange[1]) + yRange[0]]
    }else{
        // if obstacle are already existing : move them
        for (var k = 0; k < listX.length; k ++){
            // if obstacle is out of the frame, let's remove it and add a new one
            if (listX[k] <= 0){
                newListX.push(xRange[1])
                newListY.push(Math.floor(Math.random() * yRange[1]) + yRange[0])
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


class Game extends React.Component{
    constructor(props){
        super(props)
        this.canvasHeight = undefined
        this.canvasWidth = undefined
        this.sideSquare = 15
        // updating the animation every x ms
        this.deltaTime = 50
        this.time = 0

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

        this.heightObstacle = undefined
        this.widthObstacle = undefined

    }

    play = (y, canvas) => {
        setTimeout(() => {
            if (this.jump){
                this.time = 0
                this.jump = false
                this.startPlay = true
            }
            if (this.startPlay){
                // position y of player
                this.posY = computePos(y, this.time * 1e-3, this.yRange[0], this.yRange[1] - this.sideSquare)

                // update time
                this.time += this.deltaTime

                clear(canvas, this.yRange[0], this.yRange[1])

                // find new positions for obstacles
                var newPositions = posObstacles(this.listX, this.listY,
                                        this.deltaX, this.deltaY, this.xRange, this.yRange)

                this.listX = newPositions[0]
                this.listY = newPositions[1]

                // move obstacles
                moveObstacles(this.listX, this.listY, this.heightObstacle, this.widhtObstacles, "grey")

                // draw new position of square
                drawSquare(this.posX, this.posY, this.sideSquare)

                var isAlive = isStillAlive(this.posX, this.posY, this.sideSquare, this.heightObstacle,
                                           this.widthObstacle, this.yRange[0], this.yRange[1],
                                           this.listX, this.listY,)


                if (isAlive){
                     // wait until next animation
                     this.play(this.posY, canvas)
                }else{
                    this.startPlay = false
                    this.posY = (this.yRange[0] + this.yRange[1]) / 2
                    this.play(this.posY, canvas)
                }
            }

            else{this.play(this.posY, canvas)}

        }, this.deltaTime);
    }

    componentDidMount(){
        // getting canvas size
        var canvas = document.getElementById("canvas")
        this.canvasHeight = canvas.height
        this.canvasWidth = canvas.width

        // boundaries we musn't touch
        this.yRange[0] = this.canvasHeight * 1 / 20 - .5
        this.yRange[1] = this.canvasHeight * 19 / 20 + .5

        // x boundaries
        this.xRange[0] = 0
        this.xRange[1] = this.canvasWidth

        // size of obstacles
        this.heightObstacle = this.canvasHeight / 20 * 5
        this.widthObstacle = this.heightObstacle / 20

        // starting position
        this.posX = this.canvasWidth / 2 - this.sideSquare / 2 + .5
        this.posY = (this.yRange[0] + this.yRange[1]) / 2

        // add event listener to be able to jump
        document.addEventListener("keydown", (event) => {if(event.code === 'Space'){this.jump = true;}})

        // draw the floor
        drawFloor(this.canvasHeight, this.canvasWidth)

        // draw roof
        drawRoof(this.canvasHeight, this.canvasWidth)

        // draw the player (+ .5 to avoid blurry borders)
        drawSquare(this.posX, this.posY, this.sideSquare)

        this.play(this.posY, canvas)

    }

    render(){

        return(
            <div id = 'game'>
                <canvas id="canvas"></canvas>
            </div>
        )
    }

}

export default Game