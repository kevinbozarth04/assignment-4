// start.js
// Starts off as a menu to choose between the two levels:
// - enemy level (Vee's level)
// - portal level (Kevin's level)

export default class Start extends Phaser.Scene {
    constructor() { super('Start'); }

    preload() {
        // TILE SETS
        this.load.tilemapTiledJSON('StartLevelKevin', 'assets/maps/level_kevin.tmj');
        this.load.tilemapTiledJSON('StartLevelSam', 'assets/maps/level_sam.tmj');
        
        this.load.image('world_tileset', 'assets/sprites/world_tileset.png');
        this.load.image('platforms', 'assets/sprites/platforms.png'); 
        this.load.image('dust', 'assets/sprites/dust.png'); 

        // PLAYER
        this.load.spritesheet('ben', 'assets/sprites/ben.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('coin', 'assets/sprites/coin.png', {
            frameWidth: 16, frameHeight: 16
        });
        this.load.spritesheet('slash', 'assets/sprites/slash.png', {
            frameWidth: 64, frameHeight: 47
        });
        this.load.image('thief', 'assets/sprites/thief.png'); 

        // SOUNDS 
        this.load.audio('coin', 'assets/sounds/coin.wav');
        this.load.audio('explosion', 'assets/sounds/explosion.wav');
        this.load.audio('hurt', 'assets/sounds/hurt.wav');
        this.load.audio('jump', 'assets/sounds/jump.wav'); 
        this.load.audio('attack', 'assets/sounds/attack.mp3');
        this.load.audio('thiefDeath', 'assets/sounds/thiefDeath.wav');
        this.load.audio('power_up', 'assets/sounds/power_up.wav');
        this.load.audio('teleport', 'assets/sounds/teleport.wav');
        this.load.audio('win', 'assets/sounds/win.wav');
        this.load.audio('mysteryMusic', 'assets/sounds/music.mp3'); 

    }

    create() {
        // menu text
        this.add.text(480, 200, 'Select level',
        { fontSize: 24, color: '#fff' }).setOrigin(0.5);

        this.add.text(480, 260, '[1] Kevin\'s Level\n[2] Sam\'s Level',
        { fontSize: 18, color: 'rgba(255, 255, 255, 1)', align: 'left' }).setOrigin(0.5);

        this.add.text(480, 400, '  -=|Controls|=- \n[WASD] Movement\n[J] Attack',
        { fontSize: 16, color: '#ffffffff', align: 'left' }).setOrigin(0.5);

        /*// music start
        let mus = this.sound.get('mysteryMusic');
        if (!mus) {
            mus = this.sound.add('mysteryMusic', {loop: true});
            mus.play();
        }*/

        // start level
        this.input.keyboard.on('keydown-ONE', () => this.scene.start('StartLevelKevin'));
        this.input.keyboard.on('keydown-TWO', () => this.scene.start('StartLevelSam'));
    }
}