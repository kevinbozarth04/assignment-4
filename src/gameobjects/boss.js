// boss.js
// delete this file later. we'll use this as a guide to implement enemy AI

import {Bullet} from "./bullet.js";
import {HealthBar} from "./HealthBar.js"

const STATE = {
        IDLE: "idle",
        MOVETOPLAYER: "Move towards play",
        MOVEAWAY: "Move away from player",
        MOVETOCENTER: "Move to the center",
        MELEE: "Melee attack",
        FIREBALL: "Fireball",
        HEAL: "Self heal"
    };

export class Boss extends Phaser.GameObjects.Sprite {
    

    constructor(scene, x, y, which, direction, speed, bullet_speed, damage, time){
         super(scene, x, y, which);
         scene.add.existing(this);
         scene.physics.add.existing(this);
         this.setDepth(5);
         this.direction = Phaser.Math.DegToRad(direction);
         this.scene = scene;
         this.speed = Math.min(speed * 0.25, 150);
         this.rotation = this.direction;
         this.bullet_speed = Math.min(bullet_speed*0.5, 500);
         this.damage = damage;
         this.target = {x: this.x, y: this.y};
         this.last_attack = time + Math.random()*this.attack_rate;
         this.dot = scene.add.sprite(0, 0, "dot");
         this.dot.setDepth(6);
         this.mana = 100;
         this.hp = 100;
         this.mps = 2; // mana regeneration per second
         this.state = STATE.IDLE;
         this.abilities = {melee: {last_attack: time + Math.random()*4000, attack_rate: 2000, mana: 0},
                           fireball: {last_attack: time + Math.random()*5000, attack_rate: 5000, mana: 30},
                           heal: {last_attack: time + Math.random()*30000, attack_rate: 30000, mana: 85}};
         this.actionmap = {};
         this.actionmap[STATE.IDLE] = (time) => this.idle(time);
         this.actionmap[STATE.MOVETOPLAYER] = (time) => this.moveToPlayer(time);
         this.actionmap[STATE.MOVEAWAY] = (time) => this.moveAway(time);
         this.actionmap[STATE.MOVETOCENTER] = (time) => this.moveToCenter(time);
         this.actionmap[STATE.MELEE] = (time) => this.meleeAttack(time);
         this.actionmap[STATE.FIREBALL] = (time) => this.fireball(time);
         this.actionmap[STATE.HEAL] = (time) => this.heal(time);
         this.healthbar = new HealthBar(scene, 640, 40);
         this.manabar = new HealthBar(scene, 640, 70, 0x0000ff, 600, 10, 1);
         this.isboss = true;
         this.name = "MONSTER";
         this.incombat = false;
         this.scene.time.delayedCall(1500, () => this.incombat = true);
    }

    takeDamage(amount)
    {
        this.hp -= amount;
        this.healthbar.decrease(Math.min(amount, this.hp));
        if (this.hp <= 0.1){
            this.hp = 0;
            return true;
        }
        return false;
    }

    canPerform(time, ability, update=true)
    {
        if (ability.last_attack + ability.attack_rate > time) return false;
        if (this.mana < ability.mana) return false;
        if (update)
        {
            ability.last_attack = time;
            this.mana -= ability.mana;
            this.manabar.decrease(ability.mana);
        }
        return true;
    }

