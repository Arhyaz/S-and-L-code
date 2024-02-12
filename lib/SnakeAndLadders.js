import { random } from "./random.js";
import axios from "axios"

const endPoint = "http://192.168.1.100"


const snakes_pos = [
    {first: 8, last: 2},
    {first: 15, last: 9}
]

const ladder_pos = [
    {first: 3, last: 5},
    {first: 11, last: 14}
]

const player1Degrees = [
    {servo1: 140, servo2: 80},
    {servo1: 110, servo2: 120},
    {servo1: 70, servo2: 120},
    {servo1: 30, servo2: 100},
    {servo1: 50, servo2: 70},
    {servo1: 80, servo2: 100},
    {servo1: 120, servo2: 80},
    {servo1: 130, servo2: 60},
    {servo1: 120, servo2: 60},
    {servo1: 110, servo2: 70},
    {servo1: 80, servo2: 60},
    {servo1: 60, servo2: 40},
    {servo1: 60, servo2: 20},
    {servo1: 80, servo2: 30},
    {servo1: 100, servo2: 30},
    {servo1: 120, servo2: 10},
]

const player2Degrees = [
    {servo1: 140, servo2: 100},
    {servo1: 100, servo2: 120},
    {servo1: 50, servo2: 80},
    {servo1: 30, servo2: 60},
    {servo1: 40, servo2: 80},
    {servo1: 60, servo2: 100},
    {servo1: 100, servo2: 70},
    {servo1: 120, servo2: 60},
    {servo1: 120, servo2: 70},
    {servo1: 100, servo2: 70},
    {servo1: 70, servo2: 60},
    {servo1: 50, servo2: 40},
    {servo1: 50, servo2: 10},
    {servo1: 70, servo2: 30},
    {servo1: 90, servo2: 30},
    {servo1: 110, servo2: 20},
]


export const processPos = (pos) => {
    // check for snakes
    for (let i = 0; i < snakes_pos.length; i++) {
        if (pos == snakes_pos[i].first) {
            pos = snakes_pos[i].last
        }
    }

    // check for ladders
    for (let i = 0; i < ladder_pos.length; i++) {
        if (pos == ladder_pos[i].first) {
            pos = ladder_pos[i].last
        }
    }

    return pos
}

export const roll = () => {
    return random(1,6)
}

export const move = (currentPos, rolledNum) => {
    return currentPos + rolledNum
}

export const giveQuestion = (game, callback) => {
    let answer = undefined

    const randomQuestion = random(1,10)

    const guiGroup = game.physics.add.staticGroup()

    const question = guiGroup.create(420, 165, `question${randomQuestion}`)
    question.setOrigin(0,0)

    const trueButton = guiGroup.create(502, 492, "true button")
    trueButton.setOrigin(0,0)
    trueButton.setInteractive({ useHandCursor: true })
    trueButton.on("pointerup", () => {
        answer = true
        callback(answer, randomQuestion)
        guiGroup.clear(true)
    })

    const falseButton = guiGroup.create(717, 492, "false button")
    falseButton.setOrigin(0,0)
    falseButton.setInteractive({ useHandCursor: true })
    falseButton.on("pointerup", () => {
        answer = false
        callback(answer, randomQuestion)
        guiGroup.clear(true)
    })
}

const getDegrees = (player, pos) => {
    if (player == 0) {
        return player1Degrees[pos]
    } else if (player == 1) {
        return player1Degrees[pos]
    }
}

export const moveArm = async (player, pos) => {
    try {
       const degrees = getDegrees(player, pos)
 
       await axios.post(`${endPoint}/rotate?servo1=${degrees.servo1}&servo2=${degrees.servo1}`)
       .then(() => {
          console.log("robot arm successfully rotated")
       })
       .catch(() => {
          console.log("request failed")
       })
    } catch {
       console.log("failed to send request")
    }
}

export const pinchArm = async () => {
    try { 
       await axios.post(`${endPoint}/pinch`)
       .then(() => {
          console.log("robot arm successfully pinched")
       })
       .catch(() => {
          console.log("request failed")
       })
    } catch {
       console.log("failed to send request")
    }
} 

export const unPinchArm = async () => {
    try { 
        await axios.post(`${endPoint}/unPinch`)
        .then(() => {
           console.log("robot arm successfully unPinched")
        })
        .catch(() => {
           console.log("request failed")
        })
     } catch {
        console.log("failed to send request")
     }
}