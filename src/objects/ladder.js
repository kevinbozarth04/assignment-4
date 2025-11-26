export default class Ladder {
    constructor(x, y, len, width,  player){
        this.x = x;
        this.y = y;
        this.len = len;
        this.width = width;
        this.player = player;
    }

    update(){
        if(Math.abs(this.player.x - this.x) < this.width/2 &&
           this.player.y - this.y < this.len && this.player.y - this.y > 0)
            {
                this.player.coyoteTimeCounter = 0; // reset coyote time
           }
        else
            {
           }
    
    }   
}