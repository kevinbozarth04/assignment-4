// win.js

export default class Win extends Phaser.Scene {
    constructor() {
        super('Win');
    }

    preload() {   
    }

    create() {
        const dumplings = this.add.sprite(400, 170, 'dumplings').setScale(0.4);
        this.add.text(400, 300, 'YOU WON', { fontSize: '128px', fill: '#00bc09ff', align: "center" }).setOrigin(0.5,0.5);
        this.add.text(400, 440, '[R] Restart', { fontSize: '78px', fill: '#ffffffff', align: "center" }).setOrigin(0.5, 0.5);
        this.sound.play("win");
        this.input.keyboard.once('keydown-R', () => {
            this.scene.start("Start"); // go back to level select
        });
    }
}
