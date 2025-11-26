// start.js
// Starts off as a menu to choose between the two levels:
// - enemy level (Vee's level)
// - portal level (Kevin's level)

export default class Start extends Phaser.Scene {
    constructor() { super('Start'); }

    preload() {
        // TILE SETS
        this.load.tilemapTiledJSON('StartEnemyLevel', 'assets/maps/lvlVee.tmj');
        //this.load.tilemapTiledJSON('StartPortalLevel', 'assets/maps/portal_level.tmj');
        this.load.tilemapTiledJSON('StartPortalLevel', 'assets/maps/portal_level2.tmj');
        
        this.load.image('world_tileset', 'assets/sprites/world_tileset.png');
        this.load.image('platforms', 'assets/sprites/platforms.png'); 
        this.load.image('dust', 'assets/sprites/dust.png'); 

        // PLAYER
        this.load.spritesheet('knight', 'assets/sprites/knight.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('coin', 'assets/sprites/coin.png', {
            frameWidth: 16, frameHeight: 16
        });
        this.load.spritesheet('slash', 'assets/sprites/slash.png', {
            frameWidth: 64, frameHeight: 47
        });
        this.load.image('slime', 'assets/sprites/slimeSingle.png'); 

        // SOUNDS 
        
        this.load.audio('coin', 'assets/sounds/coin.wav');
        this.load.audio('explosion', 'assets/sounds/explosion.wav');
        this.load.audio('hurt', 'assets/sounds/hurt.wav');
        this.load.audio('jump', 'assets/sounds/jump.wav'); 
        this.load.audio('attack', 'assets/sounds/attack.mp3');
        this.load.audio('slimeDeath', 'assets/sounds/slimeDeath.wav');
        this.load.audio('power_up', 'assets/sounds/power_up.wav');
        this.load.audio('teleport', 'assets/sounds/teleport.wav');
        this.load.audio('win', 'assets/sounds/win.wav');
        this.load.audio('mysteryMusic', 'assets/music/mystery_music.mp3'); // original music composed by kevin :D

        // ENEMIES

        // PORTALS
        this.load.image('portal_orange_black', 'assets/sprites/orangeblack.png');
        this.load.image('portal_orange_white', 'assets/sprites/orangewhite.png');
        this.load.image('portal_green_black', 'assets/sprites/greenblack.png');
        this.load.image('portal_green_white', 'assets/sprites/greenwhite.png'); 
        this.load.image('portal_blue_black', 'assets/sprites/blueblack.png');
        this.load.image('portal_blue_white', 'assets/sprites/bluewhite.png');
        this.load.image('flag', 'assets/sprites/flag.png'); // finish line for portal level

    }

    create() {
        // menu text
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x06767).setOrigin(0);
        this.add.text(480, 200, 'Select level',
        { fontSize: 24, color: '#fff' }).setOrigin(0.5);

        this.add.text(480, 260, '[1] Enemy Level (Vee)\n[2] Portal Level (Kevin)',
        { fontSize: 18, color: 'rgba(255, 255, 255, 1)', align: 'left' }).setOrigin(0.5);

        this.add.text(480, 400, '  -=|Controls|=- \n[A][D] Left-Right\n[Space] Jump\n[J] Attack',
        { fontSize: 16, color: '#ffffffff', align: 'left' }).setOrigin(0.5);

        // music start
        let mus = this.sound.get('mysteryMusic');
        if (!mus) {
            mus = this.sound.add('mysteryMusic', {loop: true});
            mus.play();
        }

        // start level
        this.input.keyboard.on('keydown-ONE', () => this.scene.start('StartEnemyLevel'));
        this.input.keyboard.on('keydown-TWO', () => this.scene.start('StartPortalLevel'));
    }
}