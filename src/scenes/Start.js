import { Bullet } from '../gameobjects/bullet.js';
import { Enemy } from '../gameobjects/enemy.js';
import { Boss } from '../gameobjects/boss.js';

export class Start extends Phaser.Scene {

    constructor() {
        super('Start');
    }

    preload() {
        this.load.image('background', 'assets/bg.png');
        this.load.image('character', 'assets/char.png');
        
        this.load.image('projectile', 'assets/projectile.png');
        this.load.json('spawns', 'data/spawns.json');
 
        // enemy sprites
        this.load.image('barnacle', 'assets/barnacle.png');
        this.load.image('bee', 'assets/bee.png');
        this.load.image('block', 'assets/block.png');
        this.load.image('blue_fish', 'assets/blue_fish.png');
        this.load.image('blue_worm', 'assets/blue_worm.png');
        this.load.image('mean_block', 'assets/enemy.png');
        this.load.image('fly', 'assets/fly.png');
        this.load.image('frog', 'assets/frog.png');
        this.load.image('ladybug', 'assets/ladybug.png');
        this.load.image('mouse', 'assets/mouse.png');
        this.load.image('saw', 'assets/saw.png');
        this.load.image('slime_block', 'assets/slime_block.png');
        this.load.image('slime_fire', 'assets/slime_fire.png');
        this.load.image('snail', 'assets/spike_slime.png');
        this.load.image('yellow_fish', 'assets/yellow_fish.png');
        this.load.image('yellow_worm', 'assets/yellow_worm.png');
        this.N = 4;
        this.load.image("landscape", "assets/tilesheet.png");
        for (var i = 0; i < this.N; ++i)
            this.load.tilemapTiledJSON('tilemap'+i, 'assets/tilemap' + i  + '.tmj');

        this.M = 2;
        for (var i = 0; i < this.M; ++i)
            this.load.tilemapTiledJSON('objectmap'+i, 'assets/objectmap' + i  + '.tmj');

        this.load.image("dot", "assets/dot.png");

       
        this.load.image("coin", "assets/coin.png");

        // from: https://opengameart.org/content/dungeon-crawl-32x32-tiles (CC-0 licensed)
        this.load.image("heal", "assets/hp.png");
        this.load.image("speed", "assets/speed.png");
        this.load.image("shield", "assets/shield.png");
        this.load.image("attackspeed", "assets/attack_speed.png");

        // particles
        this.load.image("fire1", "assets/fire1.png");
        this.load.image("fire2", "assets/fire2.png");
        this.load.image("star1", "assets/star1.png");
        this.load.image("star2", "assets/star2.png");
        this.load.image("star3", "assets/star3.png");
        this.load.image("star4", "assets/star4.png");


        // sound effects
        this.load.audio("congratulations_female", "assets/congratulationsf.ogg");
        this.load.audio("level_up_female", "assets/level_upf.ogg");
        this.load.audio("target_destroyed_female", "assets/target_destroyedf.ogg");
        this.load.audio("congratulations_male", "assets/congratulationsm.ogg");
        this.load.audio("level_up_male", "assets/level_upm.ogg");
        this.load.audio("target_destroyed_male", "assets/target_destroyedm.ogg");
        this.load.audio("congratulations_synth", "assets/congratulationss.ogg");
        this.load.audio("level_up_synth", "assets/level_ups.ogg");
        this.load.audio("hurt1", "assets/hurt1.ogg");
        this.load.audio("hurt2", "assets/hurt2.ogg");
        this.load.audio("hurt3", "assets/hurt3.ogg");
        this.load.audio("upgrade1", "assets/upgrade1.ogg");
        this.load.audio("upgrade2", "assets/upgrade2.ogg");
        this.load.audio("upgrade3", "assets/upgrade3.ogg");
        this.load.audio("upgrade4", "assets/upgrade4.ogg");
        this.load.audio("explosion1", "assets/explosion1.ogg");
        this.load.audio("explosion2", "assets/explosion2.ogg");
        this.load.audio("explosion3", "assets/explosion3.ogg");

        this.load.audio("bg", "assets/bg.ogg");


    }

