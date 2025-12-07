import enemy_slash from "./enemy_slash.js";

export default class Crab extends Phaser.Physics.Arcade.Sprite{
    constructor(scene, player, x, y){
        super(scene, x, y, 'crab');

        this.player = player;

        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false);
        this.setDepth(20);
        this.body.setCollideWorldBounds(true);

        this.setScale(0.008);

        this.speed = 50;
        this.meleeRadius = 50;
        this.attack = 0.5;
        this.attackRate = 3000;
        this.state = 'moving';
        this.lastAttack = 0;
        this.attacking = false;
        //this.teleportTarget = {x: this.player.x, y: this.player.y};
        this.teleportTime = 2000;
        this.teleportLast = 0;
        this.health = 3;
        this.setImmune = false;

    }

    die(){
        if(this.health > 0 && this.setImmune == false){
            this.health -= 1;
            this.setImmune = true;
        }
        else{
            this.destroy();
        } 
        //this.scene.time.delayedCall(300, () => {
            //this.setImmune = false;
        //});
        this.setImmune = false;
    }

    teleport(dx, dy){
        if(this.x > this.player.x && this.y > this.player.y){
            this.x = this.player.x - dx;
            this.y = this.player.y - dy;
        }

        else if(this.x < this.player.x && this.y > this.player.y){
            this.x = this.player.x + dx;
            this.y = this.player.y - dy;
        }
        
        else if(this.x > this.player.x && this.y < this.player.y){
            this.x = this.player.x - dx;
            this.y = this.player.y + dy;
        }

        else if(this.x < this.player.x && this.y < this.player.y){
            this.x = this.player.x + dx;
            this.y = this.player.y + dy;
        }
        this.state = 'moving';
    }
    

    preUpdate(time, delta){
        super.preUpdate(time, delta);

        const px = this.player.x;
        const py = this.player.y;
        let random = Phaser.Math.Between(1, 1000);

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

            if(this.teleportTime + this.teleportLast < time){
                if(random > 700){
                    this.state = 'teleporting';
                    if(this.state == 'teleporting'){
                        this.teleport(Math.abs(distanceX), Math.abs(distanceY));
                        this.state = 'moving';
                    }
                }
                this.teleportLast = time;
            }

        }
    }
}

