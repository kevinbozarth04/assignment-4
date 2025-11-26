// startPortalLevel.js

import Knight from '../objects/knight.js';
//import Enemy from '../objects/enemy.js';
import Coin from '../objects/coin.js';
import Finish from '../objects/finish.js';

export default class StartPortalLevel extends Phaser.Scene {
    constructor() { 
        super('StartPortalLevel'); 
    }

    create() {
        this.player = new Knight(this, 50, 760);
        this.timeTaken = 0;
        this.coinCount = 0; 
        this.portalCount = 0;
        this.gameEnded = false;

        //this.physics.add.overlap(this.player, this.portals, this.handlePortalOverlap, null, this);
        // TILEMAP
        const map = this.make.tilemap({key: 'StartPortalLevel' }) // same key from start.js
        const tileset = map.addTilesetImage("world_tileset", "world_tileset");
  
        // LAYERS
        this.layers = {};
        this.layers["background"] = map.createLayer("background", tileset, 0, 0);
        this.layers["ground"] = map.createLayer("ground", tileset, 0, 0);
        this.layers["decorations"]= map.createLayer("decorations",tileset, 0, 0);
        this.layers["danger"] = map.createLayer("danger", tileset, 0, 0);
    
        // COLLISION
        this.layers["ground"].setCollisionByExclusion([-1]);
        this.layers["danger"].setCollisionByExclusion([-1]);
        this.player.depth = 10;
        this.physics.add.collider(this.player, this.layers["ground"]);
        this.physics.add.collider(this.player, this.layers["danger"], () => {this.player.die();});
    
        // FINISH LINE
        const flag = this.add.sprite(160, 65, 'flag').setScale(2);
        this.physics.add.existing(flag, true);
        this.physics.add.overlap(this.player, flag, () => {
            if (this.gameEnded) return; // avoid double trigger spam
            this.gameEnded = true;
            this.sound.play('win');
            this.endGame();
        }, null, this);

        // CAMERA
        this.cameras.main.setBounds(0, 0, map.widthInPixels+500, map.heightInPixels+500);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(2);

        this.updatables = [];
        this.instantiateGameObjectsFromLayer(map);

        // PORTALS
        this.portals = [];
        const ob = this.add.sprite(150, 760, 'portal_orange_black').setScale(2); 
        const ow = this.add.sprite(35, 670, 'portal_orange_white').setScale(2);
        const gb = this.add.sprite(750, 750, 'portal_green_black').setScale(2);
        const gw = this.add.sprite(40, 70, 'portal_green_white').setScale(2);
        const bb = this.add.sprite(26, 600, 'portal_blue_black').setScale(2);
        const bw = this.add.sprite(454, 454, 'portal_blue_white').setScale(2);
        this.physics.add.existing(ob, true);
        this.physics.add.existing(ow, true);
        this.physics.add.existing(gb, true);
        this.physics.add.existing(gw, true);
        this.physics.add.existing(bb, true);
        this.physics.add.existing(bw, true);
        this.portals.push(ob, ow, gb, gw, bb, bw); // push elements to end of portals [] array
        ob.depth = ow.depth = gb.depth = gw.depth = bb.depth = bw.depth = 11; // 1 layer in front of the knight

        // TELEPORTATION ...very reduntant code but it gets the job done
        this.physics.add.overlap(this.player, ob, () => { 
            this.player.setX(60); this.player.setY(670);
            this.sound.play('teleport');
            this.portalCount++;
        }, null, this);

        this.physics.add.overlap(this.player, ow, ()=> { 
            this.player.setX(125); this.player.setY(760);
            this.sound.play('teleport');
            this.portalCount++;
        }, null, this);

        this.physics.add.overlap(this.player, gb, ()=> { 
            this.player.setX(65); this.player.setY(70);
            this.sound.play('teleport');
            this.portalCount++;
        }, null, this);

        this.physics.add.overlap(this.player, gw, ()=> {
            this.player.setX(725); this.player.setY(750);
            this.sound.play('teleport');
            this.portalCount++;
        }, null, this);

        this.physics.add.overlap(this.player, bb, ()=> { // enter facing left
            this.player.setX(424); this.player.setY(454);
            this.sound.play('teleport');
            this.portalCount++;
        }, null, this);

        this.physics.add.overlap(this.player, bw, ()=> {
            this.player.setX(49); this.player.setY(600);
            this.sound.play('teleport');
            this.portalCount++;
        }, null, this);
    }

    // OBJECTS
    serializeObjectProperties(propertiesArray) { // same as startEnemyLevel.js
        if (!propertiesArray) return {};
        const properties = {};
        for (let i = 0; i < propertiesArray.length; i++) {
            const prop = propertiesArray[i]; 
            properties[prop.name] = prop.value;
        } 
        return properties;
    }

    instantiateGameObjectsFromLayer(map) {
        const layer = map.getObjectLayer("gameObjects");
        if (!layer) return;

        const objects = layer.objects;
        for (let obj of objects) {
            let properties = this.serializeObjectProperties(obj.properties);
            switch(properties['type']){
                case "coin":
                    new Coin(this, this.player, obj.x, obj.y);
                    this.coinCount++;
                    break;
                case "finish":
                    this.updatables.push(new Finish(this, this.player, obj.x, obj.y, properties["len"], properties["width"]));
                    break;
                default: break;
            }
        }
    }

    endGame() {
        this.add.text(46, 8, 'You won Kevin\'s Portal Level!', { fontSize: 20, color: '#000000ff' });
        this.add.text(46, 30, `Coins collected: ${this.player.coinCount} / ${this.coinCount}`, { fontSize: 18, color: '#000000ff' });
        if (this.player.deathsCount > 0) {
            this.add.text(46, 52, `Deaths: ${this.player.deathsCount} (noob)`, { fontSize: 18, color: '#000000ff' });
        } else {
            this.add.text(46, 52, `Deaths: ${this.player.deathsCount}`, { fontSize: 18, color: '#000000ff' });
        }
        this.add.text(46, 74, `Time: ${(this.timeTaken / 1000).toFixed(2)} seconds`, { fontSize: 18, color: '#000000ff' });
        this.add.text(46, 96, `Teleportations: ${this.portalCount}`, { fontSize: 18, color: '#000000ff' });
        this.time.delayedCall(5000, () => {
            this.scene.start('Start');
        });
    }

    update(time, delta) {
        this.updatables.forEach(updatable => updatable.update());
        this.timeTaken += delta;
    }
}