// evilPig.js
// Unique AI: Has infite eye sight. Knows where you are on the map at all times and will go in a straight line towards you. It's not smart though so it doesn't know how to go around obstacles

export default class EvilPig extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, x, y) {
        super(scene, x, y, 'evilPig');

        this.scene = scene;
        this.player = player;

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        //this.body.setSize(20, 20).setOffset(0, 0);
        this.setScale(0.7);
        this.setDepth(20);

        scene.physics.add.collider(this, scene.layers["obstacle"]);

        // Hurt player on touch
        scene.physics.add.overlap(player, this, () => {
            if (!this.active) return;
            this.player.die();
        });

        this.speed = 80;

    }

    die() {
        if (!this.active) return;
        this.scene.sound.play('deathEvilPig'); // reuse same sound
        this.destroy();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const px = this.player.x;
        const py = this.player.y;

        const dx = px - this.x;
        const dy = py - this.y;

        // Normalize direction
        const len = Math.hypot(dx, dy);

        if (len > 0) {
            this.body.setVelocity(
                (dx / len) * this.speed,
                (dy / len) * this.speed
            );
        }

        // Flip sprite depending on direction
        this.setFlipX(this.body.velocity.x < 0);
    }
}
