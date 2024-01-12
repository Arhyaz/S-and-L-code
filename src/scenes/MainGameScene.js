import Phaser from "phaser"
import {processPos, roll, move} from "../../lib/SnakeAndLadders.js"

import delay from "../../lib/util.js"
import bezierCurve from "../../lib/bezierCurve.js"

const squarePos = {
   x: 260,
   y: 720,
}

const tileWidth = 155

let curerntTurn = 0
let currentPawn = undefined

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

export default class MainGameScene extends Phaser.Scene {
 constructor() {
  super("MainGame")
 }

 preload() {
    this.load.image("roll", "images/logo logo game/3.png")
    this.load.image("gameBG", "images/gamr bg.png")

    this.load.image("redPawn", "sprites/red_pawn.png")
    this.load.image("greenPawn", "sprites/green_pawn.png")
 }

 create() {
   this.add.image(0,0,"gameBG").setOrigin(0,0)

   const x = squarePos.x + (tileWidth * playerCoords[curerntTurn].x)
   const y = squarePos.y - (tileWidth * playerCoords[curerntTurn].y)

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
      if (winner) {
         console.log("Game is over bucko")
         return
      } else {
         console.log(`No winner yet ${winner}`)
      }

      const rolledNumber = roll()
      console.log(`${curerntTurn} landed roll ${rolledNumber}`)

      const nextPos = move(playerPos[curerntTurn], rolledNumber)
      console.log(`${curerntTurn} moving to ${nextPos}`)

      await moveTo(this, nextPos)

      const processedPos = processPos(nextPos)

      if (nextPos != processedPos) {
         console.log(`${curerntTurn} Processing to ${processedPos}`)
         setTo(this, processedPos)
      }

      /*const calculatedTiles2 = calculateMovement(processedPos)
      currentPawn.setPosition((tileWidth * calculatedTiles2.x), squarePos.y - (tileWidth * calculatedTiles2.y))*/

      if (processedPos == 16) {
         winner = currentPawn
         console.log(`${winner} WON!!`)
         return
      }

      if (curerntTurn == 0) {
         curerntTurn = 1
         currentPawn = greenPawn
      } else {
         curerntTurn = 0
         currentPawn = redPawn
      }
   })
 }

 update() {
 }
}
