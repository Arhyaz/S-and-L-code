import Phaser from "phaser"
import {processPos, roll, move, giveQuestion} from "../../lib/SnakeAndLadders.js"

import delay from "../../lib/util.js"

const question_answers = [
   true,
   false,
   true,
   false,
   false,
   false,
   true,
   false,
   true,
   false,
]


const squarePos = {
   x: 260,
   y: 720,
}

const tileWidth = 155

let curerntTurn = 0
let currentPawn = undefined
let debounce = false

let playerPos = [1,1]
let playerCoords = [
   {x: 1, y: 1},
   {x: 1, y: 1}
]

let playerDirections = [
   1,
   1
]

let winner = undefined

const rollingDieVisual = async(rolledNumber, die) => {
   for(let i=0; i<25; i++) {
      const randomRoll = roll()
      die.setTexture(`die${randomRoll}`)
      await delay(65)
   }

   die.setTexture(`die${rolledNumber}`)
}

const setTo = async (game, finalPos) => {
   console.log("Settting position", finalPos)

   let ElevatedTiles = [5, 9, 13]
   let Elevated = 0

   let currentPos = 1
   let currentDirection = 1
   let currentX = 1
   let currentY = 1

   while (currentPos != finalPos) {
      currentPos += 1

      if (ElevatedTiles.find((element) => element == currentPos)) {
         Elevated += 1
         currentDirection *= -1

         currentY += 1
      } else {
         currentX += currentDirection
         console.log(currentX)
      }

      console.log(`Setting to coords X: ${currentX} Y: ${currentY}`)
   }

   console.log(`SET LOOP COMPLETED: ${currentPos}`)

   const newX = squarePos.x + (tileWidth * currentX)
   const newY = squarePos.y - (tileWidth * currentY)

   playerDirections[curerntTurn] = currentDirection
   playerPos[curerntTurn] = currentPos
   playerCoords[curerntTurn].x = currentX
   playerCoords[curerntTurn].y = currentY
   
   game.tweens.add({
      targets: currentPawn,
      x: newX,
      y: newY,
      duration: 400
   })

}

const moveTo = async (game, finalPos) => {
   let ElevatedTiles = [5, 9, 13]
   let Elevated = 0

   while (playerPos[curerntTurn] != finalPos) {
      playerPos[curerntTurn] = move(playerPos[curerntTurn], 1)

      const currentPos = playerPos[curerntTurn]

      if (ElevatedTiles.find((element) => element == currentPos)) {
         Elevated += 1
         playerDirections[curerntTurn] *= -1

         playerCoords[curerntTurn].y += 1
      } else {
         playerCoords[curerntTurn].x += playerDirections[curerntTurn]
         console.log(playerCoords[curerntTurn].x)
      }

      const newX = squarePos.x + (tileWidth * playerCoords[curerntTurn].x)
      const newY = squarePos.y - (tileWidth * playerCoords[curerntTurn].y)

      console.log(`Moving to coords X: ${playerCoords[curerntTurn].x} Y: ${playerCoords[curerntTurn].y}`)

      game.tweens.add({
         targets: currentPawn,
         x: newX,
         y: newY,
         duration: 400
      })

      await delay(500)
   }

   console.log(`LOOP COMPLETED: ${playerPos[curerntTurn]}`)
}

const waitAnswer = async (game) => {
   return new Promise((resolve) => {
      giveQuestion(game, (answer, question) => {
         if (answer == question_answers[question-1]) {
            resolve(true)
        } else {
            console.log("Answer is incorrect")
            resolve(false)
        }
      })
   })
}

export default class MainGameScene extends Phaser.Scene {
 constructor() {
  super("MainGame")
 }

 preload() {
   // gui
   for (let i=1; i<7; i++) {
      this.load.image(`die${i}`, `gui/dice/${i} die.png`)
   }

   for (let i=1; i<11; i++) {
      this.load.image(`question${i}`, `gui/Questions/Question ${i}.png`)
   }

   for (let i=1; i<3; i++) {
      this.load.image(`victory${i}`, `gui/victory logos/victory player ${i}.png`)
   } 

   this.load.image("true button", "gui/Questions/True button.png")
   this.load.image("false button", "gui/Questions/False button.png")

   this.load.image("playerBar_right", "gui/playerBar/player bar kanan.png")
   this.load.image("playerBar_left", "gui/playerBar/player bar kiri.png")

   this.load.image("roll", "images/logo logo game/3.png")
   this.load.image("gameBG", "images/gamr bg.png")

   // image
   this.load.image("redPawn", "sprites/red_pawn.png")
   this.load.image("greenPawn", "sprites/green_pawn.png")
 }

 create() {
   this.add.image(0,0,"gameBG").setOrigin(0,0)

   const playerBar = this.add.image(41, 691, "playerBar_right")
   playerBar.setOrigin(0,0)
   playerBar.setAngle(-90)
   playerBar.setScale(0.4)

   const x = squarePos.x + (tileWidth * playerCoords[curerntTurn].x)
   const y = squarePos.y - (tileWidth * playerCoords[curerntTurn].y)

   const die = this.add.image(1116, 461, "die1")
   die.setOrigin(0,0)

   const redPawn = this.add.image(x, y, "redPawn")
   redPawn.name = "redPawn"
   redPawn.setOrigin(0,0)

   const greenPawn = this.add.image(x+40, y, "greenPawn")
   greenPawn.name = "greenPawn"
   greenPawn.setOrigin(0,0)

   currentPawn = redPawn

   const rollImage = this.add.image(1146,655,"roll").setOrigin(0,0)
   rollImage.scale = .4
   rollImage.setInteractive( { useHandCursor: true  } );

   rollImage.on("pointerup", async () => {
      // check winner
      if (winner) {
         console.log("Game is over bucko")
         return
      } else {
         console.log(`No winner yet ${winner}`)
      }

      // check cooldown
      if (debounce) {return}
      debounce = true

      // question
      const result = await waitAnswer(this)
      
      if (result == false) {
         debounce = false
         return
      }

      // roll number
      const rolledNumber = roll()
      await rollingDieVisual(rolledNumber, die)

      // move position
      const nextPos = move(playerPos[curerntTurn], rolledNumber)
      await moveTo(this, nextPos)

      // process position
      const processedPos = processPos(nextPos)

      if (nextPos != processedPos) {
         console.log(`${curerntTurn} Processing to ${processedPos}`)
         setTo(this, processedPos)
      }

      // check winner
      if (processedPos == 16) {
         winner = currentPawn
         console.log(`${winner} WON!!`)
         return
      }

      // change turns
      if (curerntTurn == 0) {
         curerntTurn = 1

         currentPawn = greenPawn
         playerBar.setTexture("playerBar_left")
      } else {
         curerntTurn = 0

         currentPawn = redPawn
         playerBar.setTexture("playerBar_right")
      }

      debounce = false // turn off cooldown*/
   })
 }

 update() {
 }
}