    makeTilemap(x,y)
    {
        var background = undefined;
        if (this.tilemaps[x+"_" + y]) return;
        this.tilemaps[x+"_" + y] = true;
        x = x*30*32;
        y = y*30*32;
        let which = Phaser.Math.Between(0, this.N-1);
        background = this.add.tilemap('tilemap'+which, 32, 32, 30, 30);
       
        var tileset = background.addTilesetImage("landscape", "landscape", 32, 32, 0, 2);
        var bg = background.createLayer("background", tileset, x, y);
        bg.setDepth(0);
        var layer = background.createLayer("obstacles", tileset, x, y);
        layer.setCollisionBetween(1,1767);
        layer.setDepth(2);
        this.physics.add.collider(layer, this.player);
        var paths = background.createLayer("paths", tileset, x, y);
        paths.setDepth(1);
        this.paths.add(paths);
        paths.setCollisionBetween(1,1767);
        let deco = background.createLayer("decoration", tileset, x, y);
        deco.setDepth(3);

        which = Phaser.Math.Between(0, this.M-1);
        let objmap = this.add.tilemap('objectmap' + which, 32, 32, 30, 30);
        let objects = objmap.getObjectLayer("Collectibles");
        if (objects)
        {
            for (var obj of objects.objects)
            {
                if (obj.properties)
                {
                    if (obj.properties[0].name == "value" && obj.properties[0].value)
                    {
                        let coin = this.physics.add.staticSprite(x+obj.x +16, y+obj.y-16, "coin");
                        coin.value = Math.min(obj.properties[0].value, 100);
                        coin.setDepth(8);
                        coin.setScale(1 + coin.value/100);
                        if (coin.value > 25)
                        coin.tint = 0xffbbbb;
                        if (coin.value > 50)
                        coin.tint = 0xff5555;
                        if (coin.value > 90)
                        coin.tint = 0xff0000;
                        this.coins.add(coin);
                    }
                    if (obj.properties[0].name == "powerup")
                    {
                        let powerup = this.physics.add.staticSprite(x + obj.x + 16, y+obj.y-16, obj.properties[0].value);
                        powerup.powerup_type = obj.properties[0].value;
                        powerup.setDepth(8);
                        powerup.setScale(2);
                        this.powerups.add(powerup);
                    }
                }
            }
        }
    }

    create() {
        
        this.player = this.add.sprite(720, 320, 'character');
        this.player.setScale(0.4, 0.4);
        this.player.setDepth(6);
        this.physics.add.existing(this.player);
        this.enemy_group = this.add.group("enemies");
        this.coins = this.add.group("coins");
        this.powerups = this.add.group("powerups");
        this.wave = 1;
        this.wave_label = this.add.text(640, 100, "", { fontSize: '64px', fill: '#FF0000', align: "center" }).setScrollFactor(0);
        this.wave_label.setOrigin(0.5, 0.5);
        this.wave_label.setDepth(10);
        this.description_label = this.add.text(640, 180, "", { fontSize: '32px', fill: '#FF0000', align: "center" }).setScrollFactor(0);
        this.description_label.setOrigin(0.5, 0.5);
        this.description_label.setDepth(10);
        this.sound.play("bg", {loop: true});
        this.tilemaps = {};
        this.paths = this.add.group("paths");

        for (let i = 0; i< 3; i++)
        {
            for (let j = 0; j < 3; ++j)
            {
                this.makeTilemap(i, j);
            }
        }
        
       // this.newWave();
        this.spawnBoss();
        this.player.score = 0;
        this.player.hp = 100;
        this.player.level = 1;
        this.player.speed = 100;
        this.player.bonus_speed = 0;
        this.player.bonus_speed_stacks = 0;
        this.player.bullet_speed = 350;
        this.player.last_attack = 0;
        this.player.shield = 0;
        this.player.shield_stacks = 0;
        this.player.attack_speed = 3000;
        this.player.attack_speed_bonus = 1;
        this.player.attack_angle = 0;
        this.player.damage = 1;
        this.score_label = this.add.text(0, 0, 'Points: ' + this.player.score, { fontSize: '32px', fill: '#000000' }).setScrollFactor(0);
        this.score_label.setDepth(10);
        
        this.last_time = 0;
        this.player_bullets = this.add.group("player_bullets");
        this.enemy_bullets = this.add.group("enemy_bullets");

        this.up = this.input.keyboard.addKey("W", false, true);
        this.down = this.input.keyboard.addKey("S", false, true);
        this.left = this.input.keyboard.addKey("A", false, true);
        this.right = this.input.keyboard.addKey("D", false, true);

        this.cameras.main.startFollow(this.player, true);

        this.cameras.main.setDeadzone(800, 400);

        
    }

