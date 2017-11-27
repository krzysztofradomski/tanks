module.exports = class Player {

    constructor(io, config, obstacles) {
        this.name = config.name;
        this.level = config.level;
        this.lives = config.lives;
        this.speed = config.speed; //ile ruchu naraz
        this.origin = config.origin;
        this.position = config.position;
        this.color = config.color;
        ///this.running;
        this.sandbox = { x: 500, y: 500 };
        this.playersize = 50;
        this.drawsize = 25;
        this.obstacles = obstacles;
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
                break;
            case 's', 'ArrowDown':
                this.position.y += 10;
                 break;
            case 'a', 'ArrowLeft':
                this.position.x -= 10;
                break;
            case 'd', 'ArrowRight':
                this.position.x += 10;
                break;
            default:
                this.position.x += 0;
                this.position.y += 0;
        }
        if (this.position.x > this.sandbox.x-this.drawsize) {this.position.x = this.sandbox.x - this.drawsize}
        if (this.position.y > this.sandbox.y-this.drawsize) {this.position.y = this.sandbox.y - this.drawsize}
        if (this.position.x < 0) {this.position.x = 0};
        if (this.position.y < 0) {this.position.y = 0};
        this.obstaclesCollisionDetection()
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

    obstaclesCollisionDetection() {
        this.obstacles.map((v2,i,arr) => { 
            let v1 = this;
            var a = this.position.x - v2.x > 0 ? this.position.x - v2.x : v2.x - this.position.x;
            var b = this.position.y - v2.y;
            let distance = Math.sqrt(a*a + b*b);
            if (distance < this.drawsize) {

                if (this.position.x > v2.x) { //po prawej
                    this.position.x += v2.x+this.drawsize - this.position.x
                };
                if (this.position.y > v2.y) { //u dolu
                    this.position.y += v2.y+this.drawsize - this.position.y
                };
                if (this.position.x < v2.x) { //po lewej
                    this.position.x -= v2.x - this.position.x;
                };
                if (this.position.y < v2.y) { //u gory
                    this.position.y -= v2.y - this.position.y;
                };

                console.log('obstacle collision distance:');
                console.log(distance)
                return;
            }
        });
    };



    kill() {
       
        return `Player does not exist`;
    }

}
