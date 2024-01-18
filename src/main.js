import Phaser from 'phaser'

import MainMenuScene from './scenes/MainMenuScene'
import LoadingScene from './scenes/LoadingScene'
import MainGameScene from './scenes/MainGameScene'

const config = {
    type: Phaser.AUTO,
	parent: 'app',
	width: 1366,
	height: 768,
	physics: {
		default: 'arcade',
		arcade: {
			//debug: true,
			//gravity: { y: 200 },
		},
    },
	scale: {
		mode: Phaser.Scale.FIT
	},
    scene: [LoadingScene, MainMenuScene, MainGameScene],
}

export default new Phaser.Game(config)
