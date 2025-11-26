// startLevelKevin.js

import Ben from '../objects/ben.js';
//import Ladder from '../objects/ladder.js';
import Coin from '../objects/coin.js';
//import Finish from '../objects/finish.js';
import Thief from '../objects/thief.js';
export default class StartLevelKevin extends Phaser.Scene {
    constructor() { super('StartLevelKevin'); }

    preload() {
    }

    create() {
          this.player = new Ben(this, 64, 700);
          this.timeTaken = 0;
          this.coinCount = 0;

          // TILEMAP
          const map = this.make.tilemap({ key: "StartLevelKevin" });
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

          // CAMERA
          this.cameras.main.setBounds(0, 0, map.widthInPixels+500, map.heightInPixels+500);
          this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
          this.cameras.main.startFollow(this.player);
          this.cameras.main.setZoom(3);
          
          this.updatables = [];
          this.enemies = [];
          this.instantiateGameObjectsFromLayer(map);

          // FINISH LINE (kevin put this here)
          const flag = this.add.sprite(160, 145, 'flag').setScale(2);
          this.physics.add.existing(flag, true);
          this.physics.add.overlap(this.player, flag, () => {
              if (this.gameEnded) return; // avoid double trigger spam
              this.gameEnded = true;
              this.sound.play('win');
              this.endGame();
          }, null, this);
        

      }
      endGame(){
        this.add.text(16,8,"You won!",{fontSize:20,color:'#ffffffff'});
        this.add.text(16,30,`You gathered ${this.player.coinCount} / ${this.coinCount} coins!`,{fontSize:20,color:'#ffffffff'});
        this.add.text(16,52,`You died ${this.player.deathsCount} times!`,{fontSize:20,color:'#ffffffff'});
        this.add.text(16,74,`Time taken: ${(this.timeTaken / 1000).toFixed(2)} seconds`,{fontSize:20,color:'#ffffffff'});
        this.time.delayedCall(5000, () => {this.gameEnded = false;
          this.scene.start('Start');
        }, [], this);
      }
      

      //Tiled object properties are stored in an array for some stupid reason so we need to convert them to an object first
      serializeObjectProperties(propertiesArray){
        if(!propertiesArray) return {};
        console.log(propertiesArray);
        const properties = {};
        for(let prop of propertiesArray){
          properties[prop.name] = prop.value;
        }
        return properties;
      }

      instantiateGameObjectsFromLayer(map){
        const objects = map.getObjectLayer("gameObjects").objects;

        for(let obj of objects){
          //Tiled object properties are stored in an array for some stupid reason so we need to convert them to an object first
          let properties = this.serializeObjectProperties(obj.properties);
      
          console.log(properties);
          switch(properties['type']){
            case "ladder":
                //console.log("ladder");
                this.updatables.push(new Ladder(obj.x, obj.y, properties["len"], properties["width"], this.player));
                break;
              case "coin":
                //console.log("coin");
                new Coin(this, this.player, obj.x, obj.y);
                this.coinCount++;
                break;
              case "finish":
                //console.log("finish");
                this.updatables.push(new Finish(this, this.player, obj.x, obj.y, properties["len"], properties["width"]));
                break;
              case "thief":
                //console.log("thief");
                this.enemies.push(new Thief(this, this.player, obj.x, obj.y, properties["minX"], properties["maxX"]));
                break;
              case "spawn":
                //console.log("thief");
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
