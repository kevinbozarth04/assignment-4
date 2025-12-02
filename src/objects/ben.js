// ben.js

import slash from './slash.js';
export default class Ben extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'ben', 0);
        this.scene = scene;
        this.spawnPoint = { x, y };
        this.speed = 200;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setAllowGravity(false); // no gravity
        this.setCollideWorldBounds(true); // world bound collisions
        this.body.setSize(30, 30).setOffset(0, 0); // top-down style hitbox
        this.setScale(0.7) // size
        this.attacking = false; // attack
        this.hp = 3; // health
        this.facing = 'right'; // default facing

        // CONTROLS
        this.keys = scene.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            attack: Phaser.Input.Keyboard.KeyCodes.J,
            cook: Phaser.Input.Keyboard.KeyCodes.C
        });

    }

    die() {
        this.hp -= 1;
        this.scene.healthText.setText("Lives: " + this.hp);
        if (this.hp <= 0) {
            this.scene.scene.start("GameOver"); // game over screen
            return;
        }
        this.scene.sound.play('hurt');
        this.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    }


 
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        let vx = 0;
        let vy = 0;

        // Movement Controls (WASD)
        if (this.keys.left.isDown)  vx = -this.speed;
        if (this.keys.right.isDown) vx =  this.speed;
        if (this.keys.up.isDown)    vy = -this.speed;
        if (this.keys.down.isDown)  vy =  this.speed;

        // Determine facing direction
        if (vx < 0) {this.facing = 'left'; this.setAngle(180);}
        else if (vx > 0) {this.facing = 'right'; this.setAngle(0);}
        else if (vy < 0) {this.facing = 'up'; this.setAngle(-90);}
        else if (vy > 0) {this.facing = 'down'; this.setAngle(90);}

        // Normalize diagonal movement
        if (vx !== 0 && vy !== 0) {
            vx *= Math.SQRT1_2;
            vy *= Math.SQRT1_2;
        }

        // Apply movement
        this.setVelocity(vx, vy);

        // Attacking
        if (Phaser.Input.Keyboard.JustDown(this.keys.attack) && !this.attacking) {
            this.attacking = true;
            new slash(this.scene, this, 20, 20, this.scene.enemies);
        }
    }
}
