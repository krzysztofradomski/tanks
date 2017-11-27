module.exports = class Player {

    constructor(io, config, obstacles) {
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
        this.obstacles.map((v2,j,arr) => { 
            let i1 = i;
            let i2 = j;
            let v1 = v;
            var a = v1.position.x - v2.x > 0 ? v1.position.x - v2.x : v2.x - v1.position.x;
            var b = v1.position.y - v2.y;
            let distance = Math.sqrt(a*a + b*b);
            if (v.movementQ.length > 0 && 
                distance < this.drawsize) {

                if (this[this.enemies[i].name].position.x > v2.x) { //po prawej
                    this[this.enemies[i].name].position.x += v2.x+this.drawsize - this[this.enemies[i].name].position.x
                };
                if (this[this.enemies[i].name].position.y > v2.y) { //u dolu
                    this[this.enemies[i].name].position.y += v2.y+this.drawsize - this[this.enemies[i].name].position.y
                };
                if (this[this.enemies[i].name].position.x < v2.x) { //po lewej
                    this[this.enemies[i].name].position.x -= v2.x - this[this.enemies[i].name].position.x;
                };
                if (this[this.enemies[i].name].position.y < v2.y) { //u gory
                    this[this.enemies[i].name].position.y -= v2.y - this[this.enemies[i].name].position.y;
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
