import Phaser from "phaser"
import {processPos, roll, move} from "../../lib/SnakeAndLadders.js"
import delay from "../../lib/util.js"

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

let winner = undefined

const calculateMovement = (pos) => {
   const maxTiles = 4
   let returnTiles = {x: pos, y: 0}


   if (pos > maxTiles) {
      returnTiles = {x: 4, y: pos-maxTiles}
   }

   console.log(returnTiles)
   return returnTiles
}

const moveTo = (pawn, finalPos) => {
   let ElevatedTiles = [5, 9, 13]
   let Elevated = 0
   let direction = 1

   while (playerPos[curerntTurn] != finalPos) {
      playerPos[curerntTurn] = move(playerPos[curerntTurn], 1)

      const currentPos = playerPos[curerntTurn]

      if (ElevatedTiles.find((element) => element == currentPos)) {
         Elevated += 1
         direction *= -1

         playerCoords[curerntTurn].y += 1
         console.log(`Changing direction to ${direction}`)
      } else {
         playerCoords[curerntTurn].x += direction
         console.log(playerCoords[curerntTurn].x)
      }

      const newX = squarePos.x + (tileWidth * playerCoords[curerntTurn].x)
      const newY = squarePos.y - (tileWidth * playerCoords[curerntTurn].y)

      console.log(`Moving to coords X: ${playerCoords[curerntTurn].x} Y: ${playerCoords[curerntTurn].y}`)
      currentPawn.setPosition(newX, newY)

      //await delay(50)
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

   const greenPawn = this.add.image(x, y, "greenPawn")
      //const greenPawn = this.add.image(squarePos.x + 40, squarePos.y, "greenPawn").setOrigin(0,0)
   greenPawn.name = "greenPawn"
   greenPawn.setOrigin(0,0)

   currentPawn = redPawn

   const rollImage = this.add.image(1146,655,"roll").setOrigin(0,0)
   rollImage.scale = .4
   rollImage.setInteractive( { useHandCursor: true  } );

   rollImage.on("pointerup", () => {
      if (winner) {
         console.log("Game is over bucko")
         return
      }

      const rolledNumber = roll()
      console.log(`${curerntTurn} landed roll ${rolledNumber}`)

      const nextPos = move(playerPos[curerntTurn], rolledNumber)
      console.log(`${curerntTurn} moving to ${nextPos}`)

      moveTo(currentPawn, nextPos)

      /*const calculatedTiles = calculateMovement(nextPos)
      currentPawn.setPosition((tileWidth * calculatedTiles.x), squarePos.y - (tileWidth * calculatedTiles.y))
      console.log((tileWidth * calculatedTiles.x), squarePos.y - (tileWidth * calculatedTiles.y))*/

      const processedPos = processPos(nextPos)
      playerPos[curerntTurn] = processedPos
      console.log(`${curerntTurn} Processing to ${processedPos}`)

      /*const calculatedTiles2 = calculateMovement(processedPos)
      currentPawn.setPosition((tileWidth * calculatedTiles2.x), squarePos.y - (tileWidth * calculatedTiles2.y))*/

      if (processedPos == 16) {
         winner = curerntTurn
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
