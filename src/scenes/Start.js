// start.js
// Starts off as a menu to choose between the two levels:

export default class Start extends Phaser.Scene {
    constructor() { super('Start'); }

    preload() {
        // TILE SETS
        this.load.tilemapTiledJSON('StartLevelKevin', 'assets/maps/level_kevin.tmj');
        this.load.tilemapTiledJSON('StartLevelSam', 'assets/maps/level_sam.tmj');
        
        this.load.image('world_tileset', 'assets/sprites/world_tileset.png');
        this.load.image('platforms', 'assets/sprites/platforms.png'); 
        this.load.image('dust', 'assets/sprites/dust.png'); 
        this.load.image('kitchen', 'assets/sprites/kitchen.png');

        // PLAYER
        this.load.spritesheet('ben', 'assets/sprites/ben.png', {
            frameWidth: 32, frameHeight: 32
        });
        this.load.spritesheet('slash', 'assets/sprites/slash.png', {
            frameWidth: 64, frameHeight: 47
        });

        // NPCs
        this.load.image('thief', 'assets/sprites/thief.png');
        this.load.image('pig', 'assets/sprites/pig.png');
        this.load.image('evilPig', 'assets/sprites/evil_pig.png');
        this.load.image('crab', 'assets/sprites/crab.png');
        this.load.image('frog', 'assets/sprites/frog.png');

        // SOUNDS 
        this.load.audio('collect', 'assets/sounds/collect.wav');
        this.load.audio('explosion', 'assets/sounds/explosion.wav');
        this.load.audio('hurt', 'assets/sounds/hurt.wav');
        this.load.audio('jump', 'assets/sounds/jump.wav'); 
        this.load.audio('attack', 'assets/sounds/attack.mp3');
        this.load.audio('deathThief', 'assets/sounds/death_thief.mp3');
        this.load.audio('deathPig', 'assets/sounds/death_pig.mp3');
        this.load.audio('deathEvilPig', 'assets/sounds/death_evil_pig.mp3');
        this.load.audio('power_up', 'assets/sounds/power_up.wav');
        this.load.audio('teleport', 'assets/sounds/teleport.wav');
        this.load.audio('win', 'assets/sounds/win.wav');
        this.load.audio('mysteryMusic', 'assets/sounds/music.mp3');
        this.load.audio('bush', 'assets/sounds/bush.mp3');
        this.load.audio('jumpscare', 'assets/sounds/jumpscare.mp3');
        this.load.audio('gameOver', 'assets/sounds/game_over.mp3');
        this.load.audio('scurry', 'assets/sounds/scurry.mp3');

        // INGREDIENTS
        this.load.image('flour', 'assets/sprites/flour.png');
        this.load.image('water', 'assets/sprites/water.png');
        this.load.image('pork', 'assets/sprites/pork.png');
        this.load.image('cabbage', 'assets/sprites/cabbage.png');
        this.load.image('onion', 'assets/sprites/onion.png');

        this.load.image('dumplings', 'assets/sprites/dumplings.png');
        this.load.image('badDumplings', 'assets/sprites/bad_dumplings.jpeg');

        // PROJECTILES
        this.load.image('projectile', 'assets/sprites/projectile.png');
    }

    create() {
        // menu text
        this.add.text(480, 100, "DUMPLING HUNTER SIMULATOR", {fontSize: "64px", color: "#ffffffff"}).setOrigin(0.5);

        this.add.text(480, 200, 'Select level',
        { fontSize: 24, color: '#fff' }).setOrigin(0.5);

        this.add.text(480, 260, '[1] Kevin\'s Level\n[2] Sam\'s Level',
        { fontSize: 18, color: 'rgba(255, 255, 255, 1)', align: 'left' }).setOrigin(0.5);

        this.add.text(480, 400, '  -=|Controls|=- \n[WASD] Movement\n[J] Attack',
        { fontSize: 16, color: '#ffffffff', align: 'left' }).setOrigin(0.5);

        

        
        // music start
        let mus = this.sound.get('mysteryMusic');
        if (!mus) {
            mus = this.sound.add('mysteryMusic', {loop: true});
            mus.play();
        }
        

        // start level
        this.input.keyboard.on('keydown-ONE', () => this.scene.start('StartLevelKevin'));
        this.input.keyboard.on('keydown-TWO', () => this.scene.start('StartLevelSam'));
    }
}