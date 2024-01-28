import Phaser from "phaser"
import {processPos, roll, move, giveQuestion} from "../../lib/SnakeAndLadders.js"

import delay from "../../lib/util.js"

const question_answers = [
   true, false, true, false, false, false, true, false, true, false,
]

const squarePos = {
   x: 260,
   y: 720,
}

const tileWidth = 155

let curerntTurn = 0
let currentPawn = undefined
let debounce = false
let mute = false

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

const shackingDieVisual = async(game, die) => {
   const high = 161
   const low  = 361
   const base = 461

   let current = "low"

   await delay(320)

   for(let i=0; i<18; i++) {
      if (current == "low") {
         console.log("low")

         game.tweens.add({
            targets: die,
            y: low,
            duration: 70
         })
      } else {  
         console.log("high")

         game.tweens.add({
            targets: die,
            y: high,
            duration: 70
         })
      }

      if (current == "low") {
         current = "high"
      } else {
         current = "low"
      }

      await delay(100)
   }

   await delay(350)

   game.tweens.add({
      targets: die,
      y: base,
      duration: 100,
      ease: 'Back.In',
   })

   console.log("base")
}

const rollingDieVisual = async(rolledNumber, die) => {
   for(let i=0; i<15; i++) {
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

const resetValues = () => {
   curerntTurn = 0
   currentPawn = undefined
   debounce = false

   playerPos = [1,1]
   playerCoords = [
      {x: 1, y: 1},
      {x: 1, y: 1}
   ]

   playerDirections = [
      1,
      1
   ]

   winner = undefined
}

export default class MainGameScene extends Phaser.Scene {
 constructor() {
  super("MainGame")
 }

 preload() {
   // sfx
   this.load.audio("victory", "sfx/victory.mp3")
   this.load.audio("die roll", "sfx/die roll.mp3")
   this.load.audio("click", "sfx/click.mp3")
   this.load.audio("bgMusic", "sfx/bgMusic.mp3")

   // gui
   for (let i=1; i<7; i++) {
      this.load.image(`die${i}`, `gui/dice/${i} die.png`)
   }

   for (let i=1; i<11; i++) {
      this.load.image(`question${i}`, `gui/Questions/Question ${i}.png`)
   }

   this.load.image("mute", "gui/buttons left bottom/3.png")
   this.load.image("unmute", "gui/buttons left bottom/4.png")
   this.load.image("home", "gui/buttons left bottom/5.png")
   this.load.image("replay", "gui/play again/play again.png")

   this.load.image("black", "images/black.png")

   this.load.image("victory1", "gui/victory logos/victory player 1.png")
   this.load.image("victory2", "gui/victory logos/victory player 2.png")

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
   this.sound.pauseOnBlur = false

   const clickSfx = this.sound.add("click")

   const bgMusic = this.sound.add("bgMusic", { loop: true, })
   bgMusic.play()

   this.add.image(0,0,"gameBG").setOrigin(0,0)

   const homeButton = this.add.image(60, 36, "home")
   homeButton.setOrigin(0,0)
   homeButton.setInteractive( { useHandCursor: true } )

   homeButton.on("pointerup", () => {
      clickSfx.play()
      bgMusic.stop()
      resetValues
      this.scene.start("MainMenu")
   })

   const muteButton = this.add.image(65, 662, "unmute")
   muteButton.setOrigin(0,0)
   muteButton.setInteractive( { useHandCursor: true  } )

   muteButton.on("pointerup", () => {
      clickSfx.play()

      if (mute == false) {
         console.log("Muting")
         mute = true

         muteButton.setTexture("mute")
         bgMusic.stop()
      } else {
         console.log("Unmutting")
         mute = false

         muteButton.setTexture("unmute")
         bgMusic.play()
      }
   })

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

      // roll number
      clickSfx.play()

      const rollSfx = this.sound.add("die roll")
      rollSfx.play()

      shackingDieVisual(this, die)

      await delay(2600)

      const rolledNumber = roll()
      await rollingDieVisual(rolledNumber, die)

      // move position
      const nextPos = move(playerPos[curerntTurn], rolledNumber)
      await moveTo(this, nextPos)

      // process position
      const processedPos = processPos(nextPos)

      if (nextPos < 16 && nextPos > processedPos) { // snake
         const result = await waitAnswer(this)

         if (result == false) {
            setTo(this, processedPos)
         }
      } else if (nextPos < 16 && nextPos < processedPos) { // ladder
         const result = await waitAnswer(this)

         if (result == true) {
            setTo(this, processedPos)
         }
      } else if (nextPos > 16) {
         setTo(this, processedPos)

         const newProcessedPos = processPos(nextPos)

         if (nextPos < 16 && nextPos > newProcessedPos) { // snake
            const result = await waitAnswer(this)
   
            if (result == false) {
               setTo(this, processedPos)
            }
         } else if (nextPos < 16 && nextPos < newProcessedPos) { // ladder
            const result = await waitAnswer(this)
   
            if (result == true) {
               setTo(this, processedPos)
            }
         }
      }

      // check winner
      if (processedPos == 16) {
         winner = currentPawn
         console.log(`${winner} WON!!`)

         const victorySfx = this.sound.add("victory")
         victorySfx.play()

         const blackScreen = this.add.image(0,0,"black")
         blackScreen.setOrigin(0,0)
         blackScreen.setAlpha(.8)

         const victory = this.add.image(161, 161, `victory${curerntTurn+1}`)
         victory.setOrigin(0,0)

         const replay = this.add.image(529, 618, "replay")
         replay.setOrigin(0,0)
         replay.setInteractive( { useHandCursor: true  } )
         
         replay.on("pointerup", () => {
            resetValues()
            this.scene.restart()
         })

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
