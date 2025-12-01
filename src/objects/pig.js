// pig.js

export default class Pig extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, x, y) {
        super(scene, x, y, 'pig');

        this.scene = scene;
        this.player = player;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setImmovable(true);
        this.body.pushable = false;

        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        //this.body.setSize(20, 20).setOffset(0, 0); // adjust if needed
        this.setScale(0.4);
        this.setDepth(20);

        // Collide with obstacle layer
        scene.physics.add.collider(this, scene.layers["obstacle"]);
        //scene.physics.add.overlap(this, scene.layers["obstacle"]);


        this.speed = 0;
    }

    die() {
        if (!this.active) return;
        this.scene.sound.play('deathPig');
        this.destroy();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const px = this.player.x;
        const py = this.player.y;

        const dx = px - this.x;
        const dy = py - this.y;
        const len = Math.hypot(dx, dy);

        if (len > 0) {
            this.body.setVelocity(
                -(dx / len) * this.speed,
                -(dy / len) * this.speed
            );
        }
        this.setFlipX(this.body.velocity.x < 0);
    }
}
