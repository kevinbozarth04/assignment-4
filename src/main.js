// main.js

import Start from './scenes/start.js';
import StartLevelKevin from './scenes/startLevelKevin.js';
import StartLevelSam from './scenes/startLevelSam.js';

const config = {
    type: Phaser.AUTO,
    roundPixels: false,
    width: 2100,
    height: 1400,
    backgroundColor: '#000000ff', 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    pixelArt: true,
    scene: [Start, StartLevelKevin, StartLevelSam] 
};

new Phaser.Game(config);