    newWave()
    {
        const spawns = this.cache.json.get("spawns");
        let idx = Math.floor(Math.random()*spawns.length);
        const spawn = spawns[idx];
        this.wave_label.text = "BEWARE the " + spawn.name;
        this.description_label.text = spawn.description;
        this.time.delayedCall(5000, () => { this.wave_label.text = "";
                                            this.description_label.text = ""; });
        const n = spawn.count*(Math.log(this.wave)*this.wave+1)
        for (let i = 0; i < n; ++i)
        {
            const dist = 1000 + i*200 + Math.random()*500; 
            const angle = i * 120/spawn.count  + Math.random()*40 - 80;
            idx = Math.floor(Math.random()*spawn.target.length);
            const target = spawn.target[idx];
            const e = new Enemy(this, dist, 0, spawn.sprite, angle, spawn.speed, spawn.attack_rate, spawn.bullet_speed, spawn.damage, this.getTarget(target), this.time.now);
            e.setScale(0.2);
            Phaser.Math.RotateAround(e, this.player.x, this.player.y, Phaser.Math.DegToRad(angle));
            this.enemy_group.add(e);
            this.physics.add.existing(e);
            
        }

        this.time.delayedCall(30000, () => {    this.newWave();
                                             this.wave++;});
    }

    spawnBoss()
    {
        const e = new Boss(this, 1350, 480, "mean_block", 120, 400, 600, 20, this.time.now);
        e.setDepth(9);
        this.wave_label.text = e.name;
        this.description_label.text = "Good Luck! You will need it.";
        this.time.delayedCall(5000, () => { this.wave_label.text = "";
                                            this.description_label.text = ""; });
        
        e.setScale(0.1);
        this.enemy_group.add(e);
        this.physics.add.existing(e);
        this.cameras.main.shake(1500, 0.005);
        this.tweens.add({targets: e, scale: 1.2, duration: 1500});
    }


    getTarget(name)
    {
        if (name == "player")
        {
            return this.player;
        }
        if (name == "random")
        {
            return {x: this.player.x + Math.random()*this.game.canvas.width, y: this.player.y + Math.random()*this.game.canvas.height - this.game.canvas.height/2};
        }
        if (name == "center")
        {
            return {x: this.player.x + this.game.canvas.width/4, y: this.player.y};
        }
    }

