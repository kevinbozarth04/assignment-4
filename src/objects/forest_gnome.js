

export default class Forest_Gnome extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, player, x, y){
        super(scene, x, y, 'forestGnome');

        this.player = player;
        this.scene = scene;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.body.setCollideWorldBounds(true);
        this.setScale(0.005)

        this.state = 'idle';
        this.scatterTimer = 300;
        this.lastScatter = 0;
        this.scatterRadius = 150;
        this.followRadius = 300;
        this.returnRadius = 400;
        this.speed = 50;
        this.attack = 1;
        this.initialX = x;
        this.initialY = y;

        this.setDepth(20);

        this.scene.physics.add.overlap(this.player, this, () =>{
            if(this.state == 'follow'){
                this.player.die(this.attack);
            }
        });



    }

    die(){
        this.destroy();
    }

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        const px = this.player.x;
        const py = this.player.y;

        const distanceX = px - this.x;
        const distanceY = py - this.y;
        const distance = Math.hypot(distanceX, distanceY);

        const returnDistanceX = this.initialX - this.x;
        const returnDistanceY = this.initialY - this.y;
        const returnDistance = Math.hypot(returnDistanceX, returnDistanceY);

        if(this.state == 'idle'){
            this.body.setVelocity(0,0);
        }

        if(distance < this.scatterRadius && this.scene.flour.got == false){
            this.state = 'scatter';
        }

        if(this.state == 'scatter'){
            if(this.scatterTimer + this.lastScatter < time){
                let randomD = Phaser.Math.Between(1, 8);
                if(randomD == 1 || randomD == 2){
                    this.body.setVelocity(-this.speed, 0);
                }
                else if(randomD == 3 || this.randomD == 4){
                    this.body.setVelocity(0, -this.speed);
                }
                else if(randomD == 5 || randomD == 6){
                    this.body.setVelocity(this.speed, 0);
                }
                else if(randomD == 7 || randomD == 8){
                    this.body.setVelocity(0, this.speed);
                }
                this.lastScatter = time;
            }

            if(distance > this.returnRadius){
                this.state = 'return';
            }
        }

        if(this.state == 'return'){
            this.body.setVelocity(
                (returnDistanceX / returnDistance) * this.speed/2,
                (returnDistanceY / returnDistance) * this.speed/2
            );
        }

        if(this.state == 'return' && this.x == this.initialX && this.y == this.initialY){
            this.state = 'idle';
        }

        if(this.scene.flour.got == true && distance < this.followRadius){
            this.state = 'follow';
        }

        if(this.state == 'follow'){
            this.body.setVelocity(
                (distanceX / distance) * this.speed,
                (distanceY / distance) * this.speed
            );

            if(distance > this.returnRadius){
                this.state = 'return';
            }
        }

    }
}