// startLevelSam.js

import Ben from '../objects/ben.js';
import Crab from '../objects/crab.js';
import Thief from '../objects/thief.js';

export default class StartLevelKevin extends Phaser.Scene {
    constructor() { super('StartLevelSam'); }

    preload() {
    }

    create() {
        this.time.addEvent({
            delay: 5000, // Delay in milliseconds (5000 ms = 5 seconds)
            callback: this.recordLog,
            callbackScope: this, // Ensures 'this' in myRepeatingFunction refers to the scene
            loop: true // Makes the event repeat indefinitely
        });
        this.player = new Ben(this, 350, 740); // spawnpoint
        this.timeTaken = 0;
        this.enemies = [];

        // TILEMAP
        const map = this.make.tilemap({ key: "StartLevelSam" });
        this.map = map;
        const tileset = map.addTilesetImage("world_tileset", "world_tileset");

        // CAMERA
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cameras.main.setZoom(4); // change to 4 later

        // INGREDIENTS
        this.ingredients = this.physics.add.group();
        this.flour = this.add.sprite(135, 660, 'flour').setScale(0.006); // set the starting coordinates yourself
        this.ingredients.add(this.flour);
        this.water = this.add.sprite(673, 527, 'water').setScale(0.006);
        this.ingredients.add(this.water);
        this.pork = this.add.sprite(97, 113, 'pork').setScale(0.005);
        this.ingredients.add(this.pork);
        this.cabbage = this.add.sprite(364, 321, 'cabbage').setScale(0.01);
        this.ingredients.add(this.cabbage);
        this.onion = this.add.sprite(716, 105, 'onion').setScale(0.008);
        this.ingredients.add(this.onion);
        this.physics.add.existing(this.flour, true);
        this.physics.add.existing(this.water, true);
        this.physics.add.existing(this.pork, true);
        this.physics.add.existing(this.cabbage, true);
        this.physics.add.existing(this.onion, true);
        this.flour.setDepth(3);
        this.water.setDepth(3);
        this.pork.setDepth(3);
        this.cabbage.setDepth(3);
        this.onion.setDepth(3);
        this.flour.got = false;
        this.water.got = false;
        this.pork.got = false;
        this.cabbage.got = false;
        this.onion.got = false;
        this.flour.display = "❌";
        this.water.display = "❌";
        this.pork.display = "❌";
        this.cabbage.display = "❌";
        this.onion.display = "❌";
        
        this.physics.add.overlap(this.player, this.ingredients, this.markGotten, null, this);
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

        // KITCHEN
        const kitchen = this.add.sprite(380, 730, 'kitchen').setScale(0.3);
        this.physics.add.existing(kitchen, true);
        kitchen.setDepth(2);

        this.crabSpawned = false;

        // kevin put this here 12/2/25
        this.kitchen = kitchen; 
        this.inKitchen = false;
        this.physics.add.overlap(this.player, this.kitchen, () => {
            this.inKitchen = true;
        }, null, this);
        


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
        this.enemies.forEach(enemy => { // enemy obstacle collision
            this.physics.add.collider(enemy, this.layers["obstacle"]);
        });

        this.updatables = [];
        // this.enemies = [];
        this.instantiateGameObjectsFromLayer(map);

        // CODE FOR YOU TO ADD
        // - Enemy (thief or evil pig)
        // - Pig
        // - Spawn coordinates of all sprites

        // UI
        this.healthText = this.add.text(980, 350, "HP: 3", {
            fontSize: "32px",
            fill: "#fff"
        })
        this.healthText.setScrollFactor(0);
        this.healthText.setScale(0.3);
        this.healthText.setDepth(9999);

        this.checklistText = this.add.text(660, 350,
            "[" + this.flour.display + "] Flour\n[" + this.water.display + "] Water\n[" + this.pork.display + "] Pork\n[" + this.cabbage.display + "] Cabbage\n[" + this.onion.display + "] Green onion",
            {
                fontSize: "26px",
                color: "#ffffff",
            });
        this.checklistText.setScrollFactor(0);
        this.checklistText.setDepth(9999);
        this.checklistText.setOrigin(0, 0);
        this.checklistText.setScale(0.3);
    
    }

    hasAllIngredients() { // kevin put this here 12/2/25
        return (
            this.flour.got === true &&
            this.water.got === true &&
            this.pork.got === true &&
            this.cabbage.got === true &&
            this.onion.got === true
        );
    }

    // Convert tiled object properties from array to object
    serializeObjectProperties(propertiesArray) {
        if (!propertiesArray) return {};
        const properties = {};
        for (let prop of propertiesArray){
            properties[prop.name] = prop.value;
        }
        return properties;
    }

    markGotten(player, item){
        item.got = true;
        item.display = "✔️";
        item.destroy();
        this.sound.play("collect");
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

    spawnCrabs(map){
        const objects = map.getObjectLayer("gameObjects").objects;
        for (let obj of objects) {
            // Convert tiled object properties from array to object
            let properties = this.serializeObjectProperties(obj.properties);
            switch(properties['type']){
            case "crab":
                const crab = new Crab (this, this.player, obj.x, obj.y);
                this.physics.add.collider(crab, this.layers["obstacle"]);
                this.enemies.push(crab);
                break;
            }
        }
        this.crabSpawned = true;
    }
    
    update(time, delta) {
        this.updatables.forEach(updatable => updatable.update());
        this.timeTaken += delta;

        this.checklistText.setText ("[" + this.flour.display + "] Flour\n[" + this.water.display + "] Water\n[" + this.pork.display + "] Pork\n[" + this.cabbage.display + "] Cabbage\n[" + this.onion.display + "] Green onion");
    
        // kevin put this here 12/2/25
        // cook elgibility
        this.inKitchen = false; 
        this.physics.world.overlap(this.player, this.kitchen, () => {
            this.inKitchen = true;
        }, null, this);
        // if player in kitchen and press C, LET! HIM! COOK!
        if (Phaser.Input.Keyboard.JustDown(this.player.keys.cook)) {
            if (this.inKitchen && this.hasAllIngredients()) {
                this.scene.start("Win");
            }
        }

        if(this.water.got == true && this.crabSpawned == false){
            this.spawnCrabs(this.map);
        }
        
    }

    recordLog(){
        console.log("this is the x: " + this.player.x);
        console.log("this is the y: " + this.player.y);
    }

    //350, 746
}