    meleeAttack(time)
    {
        if (!this.canPerform(time, this.abilities.melee)) return;
        const burstSprite = this.scene.add.sprite(this.x, this.y, 'fire1');
		burstSprite.setDepth(4);
		burstSprite.setScale(0.1);
		burstSprite.alpha = 1;
        burstSprite.tint = 0xff0000;
		this.scene.tweens.add({
			targets: burstSprite,
			scaleX: 1,
			scaleY: 1,
			alpha: 0.4,
			duration: 350,
			ease: 'Sine.easeOut',
			onComplete: () => burstSprite.destroy()
		});
        if (Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y) < 125)
        {
            this.scene.playerTakeDamage({damage: 20});
        }
    }

    fireball(time)
    {
        if (!this.canPerform(time, this.abilities.fireball)) return;
        let b = new Bullet(this.scene, this.x, this.y, this.angle+180, this.bullet_speed, this.damage);
        b.setScale(4);
        b.tint = 0xff0000;
        this.scene.enemy_bullets.add(b);
    }

    heal(time)
    {
        if (!this.canPerform(time, this.abilities.heal)) return;
        this.hp += 15;
        this.healthbar.increase(15);
        if (this.hp > 100) this.hp = 100;

        const burstSprite = this.scene.add.sprite(this.x, this.y, 'star2');
		burstSprite.setDepth(4);
		burstSprite.setScale(0.1);
		burstSprite.alpha = 1;
        burstSprite.tint = 0x00ff00;
		this.scene.tweens.add({
			targets: burstSprite,
			scaleX: 0.8,
			scaleY: 0.8,
			alpha: 0.7,
			duration: 350,
			ease: 'Sine.easeOut',
			onComplete: () => burstSprite.destroy()
		});
    }

    moveToPlayer(time)
    {
        this.target.x = this.scene.player.x;
        this.target.y = this.scene.player.y;
    }

    moveAway(time)
    {
        this.target.x = 2*this.x - this.scene.player.x;
        this.target.y = 2*this.y - this.scene.player.y;
    }

    moveToCenter(time)
    {
        this.target.x = this.scene.cameras.main.worldView.centerX;
        this.target.y = this.scene.cameras.main.worldView.centerY;
    }

    idle(time)
    {

    }

    preUpdate(time, delta)
    {
        let dt = delta/1000;
        if (!this.incombat) return;
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const angle = Math.atan2(dy, dx);
        this.rotation = angle+Math.PI;
        if (Math.abs(dx) > 10 || Math.abs(dy) > 10)
        {
            this.x += Math.cos(angle)*this.speed*dt;
            this.y += Math.sin(angle)*this.speed*dt;
        }
        else
        {
            this.rotation = Math.atan2(this.scene.player.y - this.y, this.scene.player.x - this.x) + Math.PI;
        }
        let bounds = this.scene.cameras.main.worldView;
        let show_dot = false;
        this.dot.x = this.x;
        this.dot.y = this.y;
        if (this.x < bounds.left)
        {
            this.dot.x = bounds.left + 10;
            show_dot = true;
        }
        if (this.x > bounds.right)
        {
            this.dot.x = bounds.right - 10;
            show_dot = true;
        }
        if (this.y < bounds.top)
        {
            this.dot.y = bounds.top + 10;
            show_dot = true;
        }
        if (this.y > bounds.bottom)
        {
            this.dot.y = bounds.bottom - 10;
            show_dot = true;
        }
        this.dot.visible = show_dot;
        this.mana += this.mps *dt;
        this.manabar.increase(this.mps*dt);
        this.state = this.transition(this.state, this.hp, this.mana, 
                                     Phaser.Math.Distance.Between(this.x, this.y, this.scene.player.x, this.scene.player.y),
                                     this.canPerform(time, this.abilities.melee, false),
                                     this.canPerform(time, this.abilities.fireball, false),
                                     this.canPerform(time, this.abilities.heal, false));
        this.actionmap[this.state](time);

    }

    transition(current, hp, mana, distance_to_player, meleeAvailable, fireballAvailable, healAvailable, time, scene) {
        if (distance_to_player < 150) {
            if (!this.showText) {
                this.showText = true; 
                this.scene.add.text(600, 400, "Bro doesn't wanna get close to you\nbecause you smell bad!", {fontSize: '32px', fill: '#ff0000ff'});
            }
            return STATE.MOVEAWAY;
        }
        return STATE.MOVETOPLAYER;
    }
}