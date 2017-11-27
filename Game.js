let Tank = require('./Tank.js');
let Player = require('./Player.js');
let ObstacleSets = require('./ObstacleSets.js');

module.exports = class Game {
    constructor(io) {
        this.io = io;
        this.enemysize = 50;
        this.drawsize = 25;
        this.obstaclesize = 50;
        this.on = false;
        this.speed = 1000 / 25;
        this.running;
        this.enemies = [];
        this.enemycount = 0;
        this.enemiesLimit = 5;
        this.sandbox = { x: 500, y: 500 };
        this.obstacles = [];
        this.Player1 = null;
    };

    init() {
    	this.enemycount = 0;
        this.enemies = [];
        this.obstacles = [];
        this.createObstacles();
    	this.createEnemies();
    	this.io.emit('ready');

    	let playerConfig =  {
	    		name: 'A',
	    		level: 1,
	    		lives: 1,
	    		speed: 5,
	    		origin: {x: 250, y: 480},
	    		position: {x: 250, y: 480}
	    	}
    	this.Player1 = new Player(this.io, playerConfig);
    }

    createObstacles() {
    	// this.obstacles = [];
    	// for (let count = 0; count < this.enemiesLimit; count++) {
    	// 	this.obstacles.push({
    	// 		size: this.enemysize,
    	// 		x: parseInt(Math.random() * (this.sandbox.x-this.enemysize)),
    	// 		y: parseInt(Math.random() * (this.sandbox.x-this.enemysize))
    	// 	})
    	// }
    	this.obstacles = ObstacleSets.sets[parseInt(Math.random() * ObstacleSets.sets.length)];
    	
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
	    		speed: 5,
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
            this.obstacles = [];
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
      			this.enemies.map((v,i) => {
      				this[this.enemies[i].name].move();
      				this.tanksCollisionDetection(i,v);
      				this.obstaclesCollisionDetection(i,v);
      				
	                let pos = this[this.enemies[i].name].position;
	                //console.log(`A ${this.enemies[i].name} moved to ${this[this.enemies[i].name].position.x}:${this[this.enemies[i].name].position.y}.`);
	                //this[this.enemies[i].name].position.x % 3 == 0 ? this[this.enemies[i].name].shoot() : ``;
	                this.enemies[i] = this[this.enemies[i].name].info;

	            });
                this.io.emit('gamestart', {enemies: this.enemies, obstacles: this.obstacles, player1: this.Player1});
                //console.log({enemies: this.enemies, obstacles: this.obstacles})
                
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

      tanksCollisionDetection(i,v) {
      	this.enemies.map((v2,j,arr) => { 
      		let i1 = i;
      		let i2 = j;
      		let v1 = v;
      		var a = v1.position.x - v2.position.x > 0 ? v1.position.x - v2.position.x : v2.position.x - v1.position.x;
			var b = v1.position.y - v2.position.y;
			let distance = Math.sqrt(a*a + b*b);
      		if (v.movementQ.length > 0 && v2.movementQ.length > 0 && 
      			distance < this.enemysize &&
      			v1.name !== v2.name) {
      			let vector = this[this.enemies[i].name].moveTo.vector > v2.position.x ? this.enemysize : -this.enemysize;
      			let escape = {axis: this[this.enemies[i].name].moveTo.axis, vector: vector/2};
      			this[this.enemies[i].name].movementQ = [];
      			this[this.enemies[i].name].movementQ.push(escape);
      			// let escape2 = {axis: this[this.enemies[j].name].moveTo.axis, vector: -(this[this.enemies[j].name].moveTo.vector)};	      			
      			// this[this.enemies[j].name].movementQ = [];
      			// this[this.enemies[j].name].movementQ.push(escape2,escape2,escape2,escape,escape);
      			console.log('collision distance:');
      			console.log(distance)
      			return;
      		}
		});
        };

        obstaclesCollisionDetection(i,v) {
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

}