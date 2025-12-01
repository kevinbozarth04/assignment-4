// startLevelKevin.js

import Ben from '../objects/ben.js';
import Thief from '../objects/thief.js';
import Pig from '../objects/pig.js';
import EvilPig from '../objects/evilPig.js';
import {HealthBar} from '../objects/health_bar.js'; // might not use

export default class StartLevelKevin extends Phaser.Scene {
    constructor() { super('StartLevelKevin'); }

    preload() {
    }

    create() {
        this.player = new Ben(this, 350, 740); // spawnpoint
        this.timeTaken = 0;

        // TILEMAP
        const map = this.make.tilemap({ key: "StartLevelKevin" });
        const tileset = map.addTilesetImage("world_tileset", "world_tileset");

        // CAMERA
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setZoom(4); // change to 4 later

        // INGREDIENTS
        const flour = this.add.sprite(400, 300, 'flour').setScale(0.01); // set the starting coordinates yourself
        const water = this.add.sprite(400, 400, 'water').setScale(0.01);
        const pork = this.add.sprite(400, 500, 'pork').setScale(0.005);
        const cabbage = this.add.sprite(400, 600, 'cabbage').setScale(0.01);
        const onion = this.add.sprite(200, 400, 'onion').setScale(0.01);
        this.ingredients = this.physics.add.group();
            this.ingredients.add(flour);
            this.ingredients.add(water);
            this.ingredients.add(pork);
            this.ingredients.add(cabbage);
            this.ingredients.add(onion);
        this.physics.add.overlap(this.player, this.ingredients, this.collectIngredient, null, this);
        flour.setDepth(3);
        water.setDepth(3);
        pork.setDepth(3);
        cabbage.setDepth(3);
        onion.setDepth(3);
        this.gotFlour = "❌";
        this.gotWater = "❌";
        this.gotPork = "❌";
        this.gotCabbage = "❌";
        this.gotOnion = "❌";

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


        this.updatables = [];
        this.enemies = [];
        //this.pigs = [];
        //this.evilPigs = [];
        this.instantiateGameObjectsFromLayer(map);

        // CODE FOR YOU TO ADD
        // - Enemy (thief or evil pig)
        // - Pig
        // - Spawn coordinates of all sprites

        // UI
        this.hp = 3;
        this.healthText = this.add.text(980, 350, `HP: ${this.hp}`, {
            fontSize: "32px",
            fill: "#fff"
        })
        this.healthText.setScrollFactor(0);
        this.healthText.setScale(0.3);
        this.healthText.setDepth(9999);

        this.checklistText = this.add.text(660, 350,
            `[${this.gotFlour}] Flour\n[${this.gotWater}] Water\n[${this.gotPork}] Pork\n[${this.gotCabbage}] Cabbage\n[${this.gotOnion}] Green onion`, 
            {fontSize: "26px", color: "#ffffff",});
        this.checklistText.setScrollFactor(0);
        this.checklistText.setDepth(9999);
        this.checklistText.setOrigin(0, 0);
        this.checklistText.setScale(0.3);
    
    }

    collectIngredient(player, item) {
        const key = item.texture.key;
        switch (key) {
            case "flour": this.gotFlour = "✔️"; break;
            case "water": this.gotWater = "✔️"; break;
            case "pork": this.gotPork = "✔️"; break;
            case "cabbage": this.gotCabbage = "✔️"; break;
            case "onion": this.gotOnion = "✔️"; break;
        }

        item.destroy();
        this.sound.play("collect");
        this.updateChecklist();
    }

    updateChecklist() {
        this.checklistText.setText(
        `[${this.gotFlour}] Flour\n[${this.gotWater}] Water\n[${this.gotPork}] Pork\n[${this.gotCabbage}] Cabbage\n[${this.gotOnion}] Green onion`);
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
            switch(properties['type']) {
                case "thief":
                    const thief = new Thief(this, this.player, obj.x, obj.y);
                    this.enemies.push(thief);
                    break;
                case "pig":
                    const pig = new Pig(this, this.player, obj.x, obj.y);
                    this.enemies.push(pig);
                    break;
                case "evilPig": // aka the js devs
                    const evilPig = new EvilPig(this, this.player, obj.x, obj.y);
                    this.enemies.push(evilPig);
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
