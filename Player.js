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
        this.playerSize = 50;
    }

    get info() {
        if (this.name) {
            return {name: this.name, level: this.level, lives: this.lives, speed: this.speed, origin: this.origin, position: this.position, on: this.on, movementQ: this.movementQ}
        }
        return `Player does not exist`;
    }

    move(key) {
        switch (key) {
            case 'w':
                this.position.y -= 10;
                break;
            case 's':
                this.position.y += 10;
                break;
            case 'a':
                this.position.x -= 10;
                break;
            case 'd':
                this.position.x += 10;
                break;
            default:
                this.position.x += 0;
                this.position.y += 0;

        }
 
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
