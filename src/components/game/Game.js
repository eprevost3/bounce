import React from 'react'
import './Game.css'

const drawFloor = (height, width) => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "grey"
    ctx.fillRect(0, height, width, - height / 20 + .5);
}

const drawRect = (x, y, height = 20) => {
    var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    ctx.fillStyle = "black"
    ctx.fillRect(x, y, height, - height);
}

// computes the jump equation
const computePos = (y, time, yMin, yMax) => {
    // careful tricky part, cuz y is oriented toward the bottom (as opposed to what
    // we used to do in physics)

    // equation derived from the Newton fundamental principle of dynamics
    var newY = y - (-150 * time ** 2 + 60 * time)

    // threshold the value so it doesn't get above or below maximum values
    if (newY <= yMin){newY = yMin}
    else if (newY >= yMax){newY = yMax}

    return(newY)
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

        // boundaries we musn't touch
        this.yMin = undefined
        this.yMax = undefined
    }

    play = (y, canvas) => {
        setTimeout(() => {
            if (this.jump){
                this.time = 0
                this.jump = false
            }
            var newY = computePos(y, this.time * 1e-3, this.yMin, this.yMax)

            // update time
            this.time += this.deltaTime

            // clear canvas
            const context = canvas.getContext('2d')
            context.clearRect(0, 0, canvas.width, canvas.height)

            // draw new position of rectangle
            drawRect(this.width / 2 - this.sideSquare / 2 + .5, newY, this.sideSquare)

            // wait until next animation
            this.play(newY, canvas)
        }, this.deltaTime);
    }

    componentDidMount(){
        // getting canvas size
        var canvas = document.getElementById("canvas")
        this.height = canvas.height
        this.width = canvas.width

        // boundaries we musn't touch
        this.yMin = this.height * 1 / 20 + .5
        this.yMax = this.height * 19 / 20 + .5

        // add event listener to be able to jump
        document.addEventListener("keydown", (event) => {if(event.code === 'Space'){this.jump = true;}})

        // draw the floor
        drawFloor(this.height, this.width)

        // draw the player (+ .5 to avoid blurry borders)
        drawRect(this.width / 2 - this.sideSquare / 2 + .5,
                this.yMax, this.sideSquare)

        this.play(this.yMax, canvas)

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
