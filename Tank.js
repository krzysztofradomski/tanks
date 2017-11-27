module.exports = class Tank {

    constructor(io, config) {
        this.io =  io;
        this.name = config.name;
        this.level = config.level;
        this.lives = config.lives;
        this.speed = config.speed; //ile ruchu naraz
        this.origin = config.origin;
        this.position = config.position;    
        this.on = config.on;      
        this.running;
        this.on ? this.start() : ``;
        this.sandbox = { x: 500, y: 500 };
        this.movementQ = [];
        this.enemysize = 50;
        this.drawsize = 25;
        this.otherTanksPositions = [];
        this.moveTo;
    }

    get info() {
        if (this.name) {
            return {
                name: this.name, 
                level: this.level, 
                lives: this.lives, 
                speed: this.speed, 
                origin: this.origin, 
                position: this.position, 
                on: this.on, 
                enemysize: this.enemysize,
                drawsize: this.drawsize,
                movementQ: this.movementQ,
                otherTanksPositions: this.otherTanksPositions
            }
        }
        return `Tank does not exist`;
    }

    move() {
         
         if (this.name) {
            this.movementQ.splice(0,1);
            this.generateMovement();
            this.moveTo = this.movementQ[0];
            this.position[this.moveTo.axis] = this.position[this.moveTo.axis] + this.moveTo.vector;
            if (this.position.x > this.sandbox.x-this.drawsize) {this.position.x = this.position.x - this.drawsize}
            if (this.position.y > this.sandbox.y-this.drawsize) {this.position.y = this.position.y - this.drawsize}
            if (this.position.x < 0) {this.position.x = 0};
            if (this.position.y < 0) {this.position.y = 0};
            
            //console.log( this.name, this.movementQ);
        } 
        return `Tank does not exist`;
    }

    generateMovement() {   
        let moveNow = {axis: 'x', vector: this.speed};
        if (this.sandbox.x > this.position.x+this.speed && this.sandbox.y > this.position.y+this.speed 
            && 0 < this.position.x+this.speed && 0 < this.position.y+this.speed) {

            switch (true) {
                case Date.now() % 2 === 0:
                    parseInt((Math.random()) * 2) === 0 ? moveNow = {axis: 'x', vector: this.speed} : moveNow = {axis: 'y', vector: -this.speed};
                    //console.log('date')
                    break;
                default:
                    //console.log('default')
                    parseInt((Math.random()) * 2) === 0 ? moveNow = {axis: 'y', vector: this.speed} : moveNow = {axis: 'x', vector: -this.speed};
             } 
             
        } else if (0 >= this.position.x && this.position.y + this.speed >= this.sandbox.y) {
             moveNow = {axis: 'x', vector: this.speed};
             this.movementQ.push({axis: 'y', vector: -this.speed});
            } else if (0 >= this.position.x &&  0 >= this.position.y + this.speed) {
             moveNow = {axis: 'x', vector: this.speed};
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
            //console.log('moveNow: ' + moveNow.axis + ' ' + moveNow.vector)
            this.movementQ.push(moveNow);
        } 
        if ( this.movementQ.length < 15) {
            let moves = parseInt(Math.random() *10);
            for (let i = 0; i < moves ; i++) {
                this.movementQ.push(moveNow)
            }   
        }
        // if (this.movementQ.length < 5)
        //  {
        //     this.generateMovement();
        //  }
         // if (this.movementQ.length > 15)
         // {
         //    this.movementQ = this.movementQ.splice(0,15);
         // }
       return this.movementQ.length > 1 ? this.movementQ[this.movementQ.length-1] : this.generateMovement();
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
                //this.position.x % 3 == 0 ? this.shoot() : ``;
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
        this.otherTanksPositions.map((v,i,arr) => { 

        });
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
