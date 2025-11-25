// "Every great game begins with a single scene. Let's make this one unforgettable!"
export class YouWin extends Phaser.Scene {
    constructor() {
        super('YouWin');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        
    }

    create() {
        this.background = this.add.sprite(640, 320, 'background');
        this.add.text(640, 300, 'YOU WON.', { fontSize: '128px', fill: '#FFF', align: "center" }).setOrigin(0.5,0.5);
        this.add.text(640, 440, 'GG WP', { fontSize: '78px', fill: '#FFF', align: "center" }).setOrigin(0.5,0.5);
    }

}
