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
        this.moveTo;
        this.missile = null;
        this.color = 'red';
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
                moveto: this.moveTo,
                missile: this.missile,
                color: this.color
            };
        }
        return `Tank does not exist`;
    }

    move() {       
         if (this.name) {
            this.movementQ.splice(0,1);
            this.generateMovement();
            this.moveTo = this.movementQ[0];
            this.position[this.moveTo.axis] = this.position[this.moveTo.axis] + this.moveTo.vector;   
            this.wallsDetection();
        } 
        return `Tank does not exist`;
    }

    wallsDetection() {
        if (this.position.x > this.sandbox.x-this.drawsize) {this.position.x = this.position.x - this.drawsize;}
        if (this.position.y > this.sandbox.y-this.drawsize) {this.position.y = this.position.y - this.drawsize;}
        if (this.position.x < 0) {this.position.x = 0;}
        if (this.position.y < 0) {this.position.y = 0;}
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
             moveNow = {axis: 'x', vector: this.speed};
            }
            else if (0 >= this.position.y) {
             moveNow = {axis: 'y', vector: this.speed};
            }  else if (this.sandbox.x >= this.position.x) {
             moveNow = {axis: 'x', vector: -this.speed};
            } else if (this.sandbox.x < this.position.x) {
             moveNow = {axis: 'x', vector: -this.speed};
            } else if (this.sandbox.y < this.position.y) {
             moveNow = {axis: 'y', vector: -this.speed};
            } else {moveNow = {axis: 'x', vector: 0};}
        if (this.movementQ.length < this.speed) {
            //console.log('moveNow: ' + moveNow.axis + ' ' + moveNow.vector)
            this.movementQ.push(moveNow);
        } 
        if ( this.movementQ.length < 15) {
            let moves = parseInt(Math.random() * 10);
            for (let i = 0; i < moves ; i++) {
                this.movementQ.push(moveNow);
            }   
        }
       return this.movementQ.length > 1 ? this.movementQ[this.movementQ.length-1] : this.generateMovement();
    } 

    shooting() {
       if (!this.missile && Date.now() % 9 === 0) {  
            let position = this.position;
            let axis = (this.movementQ.slice(0,1))[0].axis;
            let vector = (this.movementQ.slice(0,1))[0].vector;
            this.missile = {
                size: 5,
                position: {
                    x: position.x+this.drawsize/2,
                    y: position.y+this.drawsize/2
                    
                },
                vector: vector * 1.5,
                axis: axis
            };           
        }
        if (!!this.missile) {
            this.missile.position[this.missile.axis] += this.missile.vector;
            if (this.missile.position.x > this.sandbox.x || 
                this.missile.position.y > this.sandbox.y || 
                this.missile.position.x < 0 ||
                this.missile.position.y < 0 ) {
                this.missile = null;
            }        
        }      
    }

};
