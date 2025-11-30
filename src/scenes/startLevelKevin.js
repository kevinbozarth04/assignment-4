// startLevelKevin.js

import Ben from '../objects/ben.js';
import Thief from '../objects/thief.js';
//import HealthBar from 'src/gameobjects/HealthBar.js';
export default class StartLevelKevin extends Phaser.Scene {
    constructor() { super('StartLevelKevin'); }

    preload() {
    }

    create() {
        this.player = new Ben(this, 350, 740); // spawnpoint
        this.timeTaken = 0;

        // INGREDIENTS
        const flour = this.add.sprite(400, 300, 'flour').setScale(0.5); // set the starting coordinates yourself
        const water = this.add.sprite(400, 400, 'water').setScale(0.5);
        const pork = this.add.sprite(400, 500, 'pork').setScale(0.5);
        const cabbage = this.add.sprite(400, 600, 'cabbage').setScale(0.5);
        const onion = this.add.sprite(200, 400, 'onion').setScale(0.5);
        this.physics.add.existing(flour, true);
        this.physics.add.existing(water, true);
        this.physics.add.existing(pork, true);
        this.physics.add.existing(cabbage, true);
        this.physics.add.existing(onion, true);
        flour.setDepth(3);
        water.setDepth(3);
        pork.setDepth(3);
        cabbage.setDepth(3);
        onion.setDepth(3);
        this.gotFlour = false;
        this.gotWater = false;
        this.gotPork = false;
        this.gotCabbage = false;
        this.gotOnion = false;

        // NPCs
        const thief = this.add.sprite(100, 700, 'thief').setScale(0.7);
        this.physics.add.existing(thief, true);
        thief.setDepth(3);

        const pig = this.add.sprite(200, 600, 'pig').setScale(0.4);
        this.physics.add.existing(pig, true);
        pig.setDepth(3);

        const evilPig = this.add.sprite(200, 700, 'evilPig').setScale(0.6);
        this.physics.add.existing(evilPig, true);
        evilPig.setDepth(3);

        // TILEMAP
        const map = this.make.tilemap({ key: "StartLevelKevin" });
        const tileset = map.addTilesetImage("world_tileset", "world_tileset");

        // KITCHEN
        const kitchen = this.add.sprite(380, 730, 'kitchen').setScale(0.3);
        this.physics.add.existing(kitchen, true);
        kitchen.setDepth(2);

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

        // CAMERA
        this.cameras.main.setBounds(0, 0, map.widthInPixels+0, map.heightInPixels+0);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setZoom(4); // change to 4 later
        
        this.updatables = [];
        this.enemies = [];
        this.instantiateGameObjectsFromLayer(map);

        // CODE FOR YOU TO ADD
        // - Enemy (thief or evil pig)
        // - Pig
        // - Spawn coordinates of all sprites
    }

    endGame() {
        this.add.text(16,8,"You won!",{fontSize:20,color:'#ffffffff'});
        //this.add.text(16,52,`You died ${this.player.deathsCount} times!`,{fontSize:20,color:'#ffffffff'});
        this.add.text(16,22,`Time taken: ${(this.timeTaken / 1000).toFixed(2)} seconds`,{fontSize:20,color:'#ffffffff'});
        this.time.delayedCall(5000, () => {this.gameEnded = false;
            this.scene.start('Start');
        }, [], this);
    }

    // Convert tiled object properties from array to object
    serializeObjectProperties(propertiesArray) {
        if (!propertiesArray) return {};
        const properties = {};
        for(let prop of propertiesArray){
            properties[prop.name] = prop.value;
        }
        return properties;
    }

    instantiateGameObjectsFromLayer(map) {
        const objects = map.getObjectLayer("gameObjects").objects;
        for (let obj of objects) {
            // Convert tiled object properties from array to object
            let properties = this.serializeObjectProperties(obj.properties);
            switch(properties['type']){
            case "thief":
                this.enemies.push(new Thief(this, this.player, obj.x, obj.y, properties["minX"], properties["maxX"]));
                break;
            case "spawn":
                this.player.setPosition(obj.x, obj.y);
                this.player.spawnPoint = {x: obj.x, y: obj.y};
                break;
            }
        }
    }
    
    update(time, delta) {
        this.updatables.forEach(updatable => updatable.update());
        this.timeTaken += delta;
    }
}
