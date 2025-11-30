// health_bar.js

export class HealthBar {

    constructor (scene, x, y, color=0xff0000, width=800, height=30, border_width=3) {
        this.bar = new Phaser.GameObjects.Graphics(scene).setScrollFactor(0);
        this.bar.setDepth(999);
        this.width = width;
        this.height = height;
        this.border_width = border_width;
        this.x = x;
        this.y = y;
        this.value = 100;
        this.color = color;
        this.p = (this.width - 2*this.border_width) / 100;

        this.draw();

        scene.add.existing(this.bar);
    }

    decrease(amount) {
        this.value -= amount;
        if (this.value < 0) {this.value = 0;}
        this.draw();
        return (this.value === 0);
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
        this.draw();
    }

    increase(amount) {
        this.value += amount;
        if (this.value > 100) {this.value = 100;}
        this.draw();
        return (this.value === 100);
    }

    draw() {
        this.bar.clear();

        //  BG
        this.bar.fillStyle(0x000000);
        this.bar.fillRect(this.x, this.y, this.width, this.height);

        //  Health
        this.bar.fillStyle(0xdfdfdf);
        this.bar.fillRect(this.x + this.border_width, this.y + this.border_width, this.width-2*this.border_width, this.height - 2*this.border_width);
        this.bar.fillStyle(this.color);
        var d = Math.floor(this.p * this.value);
        this.bar.fillRect(this.x + this.border_width, this.y + this.border_width, d, this.height - 2*this.border_width);
    }

}