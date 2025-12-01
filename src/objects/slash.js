// slash.js

export default class slash extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, offsetX, offsetY, enemies) {
        super(scene, player.x, player.y, 'slash', 0);

        this.scene = scene;
        this.player = player;
        this.offsetX = offsetX;
        this.offsetY = offsetY;

        scene.sound.play('attack');

        // add slash to world + physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setScale(1);
        this.setDepth(25);

        // kill npc thief, pig, evil pig
        if (enemies && enemies.length) {
            enemies.forEach(enemy => {
                scene.physics.add.collider(enemy, this, () => {
                    if (enemy && enemy.active && enemy.die) {
                        enemy.die();
                    }
                });
            });
        }

        // animation
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('slash', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: 0
        });
        this.play('attack');

        // destroy slash after 400 ms
        scene.time.delayedCall(400, () => {
            this.destroy();
            this.player.attacking = false;
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.setFlipX(false);
        this.setFlipY(false);
        this.setAngle(0);

        switch (this.player.facing) {
            case 'left':
                this.setFlipX(true);
                this.body.setSize(40, 25);
                this.x = this.player.x - this.offsetX;
                this.y = this.player.y;
                break;
            case 'right':
                this.setFlipX(false);
                this.body.setSize(40, 25);
                this.x = this.player.x + this.offsetX;
                this.y = this.player.y;
                break;

            case 'up':
                this.setAngle(-90);
                this.body.setSize(25, 40);
                this.x = this.player.x;
                this.y = this.player.y - this.offsetY;
                break;

            case 'down':
                this.setAngle(90);
                this.body.setSize(25, 40);
                this.x = this.player.x;
                this.y = this.player.y + this.offsetY;
                break;
        }
    }
}