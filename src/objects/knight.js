// knight.js
// This is the player sprite that the player can control.
// Left and right: A D
// Jump: Space
// Attack: Left click (Vee you can decide this one since ur making the enemy level)
import slash from './slash.js';
export default class Knight extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y, 'knight', 0);
        this.spawnPoint = { x: x, y: y };
        this.scene = scene;
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.speed = 150;
        this.setCollideWorldBounds(true);
        this.setMaxVelocity(300, 1000);
        this.setDragX(1200);
        this.body.setSize(18, 28).setOffset(7, 4); // should modify to be ~1 pixel tall and < 1 pixel wide
        this.coyoteTime = 200;
        this.coyoteTimeCounter = 0; //ms
        this.coinCount = 0;
        this.deathsCount = 0;
        this.attacking = false;
        this.slimesKilled = 0;

        // CONTROLS
        this.keys = scene.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
            attack: Phaser.Input.Keyboard.KeyCodes.J
        });

        this.body.setSize(10, 20, true);
        this.body.setOffset(12, 8);
        this.createDustEmitter();
    }
    die(){
        this.scene.sound.play('hurt');
        this.deathsCount++;
        this.setPosition(this.spawnPoint.x, this.spawnPoint.y);
    }

    createDustEmitter() {
        this.dustEmitter = this.scene.add.particles(this.x, this.y, 'dust', {
            quantity: 1,
            speedX: { min: 0, max: 100 },
            speedY: { min: 0, max: 0 },
            lifespan: 600,
            alpha: { start: 0.5, end: 0 },
            scale: { start: 0.4, end: 0 },
            gravityY: 50,
            emitting: false
        });

        this.dustEmitterJump = this.scene.add.particles(this.x, this.y, 'dust', {
            quantity: 1,
            speedX: { min: -55, max: 55 },
            speedY: { min: 0, max: 55 },
            lifespan: 600,
            alpha: { start: 0.5, end: 0 },
            scale: { start: 0.4, end: 0 },
            gravityY: 50,
            emitting: false
        });

        this.dustEmitter.setDepth(9999);
        this.dustEmitterJump.setDepth(9999);
    }

    

    emitDustIfMoving() {
        

        const vx = Math.abs(this.body.velocity.x);

        // Only emit when grounded and moving fast enough
        if (vx < 11 || !this.onGround) {
            this.dustEmitter.emitting = false;
            return;
        }



        // Position dust slightly behind the player
        const offset = this.flipX ? 10 : -10;

        if(!this.flipX) this.dustEmitter.setScale(-1, 1);
        if(this.flipX) this.dustEmitter.setScale(1, 1);
        this.dustEmitter.setPosition(this.x + offset, this.y + 12);

        // Start emitting
        this.dustEmitter.emitting = true;
    }
    // Ground collision
    get onGround() {
        return this.body.blocked.down || this.body.touching.down; // taught in lecture
    }

    jump(force, disableGravity = 0, sound = true) {


        
        if (!(this.onGround || this.coyoteTimeCounter < this.coyoteTime)) return;

        this.dustEmitterJump.emitting = true;
        this.dustEmitterJump.setPosition(this.x, this.y + 12);
        this.scene.time.delayedCall(300, () => {this.dustEmitterJump.emitting = false;}, [], this.scene);
        
        this.coyoteTimeCounter = this.coyoteTime*2; // reset coyote time        
        this.body.setAllowGravity(false);
        this.scene.time.delayedCall(disableGravity, () => {this.body.setAllowGravity(true);}, [], this.scene);
        this.setVelocityY(-force);
        if(sound) this.scene.sound.play('jump', { volume: 0.5 });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        if(this.onGround){ this.coyoteTimeCounter = 0;}
        else{this.coyoteTimeCounter += delta;}
        
        // Horizontal
        if (this.keys.left.isDown) {
            
            this.setAccelerationX(-this.speed * 5);
            this.setFlipX(true);
            if(this.body.blocked.left && this.body.velocity.y >= 0){
                this.jump(222, 0, false);
            }
 
        } else if (this.keys.right.isDown) {
            this.setAccelerationX(this.speed * 5);
            this.setFlipX(false);
            if(this.body.blocked.right && this.body.velocity.y >= 0){
                this.jump(222, 0, false);
            }
     
        } else {
            this.setAccelerationX(0);
        }

        // Jump (grounded only)
        if (Phaser.Input.Keyboard.JustDown(this.keys.jump)) {
            this.jump(500, 0);
        }

        // Anti wall-sticking when airborne and pushing into a wall
        if (!this.onGround && (this.body.blocked.left || this.body.blocked.right)) {
            this.setAccelerationX(0);
            this.setVelocityX(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.keys.attack) && !this.attacking) {
            this.attacking = true;
            new slash(this.scene, this, 10, 0, this.scene.enemies);
        }

        this.emitDustIfMoving();
    }
}
