// thief.js
// Unique AI: Hides behind a tree until the player gets close enough. Then it'll jump out at you

export default class Thief extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, player, x, y, hideSpots = []) {
        super(scene, x, y, 'thief');
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.scene = scene;
        this.player = player;
        this.attack = 1;

        this.body.setAllowGravity(false);
        this.setDepth(20);
        this.setScale(1);
        this.body.setCollideWorldBounds(true);
        scene.physics.add.collider(this, scene.layers["obstacle"]);

        // Damage player on touch
        scene.physics.add.overlap(player, this, () => {
            this.player.die(this.attack);
        });

        // AI behavior
        this.baseSpeed = 120; // normal run speed
        this.burstSpeed = 220; // short burst of speed when ambushing
        this.speed = this.baseSpeed;

        this.detectionRadius = 120; // start chasing
        this.lostRadius = 220; // stop chasing
        this.arriveRadius = 8;

        this.burstDuration = 200; // ms of burst speed
        this.burstRemaining = 0; // countdown in ms
        
        // initial hiding spot
        this.hideSpots = hideSpots
        this.currentHideSpot = this.findNearestHideSpot(x, y) || {x, y};
        this.state = 'hiding';
        this.setPosition(this.currentHideSpot.x, this.currentHideSpot.y);
    }

    findNearestHideSpot(x, y) {
        if (!this.hideSpots || this.hideSpots.length === 0) return null;
        let best = null;
        let bestDist = Infinity;

        for (const spot of this.hideSpots) {
            const dx = spot.x - x;
            const dy = spot.y - y;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestDist) {
                bestDist = d2;
                best = spot;
            }
        }
        return best;
    }

    die() {
        this.scene.sound.play('deathThief', { volume: 1 });
        this.destroy();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);
        
        const px = this.player.x;
        const py = this.player.y;
        const dx = px - this.x;
        const dy = py - this.y;
        const dist = Math.hypot(dx, dy);

        // behavior decision
        switch (this.state) {
            case 'hiding':
                this.body.setVelocity(0, 0); // stay still until...
                if (dist < this.detectionRadius) { // player gets too close
                    this.scene.sound.play('jumpscare', {volume: 1});
                    this.state = 'chasing'; // then CHASE
                    this.burstRemaining = this.burstDuration;
                }
                break;

            case 'chasing':
                // decide current speed
                let speed = this.baseSpeed;
                if (this.burstRemaining > 0) {
                    speed = this.burstSpeed;
                    this.burstRemaining -= delta;
                }
                if (dist > 0) { // move toward player
                    const ux = dx / dist;
                    const uy = dy / dist;
                    this.body.setVelocity(ux * speed, uy * speed);
                }
                if (dist > this.lostRadius) { // if player too far
                    this.currentHideSpot = this.findNearestHideSpot(this.x, this.y) || this.currentHideSpot;
                    this.state = 'returning'; // stop chasing and go to nearest tree
                }
                break;

            case 'returning':
                if (!this.currentHideSpot) { // if not already at hiding spot, go there
                    this.state = 'hiding'; // stay still
                    this.body.setVelocity(0, 0); // chill bro
                    break;
                }
                // locate hiding spot and direction to travel
                const tx = this.currentHideSpot.x;
                const ty = this.currentHideSpot.y;
                const rdx = tx - this.x;
                const rdy = ty - this.y;
                const rdist = Math.hypot(rdx, rdy);

                if (rdist > this.arriveRadius) { // move toward hiding spot
                    const ux2 = rdx / rdist;
                    const uy2 = rdy / rdist;
                    this.body.setVelocity(ux2 * this.baseSpeed*3, uy2 * this.baseSpeed*3); // return to tree FAST
                } else {
                    // snap to exact spot and hide again
                    this.setPosition(tx, ty);
                    this.body.setVelocity(0, 0);
                    this.state = 'hiding';
                    this.burstRemaining = 0; // reset burst
                }

                if (dist < this.detectionRadius) { // if player gets close again mid-return, re-chase
                    this.state = 'chasing';
                    this.burstRemaining = this.burstDuration;
                }
                break;
        }
        this.setFlipX(this.body.velocity.x < 0);
    }
}