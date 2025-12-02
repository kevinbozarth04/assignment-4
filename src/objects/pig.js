// pig.js
// Unique AI: Runs away from the player only if you're too close

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
        this.body.onWorldBounds = true;

        this.setScale(0.53);
        this.setDepth(20);

        scene.physics.add.collider(this, scene.layers["obstacle"]);

        // AI
        this.speed = 250; // how fast it runs when moving
        this.fleeRadius = 52; // run away if player is too close
        this.stopRadius = 100; // stop running once player is far enough away
        this.state = 'idle'; // state 'idle' or 'flee'

        // if pig disappears into the bushes on the edge of the map, it reappears elsewhere
        scene.physics.world.on("worldbounds", (body) => {
            if (body.gameObject === this) {
                this.relocate();
            }
        });
    }

    relocate() {
        this.scene.sound.play('bush');
        this.setPosition(Phaser.Math.Between(40, 760), Phaser.Math.Between(40, 760))
    }

    die() {
        if (!this.active) return;
        this.scene.sound.play('deathPig');

        // drop pork
        const pork = this.scene.add.sprite(this.x, this.y, 'pork').setScale(0.005).setDepth(3);
        this.scene.ingredients.add(pork);
        this.scene.physics.add.existing(pork);

        this.destroy();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        const px = this.player.x;
        const py = this.player.y;

        const dx = px - this.x;
        const dy = py - this.y;
        const len = Math.hypot(dx, dy);

        // determine behavior based on player's distance
        if (this.state === 'idle') {
            this.body.setVelocity(0, 0);

            if (len < this.fleeRadius) {
                this.scene.sound.play('scurry');
                this.state = 'flee';
            }

        } else if (this.state === 'flee') {
            if (len > this.stopRadius) { // if far, stop
                this.state = 'idle';
                this.body.setVelocity(0, 0);
            } else {
                const ux = dx / len; // RUN
                const uy = dy / len;
                this.body.setVelocity(-ux * this.speed, -uy * this.speed);
            }
        }
        this.setFlipX(this.body.velocity.x < 0);
    }
}
