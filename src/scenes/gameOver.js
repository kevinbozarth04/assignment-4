// gameOver.js

export default class GameOver extends Phaser.Scene {
    constructor() {
        super("GameOver");
    }

    create() {
        const badDumplings = this.add.sprite(400, 170, 'badDumplings').setScale(3);
        this.add.text(480, 250, "GAME OVER\n (noob)", {fontSize: "64px", color: "#ff0000"}).setOrigin(0.5);
        this.add.text(400, 440, '[R] Restart', { fontSize: '78px', fill: '#FFF', align: "center" }).setOrigin(0.5, 0.5);
        this.sound.play("gameOver");
        this.input.keyboard.once('keydown-R', () => {
            this.scene.start("Start"); // go back to level select
        });
    }
}