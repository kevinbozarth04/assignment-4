export default class coin extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, x, y) {
        super(scene, x, y, 'coin', 0);
        this.scene = scene;
        this.player = player;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setSize(8, 8).setOffset(4, 4); 
        this.setDepth(22);    
        this.body.setAllowGravity(false);
        scene.physics.add.collider(player, this, () => {
          this.pickup();
        });

        this.anims.create({
            key: 'spin',
            frames: this.anims.generateFrameNumbers('coin', { start: 0, end: 11 }),
            frameRate: 10,
            repeat: -1
        });
        this.play('spin');
    }


    pickup(){
        this.player.coinCount++;
        this.scene.sound.play('coin');    
        this.destroy();
    }
}