    update(time) {
        let dt = (time - this.last_time)/1000;
        this.last_time = time;
        let attack = false;
        let move = new Phaser.Math.Vector2(0,0);
        if (this.up.isDown) move.y -= 1; 
        if (this.down.isDown) move.y += 1;
        if (this.left.isDown) move.x -= 1;
        if (this.right.isDown) move.x += 1;
        let factor = 1;
        let speed = this.player.speed + this.player.bonus_speed;
        if (move.length() > 0)
        {
            move.normalize();
            this.player.body.velocity.x = move.x*speed*factor;
            this.player.body.velocity.y = move.y*speed*factor;
        }
        else
        {
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;
        }

        let cx = Math.floor(this.cameras.main.scrollX/960);
        let cy = Math.floor(this.cameras.main.scrollY/960);
        for (let i = 0; i < 4; ++i)
            for (let j=0; j < 3; ++j)
                this.makeTilemap(cx+i-1, cy+j-1);

        if (this.player.last_attack + this.player.attack_speed*this.player.attack_speed_bonus < time)
        {
            this.player.last_attack = time;

            for (let i = 0; i < 4; i++)
            {
                let bullet = new Bullet(this, this.player.x, this.player.y, this.player.attack_angle + i*90, this.player.bullet_speed);
                this.player_bullets.add(bullet);
            }
            this.player.attack_angle += 45;
        }       

        
        this.physics.world.overlap(this.player_bullets, this.enemy_group, (b,e) => { 
                                if (e.takeDamage(this.player.damage)) { 
                                    if (this.onEnemyDestroy(e))
                                    {
                                        this.scene.stop("Start");
                                        this.scene.start('YouWin');
                                    } 
                                } 
                                b.destroy(true); 
                            });
        this.physics.world.overlap(this.player, this.enemy_bullets, (p,b) => { this.playerTakeDamage(b); b.destroy(true);});
        this.physics.world.overlap(this.player, this.enemy_group, (p,e) => { 
                                if (e.invulnerable) return;
                                e.damage = 10; 
                                this.playerTakeDamage(e); 
                                if (e.takeDamage(5)) 
                                { 
                                    if (this.onEnemyDestroy(e))
                                    {
                                        this.scene.stop("Start");
                                        this.scene.start('YouWin');
                                    }
                                }
                                else
                                {
                                    e.invulnerable = true; 
                                    const dx = 0.8*(p.x - e.x);
                                    const dy = 0.8*(p.y - e.y);
                                    this.tweens.add({
                                        targets: p,
                                        x: "+=" + dx,
                                        y: "+=" + dy,
                                        duration: 200,
                                        onComplete: () => {e.invulnerable = false;}
                                    })
                                } });
        this.physics.world.overlap(this.player, this.coins, (p,c) => { 
               c.body.enable = false;
               this.tweens.add({
                  targets: c, 
                  scale: 0.2, 
                  duration: 300, 
                  onComplete: () => {
                        c.destroy(true);}
                }); 
                p.score += c.value; 
                this.checkLevelUp();});
        this.physics.world.overlap(this.player, this.powerups, (p,pu) => { 
                    pu.body.enable = false;
                    this.tweens.add({
                        targets: pu, 
                        scale: 0.2, 
                        duration: 300, 
                        onComplete: () => {
                                pu.destroy(true);}
                    });
                    this.applyPowerup(pu.powerup_type);});
        let percentage = Math.round(100*(this.player.score - this.threshold(this.player.level-1))/(this.threshold(this.player.level) - this.threshold(this.player.level-1)));
        let text = "XP: " + this.player.score + " Level: " + this.player.level + " (" + percentage + "%) HP: " + this.player.hp;
        if (this.player.shield)
        {
            text += " (Shield: " + this.player.shield + ")";
        }
        this.score_label.text = text;
    }

    applyPowerup(type)
    {
        if (type == "heal")
        {
            this.player.hp = Math.min(this.player.hp + 10, 100);
        }
        if (type == "speed")
        {
            this.player.bonus_speed = 100;
            // extend duration
            this.player.bonus_speed_stacks++;
            this.time.delayedCall(10000, () => { 
                            this.player.bonus_speed_stacks--;
                            if (this.player.bonus_speed_stacks == 0)
                                 this.player.bonus_speed = 0;
                            });
        }
        if (type == "shield")
        {
            // extend duration + stack amount
            this.player.shield += 50;
            this.player.shield_stacks++;
            this.time.delayedCall(15000, () => {
                             this.player.shield_stacks--;
                             if (this.player.shield_stacks == 0)
                                 this.player.shield = 0;
                            });
        }
        if (type == "attackspeed")
        {
            // stack intensity
            this.player.attack_speed_bonus *= 0.25;
            this.time.delayedCall(5000, () => {this.player.attack_speed_bonus *= 4;});
        }

    }

    playerTakeDamage(bullet)
    {
        let damage = bullet.damage;
        if (this.player.shield > 0)
        {
            this.player.shield -= damage;
            damage = 0;
            if (this.player.shield < 0)
            {
                damage = -this.player.shield;
                this.player.shield = 0;
            }
        }
        if (damage == 0) return;
        this.player.hp -= damage; 
        this.onPlayerDamage(this.player, damage);
        
        this.checkEndGame();
    }

    checkEndGame()
    {
        if (this.player.hp <= 0)
        {
            this.scene.stop("Start");
            this.scene.start('GameOver');
        }
    }

