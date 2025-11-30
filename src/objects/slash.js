export default class slash extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, offsetX, offsetY, enemies) {
        super(scene, player.x, player.y, 'slash', 0);

        this.scene = scene;
        this.player = player;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        scene.sound.play('attack');  

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(60, 20);
        this.setDepth(25);    
        this.body.setAllowGravity(false);
        this.body.setOffset(35, 8);
        this.setScale(0.6);

        if(enemies){
            enemies.forEach(enemy => {
                scene.physics.add.collider(enemy, this, () => {enemy.die();});
            });
        }

        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('slash', { start: 0, end: 8 }),
            frameRate: 20,
            repeat: 0
        });
        this.play('attack');

        scene.time.delayedCall(400, () => {this.destroy(); this.player.attacking = false;}, [], this);
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if (this.player.flipX) {
            this.setFlipX(true);
            this.x = this.player.x - this.offsetX;
        } else {
            this.setFlipX(false);
            this.x = this.player.x + this.offsetX;
        }
        this.y = this.player.y + this.offsetY;
    }
}