module.exports = class Enemy {

    constructor(io, config) {
        this.io = io;
        this.name = config.name;
        this.level = config.level;
        this.lives = config.evel;
        this.speed = 1000 / config.speed; //ile ruchów na 1s
        this.origin = config.origin;
        this.position = config.position;    
        this.on = config.on;      
        this.running;
        this.on ? this.start() : ``;
        this.sandbox = { x: 500, y: 500 };
        this.movementQ = [];
    }

    get info() {
        if (this.name) {
            return `A level ${this.level} ${this.name} spotted at ${this.position.x}:${this.position.y}, ${!this.on ? `engine idle.` : `moving at ${this.speed} speed.`}`
        }
        return `Enemy does not exist`;
    }

    move() {
         if (this.movementQ.length < 5)
         {
            this.generateMovement();
         }
         if (this.name) {
            this.movementQ.splice(0,1);
            let moveTo = this.generateMovement();
            this.position[moveTo.axis] = this.position[moveTo.axis] + moveTo.vector;
            if (this.position.x >= this.sandbox.x-10 || this.position.y > this.sandbox.y-10 || this.position.x <= 10 || this.position.y <= 10) {
                 this.movementQ.splice(0,1);
                let moveTo = this.generateMovement();
                this.position[moveTo.axis] = this.position[moveTo.axis] + moveTo.vector;
            }
        } 
        return `Enemy does not exist`;
    }

    generateMovement() {   
        let moveNow = {axis: null, vector: null}
        if (this.sandbox.x > this.position.x+10 && this.sandbox.y > this.position.y+10 
            && 0 < this.position.x+10 && 0 < this.position.y+10) {

            switch (true) {
                case Date.now() % 2 === 0:
                    parseInt((Math.random()) * 2) === 0 ? moveNow = {axis: 'x', vector: 10} : moveNow = {axis: 'y', vector: -10}
                    console.log('date')
                    break;
                default:
                    console.log('default')
                    parseInt((Math.random()) * 2) === 0 ? moveNow = {axis: 'y', vector: 10} : moveNow = {axis: 'x', vector: -10}
             } 
             
        } else if (0 >= this.position.x && this.position.y + 10 >= this.sandbox.y) {
             this.movementQ.push({axis: 'x', vector: 10});
             this.movementQ.push({axis: 'y', vector: -10});
            } else if (0 >= this.position.x &&  0 >= this.position.y + 10) {
             this.movementQ.push({axis: 'x', vector: 10});
             this.movementQ.push({axis: 'y', vector: 10});
            } else if (0 >= this.position.x) {
             moveNow = {axis: 'x', vector: 10}
            }
            else if (0 >= this.position.y) {
             moveNow = {axis: 'y', vector: 10}
            }  else if (this.sandbox.x >= this.position.x) {
             moveNow = {axis: 'x', vector: -10}
            } else if (this.sandbox.x < this.position.x) {
             moveNow = {axis: 'x', vector: -10}
            } else if (this.sandbox.y < this.position.y) {
             moveNow = {axis: 'y', vector: -10}
            } else {moveNow = {axis: 'x', vector: 0}}
        if (this.movementQ.length < 10) {
            console.log('moveNow: ' + moveNow)
            this.movementQ.push(moveNow);
        } 
        if ( Date.now() % 5 === 0) {
            let moves = parseInt(Math.random() *10);
            for (let i = 0; i < moves ; i++) {
                this.movementQ.push(moveNow)
            }   
        }
       return this.movementQ[this.movementQ.length-1]
    } 

    reset() {
         if (this.name) {
            this.on = false;
            this.movementQ = [];
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
            console.log(this.movementQ)
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

// example:
// let enemy66config = {
//         name: 'manowar', 
//         level: 19, 
//         speed: 25,
//         origin: { x: 250, y: 250 },
//         position: { x: 250, y: 250 },
//         on: true
//     };
// let enemy66 = new Enemy(io, enemy66config);