    threshold(level)
    {
        let n = level;
        // sum of first n squares
        // level 2 at 1^2*10 = 10
        // level 3 at (1^2 + 2^2)*10 = 50
        // level 4 at (1^2 + 2^2 + 3^2)*10 = 140
        // etc. (delta between two levels is level*level*10)
        return (n*(n+1)*(2*n+1)/6)*10;
    }


    checkLevelUp()
    {
        let n = this.player.level
        if (this.player.score >= this.threshold(this.player.level))
        {
            this.player.level++;
            this.onPlayerLevelUp(this.player, this.player.level);
            this.player.attack_speed *= 0.85;
            this.player.speed += 15;
            this.player.bullet_speed += 20;
            this.player.damage = Math.ceil(this.player.level/10);
        }
    }


    onPlayerDamage(player, damage)
    {
        // you can change this completely
        player.tint = 0xff0000;
        this.time.delayedCall(500, () => { player.tint = 0xffffff; }); 

        const hurtSounds = ['hurt1', 'hurt2', 'hurt3'];
        const randomHurt = hurtSounds[Phaser.Math.Between(0, hurtSounds.length - 1)];
        this.sound.play(randomHurt, { volume: 0.5 });
        

        const dmgText = this.add.text(player.x, player.y - 40, `-${damage}`, {
        fontSize: '24px',
        fill: '#ff0000',
        fontStyle: 'bold'
        }).setDepth(10);
        dmgText.setOrigin(0.5, 0.5);
        this.tweens.add({
            targets: dmgText,
            y: player.y - 100,
            alpha: 0,
            duration: 800,
            ease: 'Cubic.easeOut',
            onComplete: () => dmgText.destroy()}
            );

        const p = this.add.particles(player.x, player.y, "star2",{
            speed: { min: -80, max: 80 }, lifespan: 250, quantity: 6, scale: { start: 0.1, end: 0 }, gravityY: 200 });
            this.time.delayedCall(500, () => { p.destroy(true); });
        p.setDepth(5);
        this.cameras.main.shake(200, 0.01); 
    }

    onEnemyDestroy(enemy)
    {
        const boom = ["explosion1", "explosion2", "explosion3"][Math.floor(Math.random()*3)];
		this.sound.play(boom, { volume: 0.6 });
		const burstSprite = this.add.sprite(enemy.x, enemy.y, 'fire2');
		burstSprite.setDepth(8);
		burstSprite.setScale(0.1);
		burstSprite.alpha = 1;
		this.tweens.add({
			targets: burstSprite,
			scaleX: 0.6,
			scaleY: 0.6,
			alpha: 0,
			duration: 350,
			ease: 'Sine.easeOut',
			onComplete: () => burstSprite.destroy()
		});

		this.tweens.add({
			targets: enemy,
			angle: enemy.angle + 360,
			scaleX: 0,
			scaleY: 0,
			alpha: 0,
			duration: 300,
			ease: 'Back.easeIn',
			onComplete: () => {
				if (enemy.dot) enemy.dot.destroy(true);
				enemy.destroy(true);
			}
		});
        if (enemy.isboss) return true;
        return false;
    }

    onPlayerLevelUp(player, level)
    {
        let particles = this.add.particles(this.player.x, this.player.y, 'star3',{
            scale: {start: 0.1, end: 0.05, random: false},
            angle: {min:0, max:180},
            x: {min: 0, max: 10},
            y: 0,
            gravityY: 0,
            speed: 100,
            color: [0xcaebee, 0xff0000]
        }); 
        particles.setDepth(25);
       // this.particles.start();
        this.time.delayedCall(300, () => particles.destroy(true));
        const levelUpSounds = ['level_up_male', 'level_up_female', ''];
        const randomSound = Phaser.Utils.Array.GetRandom(levelUpSounds);
        if (randomSound)
            this.sound.play(randomSound);
        const lvlText = this.add.text(player.x, player.y - 40, `Level ${level}!`, {
        fontSize: '28px',
        color: '#ffd700',
        stroke: '#000000',
        strokeThickness: 4
        }).setDepth(20);
        this.tweens.add({
            targets: lvlText,
            y: lvlText.y - 36,
            alpha: 0,
            duration: 900,
            onComplete: () => lvlText.destroy()
        });
    }
    
}
