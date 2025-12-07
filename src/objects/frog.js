import Bullet from './bullet.js'

export default class Frog extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, player, x, y){
        super(scene, x, y, 'frog');

        this.player = player;
        this.scene = scene;
        this.setScale(0.007)

        this.initialX = this.x;
        this.initialY = this.y;

        this.speed = 80;
        this.state = 'idle';
        this.attackRate = 3300;
        this.lastAttack = 0;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setDepth(20);
        this.body.setCollideWorldBounds(true);


    }

    die(){
        this.destroy();
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        const px = this.player.x;
        const py = this.player.y;
        let random = Phaser.Math.Between(1, 1000);

        const distanceX = px - this.x;
        const distanceY = py - this.y;
        const distance = Math.hypot(distanceX, distanceY);

        const returnDistanceX = this.initialX - this.x;
        const returnDistanceY = this.initialY - this.y;
        const returnDistance = Math.hypot(returnDistanceX, returnDistanceY);

        const direction = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);

        if(distance < 200){
            this.state = 'follow';
        }

        if(this.state == 'idle'){
            this.body.setVelocity(0, 0);
        }

        if(this.state == 'follow'){
            this.shot = false;
            this.body.setVelocity(
                (distanceX / distance) * this.speed,
                (distanceY / distance) * this.speed
            );

            if(this.attackRate + this.lastAttack < time){
                this.state = 'attack';
            }

            if(distance > 200){
                this.body.setVelocity(0,0);
                this.scene.time.delayedCall(500, () =>{
                    this.state = 'return';
                });
            }
        }

        if(this.state == 'attack'){
            this.body.setVelocity(0, 0);
            this.state == 'attacking';
            
            this.scene.time.delayedCall(200, () =>{
                var fBullet = new Bullet(this.scene, this.x, this.y, direction);
                this.scene.frog_bullet.add(fBullet);
                this.lastAttack = time;
            });
            
            this.scene.time.delayedCall(300, () =>{
                this.state = 'follow';
            });
        }

        if(this.state == 'return'){
            this.body.setVelocity(
                (returnDistanceX / returnDistance) * this.speed/2,
                (returnDistanceY / returnDistance) * this.speed/2
            );
        }

        if(this.state == 'return' && this.x == this.initialX && this.y == this.initialY){
            this.body.setVelocity(0,0);
            this.state = 'idle';
        }
    }
}