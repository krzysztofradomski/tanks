let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
module.exports = class Enemy {

    constructor(name, level = 1, speed = 1, position = { x: 0, y: 0 }, on = false) {
        this.name = name;
        this.level = level;
        this.lives = level;
        this.speed = 1000 / speed; //ile ruchów na 1s
        this.position = position;
        this.origin = this.position;
        this.on = on;
        this.running;
        this.on ? this.start() : ``;
        this.sandbox = { x: 500, y: 500 }
    }

    get info() {
        if (this.name) {
            return `A level ${this.level} ${this.name} spotted at ${this.position.x}:${this.position.y}, ${!this.on ? `engine idle.` : `moving at ${this.speed} speed.`}`
        }
        return `Enemy does not exist`;
    }

    move() {
        if (this.name) {
            if (this.sandbox.x > this.position.x+10 && this.sandbox.y > this.position.y+10) {
                 return Math.round(Math.random()) == 0 ? this.position.x+=10 : this.position.y+=10;
                }
            return Math.round(Math.random()) == 0 ? this.position.x-=10 : this.position.y-=10;
        }
        return `Enemy does not exist`;
    }

    reset() {
         if (this.name) {
            this.on = false;
            clearInterval(this.running);
            this.position = this.origin;
            return `Enemy resetted.`;
        }
        return `Enemy does not exist`;
    }

    start() {
        if (this.name && !this.on) {
            this.on = true;
            this.running = setInterval(() => {
                this.move();
                console.log(`A ${this.name} moved to ${this.position.x}:${this.position.y}.`);
                this.position.x % 3 == 0 ? this.shoot() : ``;
                //io.emit('start', this.position);
            }, this.speed)

            return `Enemy started.`;
        } else return `Enemy already started.`;
        return `Enemy does not exist`;
    }

    stop() {
        if (this.name) {
            this.on = false;
            clearInterval(this.running);
            return `Enemy stopped.`;
        }
        return `Enemy does not exist`;
    }

    shoot() {
        if (this.name) {
            console.log(`Czolg rodzaju ${this.name} szczela w Natalie. Bang bang!`);
        }
        return `Enemy does not exist`;
    }

    collisionDetection() {

    }

    kill() {
        if (this.name) {
            this.stop();
            delete this.name;
            delete this.level;
            delete this.speed;
            delete this.position;
            delete this.on;
            delete this.running;
            return `Enemy killed`;
        }
        return `Enemy does not exist`;
    }

}

//let enemy2 = new Enemy('manowar', 666, 4);