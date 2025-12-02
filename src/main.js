// main.js

import Start from './scenes/start.js';
import StartLevelKevin from './scenes/startLevelKevin.js';
import StartLevelSam from './scenes/startLevelSam.js';
import GameOver from './scenes/gameOver.js';
import Win from './scenes/win.js';

const config = {
    type: Phaser.AUTO,
    roundPixels: false,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#000000ff', 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    pixelArt: true,
    scene: [Start, StartLevelKevin, StartLevelSam, GameOver, Win] 
};

new Phaser.Game(config);
