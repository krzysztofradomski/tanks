module.exports = class Tank {

    constructor(io, config) {
        this.io =  io;
        this.name = config.name;
        this.level = config.level;
        this.lives = config.evel;
        this.speed = config.speed; //ile ruchu naraz
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
        return `Tank does not exist`;
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
            if (this.position.x > this.sandbox.x) {this.position.x = this.sandbox.x - this.speed}
            if (this.position.y > this.sandbox.y) {this.position.y = this.sandbox.y - this.speed}
            if (this.position.x < 0) {this.position.x = 0}
            if (this.position.y < 0) {this.position.y = 0}
        } 
        return `Tank does not exist`;
    }

    generateMovement() {   
        let moveNow = {axis: null, vector: null}
        if (this.sandbox.x > this.position.x+this.speed && this.sandbox.y > this.position.y+this.speed 
            && 0 < this.position.x+this.speed && 0 < this.position.y+this.speed) {

            switch (true) {
                case Date.now() % 2 === 0:
                    parseInt((Math.random()) * 2) === 0 ? moveNow = {axis: 'x', vector: this.speed} : moveNow = {axis: 'y', vector: -this.speed}
                    console.log('date')
                    break;
                default:
                    console.log('default')
                    parseInt((Math.random()) * 2) === 0 ? moveNow = {axis: 'y', vector: this.speed} : moveNow = {axis: 'x', vector: -this.speed}
             } 
             
        } else if (0 >= this.position.x && this.position.y + this.speed >= this.sandbox.y) {
             this.movementQ.push({axis: 'x', vector: this.speed});
             this.movementQ.push({axis: 'y', vector: -this.speed});
            } else if (0 >= this.position.x &&  0 >= this.position.y + this.speed) {
             this.movementQ.push({axis: 'x', vector: this.speed});
             this.movementQ.push({axis: 'y', vector: this.speed});
            } else if (0 >= this.position.x) {
             moveNow = {axis: 'x', vector: this.speed}
            }
            else if (0 >= this.position.y) {
             moveNow = {axis: 'y', vector: this.speed}
            }  else if (this.sandbox.x >= this.position.x) {
             moveNow = {axis: 'x', vector: -this.speed}
            } else if (this.sandbox.x < this.position.x) {
             moveNow = {axis: 'x', vector: -this.speed}
            } else if (this.sandbox.y < this.position.y) {
             moveNow = {axis: 'y', vector: -this.speed}
            } else {moveNow = {axis: 'x', vector: 0}}
        if (this.movementQ.length < this.speed) {
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
            return `Tank resetted.`;
        }
        return `Tank does not exist`;
    }

    start() {
        if (this.name && !this.on) {
            this.on = true;
            this.running = setInterval(() => {
                this.move();
                let pos = this.position;
                console.log(`A ${this.name} moved to ${this.position.x}:${this.position.y}.`);
                this.position.x % 3 == 0 ? this.shoot() : ``;
                this.io.emit('tankstart', pos);
            }, this.speed)

            return `Tank started.`;
        } else if (this.on) {
            return `Tank already started.`;
        }
        return `Tank does not exist`;
    }

    stop() {
        if (this.name) {
            this.on = false;
            clearInterval(this.running);
            console.log(this.movementQ)
            return `Tank stopped.`;
        }
        return `Tank does not exist`;
    }

    shoot() {
        if (this.name) {
            console.log(`Czolg rodzaju ${this.name} szczela w Natalie. Bang bang!`);
        }
        return `Tank does not exist`;
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
            return `Tank killed`;
        }
        return `Tank does not exist`;
    }

}

// example:
// let Tank66config = {
//         name: 'manowar', 
//         level: 19, 
//         speed: 25,
//         origin: { x: 250, y: 250 },
//         position: { x: 250, y: 250 },
//         on: true
//     };
// let Tank66 = new Tank(io, Tank66config);