import Phaser from "phaser"

export default class MainMenuScene extends Phaser.Scene {
 constructor() {
  super("MainMenu")
 }
 async preload() {
   // preload images
   this.load.image("MainMenu BG", "images/logo logo game/Mainmenuu.bg.png")

   //gui
   this.load.svg("title", "gui/title.svg")
   this.load.svg("start", "gui/start.svg")
   this.load.svg("start hovered", "gui/start_hover.svg")
   this.load.svg("tutorial button", "gui/tutorial_button.svg")
 }
 

 create() {
    this.add.text(0,0,"Main Menu")
    this.add.image(0,0,"MainMenu BG").setOrigin(0,0)

    //this.add.image(64, 345, "title").setOrigin(0,0)

    const start_button = this.add.image(346, 695, "start")
    start_button.setOrigin(0,0)

    const tutorial_button = this.add.image(64, 713, "tutorial button")
    tutorial_button.setOrigin(0,0)
    tutorial_button.setInteractive({ useHandCursor: true })
    tutorial_button.on("pointerup", () => {
      console.log("deez nuts")
    })
   }

 update() {
   this.keys = this.input.keyboard.addKeys({
      space:  Phaser.Input.Keyboard.KeyCodes.SPACE,
  });

  // @ts-ignore
  if (this.keys.space.isDown) {
   this.scene.start("MainGame")
  }
 }
}
