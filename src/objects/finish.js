export default class finish{
    constructor(scene, player, x, y, len, width) {
        this.scene = scene;
        this.player = player;
        this.x = x;
        this.y = y;
        this.len = len;
        this.width = width;
        this.gameEnded = false;
    }


    endGame(){
        if(this.gameEnded) return;
        this.scene.sound.play('power_up', { volume: 1 });
        this.gameEnded = true;
        console.log("You win!");
        this.scene.endGame();
    }

    update() { // Kevin note: I changed how both of our levels end. the player touches a flag which triggers this.endGame() so that i dont have to have a headache messing with coordinates and switch-cases for both our levels
        /*
        if (Math.abs(this.player.x - this.x) < this.width/2 && Math.abs(this.player.y - this.y) < this.len/2){
            this.endGame();
        }*/
    }
}