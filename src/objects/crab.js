import enemy_slash from "./enemy_slash.js";

export default class Crab extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, player, x, y){
        super(scene, x, y, 'crab');

        this.scene = scene;
        this.player = player;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setDepth(20);
        this.body.setCollideWorldBounds(true);

        this.setScale(0.008);

        this.speed = 150;
        this.meleeRadius = 50;
        this.attack = 0.5;
        this.attackRate = 3000;
        this.state = 'moving';
        this.lastAttack = 0;
        this.attacking = false;
        this.teleportTarget = {x: this.player.x, y: this.player.y};

    }

    teleport(){
        this.state = 'teleport';
        this.teleportTarget.x = this.player.x * 2;
        this.teleportTarget.y = this.player.y * 2;
        
        if(this.x > this.teleportTarget.x && this.y > this.teleportTarget.y){
            while(this.x > this.teleportTarget.x && this.y > this.teleportTarget.y){
                this.body.setVelocity(-10000, -10000);
            }
        }

        else if(this.x < this.teleportTarget.x && this.y > this.teleportTarget.y){
            while(this.x < this.teleportTarget.x && this.y > this.teleportTarget.y){
                this.body.setVelocity(10000, -10000);
            }
        }
        
        else if(this.x > this.teleportTarget.x && this.y < this.teleportTarget.y){
            while(this.x > this.teleportTarget.x && this.y < this.teleportTarget.y){
                this.body.setVelocity(-10000, 10000);
            }
        }

        else if(this.x < this.teleportTarget.x && this.y < this.teleportTarget.y){
            while(this.x < this.teleportTarget.x && this.y < this.teleportTarget.y){
                this.body.setVelocity(10000, 10000);
            }
        }

        return this.state = 'moving';
    }
    

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        const random = Phaser.Math.Between(1, 10000);
        const px = this.player.x;
        const py = this.player.y;

        const distanceX = px - this.x;
        const distanceY = py - this.y;
        const distance = Math.hypot(distanceX, distanceY);

        if(this.state == 'moving'){
            this.body.setVelocity(
                (distanceX / distance) * this.speed,
                (distanceY / distance) * this.speed
            );
            
            if(distance <= this.meleeRadius){
                if(this.attackRate + this.lastAttack < time && !this.attacking){
                    this.lastAttack = time;
                    this.attacking = true;
                    new enemy_slash(this.scene, this, 20, 20, this.player);
                }
            }

            //if(random > 400 && random < 500){
            //    this.teleport();
                //if(!this.teleport){
                //    this.state = 'moving';
                //}
            //}

        }
    }
}

