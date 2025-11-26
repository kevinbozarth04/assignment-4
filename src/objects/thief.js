export default class Thief extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, x, y, minX, maxX) {
        super(scene, x, y, 'thief');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.player = player;

        this.body.setSize(16, 16).setOffset(0, 0); 
        this.setDepth(20);    
        this.setScale(1);
        this.body.setCollideWorldBounds(true);
        scene.physics.add.collider(this, scene.layers["ground"]);

        scene.physics.add.collider(player, this, () => {
          this.player.die();
        });

        

        this.minX = minX;
        this.maxX = maxX;
        this.speed = 100;
        this.direction = 1; // 1 for right, -1 for left
    }

    die(){
        this.scene.sound.play('thiefDeath', { volume: 10 });
        this.destroy();
    }

    preUpdate() {
        super.preUpdate();
        this.setVelocityX(this.speed * this.direction);

        if (this.x >= this.maxX-19) {
            this.direction = -1;
        } else if (this.x <= this.minX+19) {
            this.direction = 1;
        }
    }
}