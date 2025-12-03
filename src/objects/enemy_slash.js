export default class enemy_slash extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, enemy, offsetX, offsetY, player) {
        super(scene, enemy.x, enemy.y, 'slash');

        this.scene = scene;
        this.enemy = enemy;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.player = player;

        scene.sound.play('attack');

        // add slash to world + physics
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setScale(0.5);
        this.setDepth(25);

        // slash at player
        this.scene.physics.add.collider(this.player, this, () => {
            this.player.die(this.enemy.attack);
        })

        // animation
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('slash', { start: 0, end: 8 }),
            frameRate: 40,
            repeat: 0
        });
        this.play('attack');

        // destroy slash after some ms
        scene.time.delayedCall(200, () => {
            this.destroy();
            this.enemy.attacking = false;
        });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.setFlipX(false);
        this.setFlipY(false);
        this.setAngle(0);

        switch (this.enemy.facing) {
            case 'left':
                this.setFlipX(true);
                this.body.setSize(40, 25);
                this.x = this.enemy.x - this.offsetX;
                this.y = this.enemy.y;
                break;
            case 'right':
                this.setFlipX(false);
                this.body.setSize(40, 25);
                this.x = this.enemy.x + this.offsetX;
                this.y = this.enemy.y;
                break;

            case 'up':
                this.setAngle(-90);
                this.body.setSize(25, 40);
                this.x = this.enemy.x;
                this.y = this.enemy.y - this.offsetY;
                break;

            case 'down':
                this.setAngle(90);
                this.body.setSize(25, 40);
                this.x = this.enemy.x;
                this.y = this.enemy.y + this.offsetY;
                break;
        }
    }
}