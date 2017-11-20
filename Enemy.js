module.exports = class Enemy {

    constructor(io, config) {
        this.io = io;
        this.name = config.name;
        this.level = config.level;
        this.lives = config.evel;
        this.speed = 1000 / config.speed; //ile ruchów na 1s
        this.position = config.position;
        this.origin = config.origin;
        this.on = config.on;      
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

                switch (true) {
                    case Date.now() % 2 === 0:
                        parseInt((Math.random()) * 2) === 0 ? this.position.x+=10 : this.position.y-=10;
                        console.log('date')
                        break;
                    default:
                        console.log('default')
                        parseInt((Math.random()) * 2) === 0 ? this.position.y+=10 : this.position.x-=10;
                 } 
                 
        } else if (0 >= this.position || 0 >= this.position.y) {
            this.position.x+=10;
            this.position.y+=10;
            }
        } else {
            return `Enemy does not exist`;
        }  
    }

    reset() {
         if (this.name) {
            this.on = false;
            clearInterval(this.running);
            let x = this.origin.x;
            let y = this.origin.y;
            this.position = {x,y};
            return `Enemy resetted.`;
        }
        return `Enemy does not exist`;
    }

    start() {
        if (this.name && !this.on) {
            this.on = true;
            this.running = setInterval(() => {
                this.move();
                let pos = this.position;
                console.log(`A ${this.name} moved to ${this.position.x}:${this.position.y}.`);
                this.position.x % 3 == 0 ? this.shoot() : ``;
                this.io.emit('start', pos);
            }, this.speed)

            return `Enemy started.`;
        } else if (this.on) {
            return `Enemy already started.`;
        }
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