let Tank = require('./Tank.js');
let Player = require('./Player.js');

module.exports = class Game {
    constructor(io) {
        this.io = io;
        this.enemysize = 10;
        this.on = false;
        this.speed = 100;
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
	    		speed: parseInt(Math.random() * 10 + 1),
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
      				this[this.enemies[i].name].move();
	                let pos = this[this.enemies[i].name].position;
	                console.log(`A ${this.enemies[i].name} moved to ${this[this.enemies[i].name].position.x}:${this[this.enemies[i].name].position.y}.`);
	                this[this.enemies[i].name].position.x % 3 == 0 ? this[this.enemies[i].name].shoot() : ``;
	                this.enemies[i] = this[this.enemies[i].name].info;
	                this[this.enemies[i].name].otherTanksPositions = this.enemies[i];
	            });
                this.io.emit('gamestart', this.enemies);
                
            }, 100)
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
    }

}