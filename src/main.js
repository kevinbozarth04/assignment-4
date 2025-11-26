// main.js

//import Phaser from '../phaser.js'; // DONT UNCOMMENT THIS IS WHY IT WAS BLACK SCREEN FOR SO LONG
import Start from './scenes/start.js';
import StartEnemyLevel from './scenes/startEnemyLevel.js';
import StartPortalLevel from './scenes/startPortalLevel.js';

const config = {
    type: Phaser.AUTO,
    roundPixels: false,
    width: 800,
    height: 800,
    backgroundColor: '#8bb7d9ff', 
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1500 },
            debug: false
        }
    },
    pixelArt: true,
    scene: [Start, StartEnemyLevel, StartPortalLevel] 
};

new Phaser.Game(config);
