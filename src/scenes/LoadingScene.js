import Phaser from "phaser"
import delay from "../../lib/util"

export default class LoadingScene extends Phaser.Scene {
 constructor() {
  super("Loading")
 }

 async preload() {
    // preload images
    this.load.image("loading_bg", "images/loading_bg.png")

   

    console.log("Loading Completed!")
    //this.scene.start("MainMenu")
 }

 async create() {
    this.add.text(0,0,"Loading!")
    this.add.image(0,0,"loading_bg").setOrigin(0,0)

    const bar = this.add.graphics({
        fillStyle: {
            color: 0xffffff
        }
    })

    const text = this.add.text(this.scale.width/2 -95, this.scale.height/2 + 270    , "Loading: 0%").setOrigin(0,0)

    for(let percent = 0; percent < 101; percent++) {
        //console.log(`Percentage: ${percent}`)

        bar.fillRect(this.scale.width/2 - 300 ,this.scale.height/2 + 250, 5 * percent, 20)
        text.text = `Loading: ${percent}`

        //await delay(50)
        await delay(5)
    }

    // pindah ke main menu
    this.scene.start('MainMenu');
 }

 update() {
 }
}
