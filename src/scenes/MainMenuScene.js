import Phaser from "phaser"

let currentTutorialPage = 0
let tutorial = undefined

export default class MainMenuScene extends Phaser.Scene {
 constructor() {
  super("MainMenu")
 }
 async preload() {
  this.load.audio("click", "sfx/click.mp3")

  // preload images
  this.load.image("MainMenu BG", "images/logo logo game/Mainmenuu.bg.png")

  // tutorials
  for (let i = 1; i<7; i++) {
    console.log(i)
    this.load.image(`tutorialPage${i}`, `gui/Tutorials/${i}.png`)
  }

  //gui
  this.load.svg("title", "gui/title.svg")
  this.load.svg("start", "gui/start.svg")
  this.load.svg("start hovered", "gui/start_hover.svg")
  this.load.svg("tutorial button", "gui/tutorial_button.svg")
 }
 

 create() {
    const sound = this.sound.add("click")

    this.add.image(0,0,"MainMenu BG").setOrigin(0,0)

    const start_button = this.add.image(346, 695, "start")
    start_button.setOrigin(0,0)

    const tutorial_button = this.add.image(64, 713, "tutorial button")
    tutorial_button.setOrigin(0,0)
    tutorial_button.setInteractive({ useHandCursor: true })

    tutorial_button.on("pointerup", () => {
      sound.play()

      currentTutorialPage = 1

      tutorial = this.add.image(0,0,`tutorialPage${currentTutorialPage}`)
      tutorial.setOrigin(0,0)
      tutorial.setInteractive()
      tutorial.on("pointerup", () => {
        sound.play()  

        if (currentTutorialPage >= 6) {
          tutorial.destroy()
        } else {
          currentTutorialPage += 1
          tutorial.setTexture(`tutorialPage${currentTutorialPage}`)
        }
      })
    })
   }

 update() {
  const sound = this.sound.add("click")

   this.keys = this.input.keyboard.addKeys({
      space:  Phaser.Input.Keyboard.KeyCodes.SPACE,
  });

  // @ts-ignore
  if (this.keys.space.isDown) {
    sound.play()  
    this.scene.start("MainGame")
  }
 }
}
