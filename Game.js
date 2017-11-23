let Tank = require('./Tank.js');
let Player = require('./Player.js');

module.exports = class Game {
    constructor(io) {
        this.io = io;
        this.enemysize = 50;
        this.on = false;
        this.speed = 1000 / 25;
        this.running;
        this.enemies = [];
        this.enemycount = 0;
        this.enemiesLimit = 5;
        this.sandbox = { x: 500, y: 500 };

    };

    init() {
    	this.enemycount = 0;
        this.enemies = [];
    	this.createEnemies();
    	this.io.emit('ready');

    }
    createEnemies() {
    	this.enemycount = 0;
        this.enemies = [];
    	for (let count = 0; count < this.enemiesLimit; count++) {
    		this.enemycount +=1;
	    	let enemyName = 'enemy' + this.enemycount
	    	let x = parseInt(Math.random() * (this.sandbox.x-this.enemysize));
	    	let y = parseInt(Math.random() * (this.sandbox.y-this.enemysize));
	    	let enemyConfig =  {
	    		name: enemyName,
	    		level: 1,
	    		lives: 1,
	    		speed: parseInt(Math.random() * 5 + 1),
	    		origin: {x: x, y: y},
	    		position: {x: x, y: y},
	    		on: false
	    	}
	    	this[enemyName] = new Tank (this.io, enemyConfig);
	    	this.enemies.push(this[enemyName].info);
    	}
    		console.log('enemies = ');
	    	console.log(this.enemies);
	    	console.log('enemies number = ');
	    	console.log(this.enemies.length);
    }

    reset() {
        if (this) {
            this.on = false;
            this.enemycount = 0;
            this.enemies = [];
            clearInterval(this.running);
            this.init();
            setTimeout(() => {this.start()},500);
            return `Game resetted.`;
        }
        return `Game does not exist`;
    }

    start() {
        if (this && !this.on) {
            this.on = true;
            this.running = setInterval(() => {      
      			this.enemies.map((v,i,arr) => { 
      				//this.collisionDetection();
      				this[this.enemies[i].name].move();
	                let pos = this[this.enemies[i].name].position;
	                console.log(`A ${this.enemies[i].name} moved to ${this[this.enemies[i].name].position.x}:${this[this.enemies[i].name].position.y}.`);
	                this[this.enemies[i].name].position.x % 3 == 0 ? this[this.enemies[i].name].shoot() : ``;
	                this.enemies[i] = this[this.enemies[i].name].info;
			        //this.collisionDetection();
			        this.enemies.map((v2,j,arr) => { 
      		let i1 = i;
      		let i2 = j;
      		//console.log(v1.position);
      		//console.log(v2.position);
      		if ((v1.movementQ.length > 1 && v2.movementQ.length > 1) && 
      			(v1.position.x - v2.position.x < this.enemysize) && 
      			(v1.position.y - v2.position.y < this.enemysize)) {
      			v1.movementQ[0] = {axis: v1.movementQ[0].axis, vector: -v1.movementQ[0].vector}
      			v2.movementQ[0] = {axis: v1.movementQ[0].axis, vector: -v1.movementQ[0].vector}
      			console.log('collision');
      			return;

      		}

        });
	            });
                this.io.emit('gamestart', this.enemies);
                
            }, this.speed)
        }
    }

     stop() {
        if (this && this.on) {
            this.on = false;
            clearInterval(this.running);
            return `Game stopped.`;
        }
        return `Game does not exist`;
    }

      collisionDetection() {
      	this.enemies.map((v1,i,arr) => { 
      	this.enemies.map((v2,j,arr) => { 
      		let i1 = i;
      		let i2 = j;
      		//console.log(v1.position);
      		//console.log(v2.position);
      		if ((v1.movementQ.length > 1 && v2.movementQ.length > 1) && 
      			(v1.position.x - v2.position.x < this.enemysize) && 
      			(v1.position.y - v2.position.y < this.enemysize)) {
      			v1.movementQ[0] = {axis: v1.movementQ[0].axis, vector: -v1.movementQ[0].vector}
      			v2.movementQ[0] = {axis: v1.movementQ[0].axis, vector: -v1.movementQ[0].vector}
      			console.log('collision');
      			return;

      		}

        });
    })
	}

}