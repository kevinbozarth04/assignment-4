// startLevelSam.js

import Ben from '../objects/ben.js';
//import Enemy from '../objects/enemy.js';

export default class StartLevelSam extends Phaser.Scene {
    constructor() { super('StartLevelSam'); }

    create() {
        this.player = new Ben(this, 50, 760);
        this.timeTaken = 0;
        this.coinCount = 0; 
        this.portalCount = 0;
        this.gameEnded = false;

        // TILEMAP
        const map = this.make.tilemap({key: 'StartLevelSam' }) // same key from start.js
        const tileset = map.addTilesetImage("world_tileset", "world_tileset");
  
        // LAYERS
        this.layers = {};
        this.layers["background"] = map.createLayer("background", tileset, 0, 0);
        this.layers["obstacle"] = map.createLayer("obstacle", tileset, 0, 0); // obstacle
        this.layers["decoration"]= map.createLayer("decoration",tileset, 0, 0);
        this.layers["danger"] = map.createLayer("danger", tileset, 0, 0); // maybe unused.
    
        // COLLISION
        this.layers["obstacle"].setCollisionByExclusion([-1]);
        this.layers["danger"].setCollisionByExclusion([-1]);
        this.player.depth = 10;
        this.physics.add.collider(this.player, this.layers["obstacle"]);
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

    /*
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
    */
    }
    
    update(time, delta) {
        this.updatables.forEach(updatable => updatable.update());
        this.timeTaken += delta;
    }
}