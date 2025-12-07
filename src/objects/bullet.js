export default class Bullet extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, direction){
         super(scene, x, y, "projectile");
         scene.add.existing(this);
         scene.physics.add.existing(this);
         this.direction = direction;
         this.setDepth(4);
         this.setScale(0.06);
         this.scene = scene;
         this.last_time = this.scene.time.now;
         this.speed = 200;
         this.damage = 1;
         this.scene.time.delayedCall(10000, () => this.destroy());
    }

    preUpdate(time)
    {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;

        this.x += Math.cos(this.direction)*this.speed*dt;
        this.y += Math.sin(this.direction)*this.speed*dt;
        this.rotation += 15*dt;
    }
}