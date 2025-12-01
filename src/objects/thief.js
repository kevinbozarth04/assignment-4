// thief.js

export default class Thief extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, x, y) {
        super(scene, x, y, 'thief');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.player = player;

        this.body.setAllowGravity(false);
        this.setDepth(20);
        this.setScale(0.8);
        this.body.setCollideWorldBounds(true);
        scene.physics.add.collider(this, scene.layers["obstacle"]);

        // Damage player on touch
        scene.physics.add.overlap(player, this, () => {
            this.player.die();
        });

        this.speed = 100;
        this.direction = 1; // Future use
    }

    die() {
        this.scene.sound.play('deathThief', { volume: 1 });
        this.destroy();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.setVelocity(0);
    }
}