import Phaser from "phaser"
import {processPos, roll, move} from "../../lib/SnakeAndLadders.js"

const squarePos = {
   x: 415,
   y: 565,
}

let curerntTurn = 0
let currentPawn = undefined

let playerPos = [1,1]
let winner = undefined

const calculateMovement = (pos) => {
   const maxTiles = 4
   let returnTiles = {x: pos, y: 0}


   if (pos > maxTiles) {
      returnTiles = {x: 4, y: pos-maxTiles}
   }

   return returnTiles
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

   const redPawn = this.add.image(squarePos.x, squarePos.y, "redPawn").setOrigin(0,0)
   const greenPawn = this.add.image(squarePos.x, squarePos.y, "greenPawn").setOrigin(0,0)
   //const greenPawn = this.add.image(squarePos.x + 40, squarePos.y, "greenPawn").setOrigin(0,0)
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

      const calculatedTiles = calculateMovement(nextPos)
      currentPawn.setPosition(squarePos.x + (155 * calculatedTiles.x), squarePos.y - (155 * calculatedTiles.y))
      console.log(squarePos.x + (155 * calculatedTiles.x), squarePos.y - (155 * calculatedTiles.y))

      const processedPos = processPos(nextPos)
      playerPos[curerntTurn] = processedPos
      console.log(`${curerntTurn} Processing to ${processedPos}`)

      const calculatedTiles2 = calculateMovement(processedPos)
      currentPawn.setPosition(squarePos.x + (155 * calculatedTiles2.x), squarePos.y - (155 * calculatedTiles2.y))

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
