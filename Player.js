module.exports = class Player {

    constructor(io, config) {
        this.name = config.name;
        this.level = config.level;
        this.lives = config.lives;
        this.speed = config.speed; //ile ruchu naraz
        this.origin = config.origin;
        this.position = config.position;      
        ///this.running;
        this.sandbox = { x: 500, y: 500 };
        this.playersize = 50;
        this.drawsize = 25;
    }

    get info() {
        if (this.name) {
            return {name: this.name, level: this.level, lives: this.lives, speed: this.speed, origin: this.origin, position: this.position, on: this.on, movementQ: this.movementQ}
        }
        return `Player does not exist`;
    }

    move(key) {
        switch (key) {
            case 'w', 'ArrowUp':
                this.position.y -= 10;
                 //if (this.position.y < this.playersize*3/2) { console.log('out', this.position);this.position.y = 0};

                break;
            case 's', 'ArrowDown':
                this.position.y += 10;
                //if (this.position.y > this.sandbox.y-this.playersize*3/2) { console.log('out', this.position);this.position.y = this.position.y};
                break;
            case 'a', 'ArrowLeft':
                this.position.x -= 10;
                //if (this.position.x < this.playersize*3/2) { console.log('out', this.position);this.position.x = 0};
                break;
            case 'd', 'ArrowRight':
                this.position.x += 10;
                  //if (this.position.x > this.sandbox.x-this.playersize*3/2) { console.log('out', this.position);this.position.x = this.position.x};
                break;
            default:
                this.position.x += 0;
                this.position.y += 0;
        }
        if (this.position.x > this.sandbox.x-this.drawsize) {this.position.x = this.sandbox.x - this.drawsize}
        if (this.position.y > this.sandbox.y-this.drawsize) {this.position.y = this.sandbox.y - this.drawsize}
        if (this.position.x < 0) {this.position.x = 0};
        if (this.position.y < 0) {this.position.y = 0};
    }

    generateMovement() {   
        
    } 

    reset() {
         if (this.name) {
            this.on = false;
            this.movementQ = [];
            clearInterval(this.running);
            let x = this.origin.x;
            let y = this.origin.y;
            this.position = {x,y};
            return `Player resetted.`;
        }
        return `Player does not exist`;
    }

    start() {
        
        return `Player does not exist`;
    }

    stop() {
       
        return `Player does not exist`;
    }

    shoot() {
        if (this.name) {
            console.log(`Czolg rodzaju ${this.name} szczela w Natalie. Bang bang!`);
        }
        return `Player does not exist`;
    }

    collisionDetection() {

    }

    kill() {
       
        return `Player does not exist`;
    }

}
