let Tank = require('./Tank.js');
let Player = require('./Player.js');
let ObstacleSets = require('./ObstacleSets.js');
let Bunker = require('./Bunker.js');

module.exports = class Game {
    constructor(io, fb) {
        this.io = io;
        this.enemysize = 50;
        this.drawsize = 25;
        this.obstaclesize = 25;
        this.on = false;
        this.refreshRate = 1000 / 25;
        this.tankspeed = 4; ///enemy tank speed, best if 3-5
        this.running;
        this.enemies = [];
        this.enemycount = 0;
        this.enemiesLimit = 5;
        this.sandbox = { x: 500, y: 500 };
        this.obstacles = [];
        this.eagle = null;
        this.PlayerA = null;
        this.PlayerB = null;
        this.firebase = fb;
        this.topScores = [];
    };

    init() {
    	this.enemycount = 0;
        this.createObstacles();
    	this.createEnemies();
    	//this.io.emit('ready');
    	console.log('Game initialised.');
    	
    }

    createPlayer() {
    	let playerAConfig =  {
	    		name: 'PlayerA',
	    		level: 1,
	    		lives: 5,
	    		score: 0,
	    		origin: {x: 50, y: 480},
	    		position: {x: 50, y: 480},
	    		color: 'green'
	    }
	    let playerBConfig =  {
	    		name: 'PlayerB',
	    		level: 1,
	    		lives: 5,
	    		score: 0,
	    		origin: {x: 450, y: 480},
	    		position: {x: 450, y: 480},
	    		color: 'blue'
	    }
	    if (!this.PlayerA) {
	    	this.PlayerA = new Player(this.io, playerAConfig, this.obstacles);
	    	return this.PlayerA;
	    } else if (!this.PlayerB) {
	    	this.PlayerB = new Player(this.io, playerBConfig, this.obstacles);
	    	return this.PlayerB;
	    } else {return "Player limit"}
    }

    createObstacles() {
    	this.obstacles = [];
    	//this.obstaclesGenerator();
    	this.obstacles = ObstacleSets.sets[parseInt(Math.random() * ObstacleSets.sets.length)];
    	this.drawEagleBunker();
    	this.drawEagle();
    }

    createEnemy() {
    	if (this.enemies.length < 5) {
    		this.enemycount +=1;
    		let enemyName = 'enemy' + this.enemycount
	    	let x = parseInt(Math.random() * (this.sandbox.x-this.enemysize));
	    	let y = parseInt(Math.random() * (this.sandbox.y-100));
	    	let enemyConfig =  {
	    		name: enemyName,
	    		level: 1,
	    		lives: 1,
	    		speed: this.tankspeed,
	    		origin: {x: x, y: y},
	    		position: {x: x, y: y},
	    		on: false
	    	}
	    	this[enemyName] = new Tank (this.io, enemyConfig);

	    	this.enemies.push(this[enemyName].info);
    	}
    }

    createEnemies() {
    	this.enemycount = 0;
        this.enemies = [];
    	for (let count = 0; count < this.enemiesLimit; count++) {
    		this.createEnemy();
    	}
    		// console.log('enemies = ');
	    	// console.log(this.enemies);
	    	console.log('enemies number = ' + this.enemies.length);
    }

    obstaclesGenerator() {
    	for (let count = 0; count < this.enemiesLimit; count++) {
    		let x = parseInt(Math.random() * (this.sandbox.x-this.obstaclesize));
    		let y = parseInt(Math.random() * (this.sandbox.x-this.obstaclesize));
    		for (let times = 0; times < 3; times++) {
    			x = x + this.obstaclesize
    			this.obstacles.push({
	    			size: this.obstaclesize,
	    			x: x,
	    			y: y
    			})
    		};
    		x = parseInt(Math.random() * (this.sandbox.x-this.obstaclesize));
    		for (let times = 0; times < 3; times++) {
    			y = y - this.obstaclesize
    			this.obstacles.push({
	    			size: this.obstaclesize,
	    			x: x,
	    			y: y
    			})
    		} 	
    	}
    }

    drawEagle() {
	this.eagle = {
    	on: true,
    	size: 25,
    	x: 250,
    	y: 475,
    	color: 'grey'
    }
	this.obstacles.push(this.eagle);
    }

    drawEagleBunker() {
    	this.obstacles = this.obstacles.concat(Bunker.bunkerStructure);
    };

    reset() {
        if (this) {
            this.on = false;
            this.enemycount = 0;
            this.enemies = [];
            this.obstacles = [];
            this.init();
           if (this.PlayerA) {
        		this.PlayerA.reset(this.obstacles);
        	};
        	if (this.PlayerB) {
        		this.PlayerB.reset(this.obstacles);
        	};
            clearInterval(this.running);
           
            setTimeout(() => {this.start()},500);
            return `Game resetted.`;
        }
        return `Game does not exist`;
    }

    start() {
        if (this && !this.on) {
            this.on = true;
            this.running = setInterval(() => {
            	if (this.PlayerA.gameOver) this.gameOver();
            	if (this.PlayerA.lives <= 0) this.gameOver();
	            if (!!this.PlayerA) {
	      			this.PlayerA.shooting();
	      			if (this.PlayerA.gameOver) this.gameOver()     					
  				}
  				if (!!this.PlayerB) {
  					this.PlayerB.shooting();
  					if (this.PlayerB.gameOver) this.gameOver()
  				}
  				if (Date.now() % 11 === 0 ) {
  					this.createEnemy();	
  				}
      			this.enemies.map((v,i) => {
      				if (this.enemies[i] && this[this.enemies[i].name]) {
      				this[this.enemies[i].name].move();
      				this.tanksCollisionDetection(i,v);
      				this.obstaclesCollisionDetection(i,v);
      				this.obstaclesTankHitDetection(v);
      				if (!!this.PlayerA) {
      					this.playerCollisionDetection(i,v, this.PlayerA);
      					this.playerHitDetection(v, this.PlayerA);
      					this.playerScoreDetection(i, v, this.PlayerA);
      					;
      					
      				}
      				if (!!this.PlayerB) {
      					this.playerCollisionDetection(i,v, this.PlayerB);
      					this.playerHitDetection(v, this.PlayerB)
      			
      					this.playerScoreDetection(i, v, this.PlayerB);
      				}
      				if (this.enemies[i] && this[this.enemies[i].name]) {
	                //let pos = this[this.enemies[i].name].position;      
	                this[this.enemies[i].name].shooting();
	                this.enemies[i] = this[this.enemies[i].name].info;
	                }
	            };
      		})
                this.io.emit('gamestart', {enemies: this.enemies, obstacles: this.obstacles, playerA: this.PlayerA, playerB: this.PlayerB, eagle: this.eagle});
                //console.log({enemies: this.enemies, obstacles: this.obstacles})
                
            }, this.refreshRate)
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
      		if (this.enemies[j] && this[this.enemies[j].name]) {
	      		let i1 = i;
	      		let i2 = j;
	      		let v1 = v;
	      		let a = v1.position.x - v2.position.x > 0 ? v1.position.x - v2.position.x : v2.position.x - v1.position.x;
				let b = v1.position.y - v2.position.y;
				let distance = Math.sqrt(a*a + b*b);
	      		if (v.movementQ.length > 0 && v2.movementQ.length > 0 && 
	      			distance < this.drawsize &&
	      			v1.name !== v2.name) {
	      			let vector = this[this.enemies[i].name].moveTo.vector > v2.position.x ? this.enemysize : -this.enemysize;
	      			let escape = {axis: this[this.enemies[i].name].moveTo.axis, vector: vector/2};
	      			this[this.enemies[i].name].movementQ = [];
	      			this[this.enemies[i].name].movementQ.push(escape);
	      			return;
	      		}
      		}
		});
    };

    obstaclesCollisionDetection(i,v) {
      	this.obstacles.map((v2,j,arr) => { 
      		if (v && v2){
      			let i1 = i;
	      		let i2 = j;
	      		let v1 = v;
	      		let a = v1.position.x - v2.x > 0 ? v1.position.x - v2.x : v2.x - v1.position.x;
				let b = v1.position.y - v2.y;
				let distance = Math.sqrt(a*a + b*b);
	      		if (v.movementQ.length > 0 && distance < this.drawsize) {

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

	      			//console.log('obstacle collision distance:');
	      			//console.log(distance)
	      			return;
	      		}
			};
      	})
 	};

 	playerCollisionDetection(i,v, player) {
 		let a = v.position.x - player.position.x;
		let b = v.position.y - player.position.y;
		let distance = Math.sqrt(a*a + b*b);

		if (distance < this.drawsize) {
			player.color = "orange";
			console.log(player.name + ' - ' + v.name + ' collision.');
			player.lives -= 1;
 		}
 	};

 	playerHitDetection(tank, player) {
 	   let missile = tank.missile;
       if (player && missile) {
	       	let a = (missile.position.x+missile.size/2) - (player.position.x + this.drawsize/2);
	        let b = (missile.position.y+missile.size/2) - (player.position.y + this.drawsize/2);
	        let distance = Math.sqrt(a*a + b*b);
	        if (distance < this.drawsize/2 ) {
	            player.color = "yellow";
	            console.log(player.name + ' hit by ' + tank.name);
	            player.lives -= 1;
	            this[tank.name].missile = null;
	        };
       }    
	};

	playerScoreDetection(index, tank, player) {
 	   let missile = player.missile;
       if (tank && missile) {
	       	let a = (missile.position.x+missile.size/2) - (tank.position.x + this.drawsize/2);
	        let b = (missile.position.y+missile.size/2) - (tank.position.y + this.drawsize/2);
	        let distance = Math.sqrt(a*a + b*b);
	        if (distance < this.drawsize/2 ) {
	        	this[player.name].missile = null;
	            this[tank.name].color = 'white';
	            this[tank.name] = null;
	            this.enemies.splice(this.enemies.indexOf(tank), 1);
	            console.log(tank.name + ' hit by ' + player.name);
	            player.score += 1;         
	           
	        };
       }    
	};

    obstaclesTankHitDetection(tank) {
        this.obstacles.map((v2,i,arr) => { 
            if (tank.missile && v2) {
                let v1 = tank.missile;
                var a = tank.missile.position.x - v2.x > 0 ? tank.missile.position.x - v2.x : v2.x - tank.missile.position.x;
                var b = tank.missile.position.y - v2.y;
                let distance = Math.sqrt(a*a + b*b);
                if (distance < tank.drawsize-tank.missile.size) {
                    this.obstaclesDestruction(tank, v2);
                }
                if (distance < tank.drawsize-tank.missile.size && v2.on) {          
                   this.gameOver();
                }
            }
        });

    };

    obstaclesDestruction(tank, obstacle) {
        //console.log('obstacle hit by ' + tank.name);
       	this[tank.name].missile = null;
        this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
    }

    gameOver() {    	 
    	this.stop();
	    this.on = false;
        this.enemycount = 0;
        this.enemies = [];
        this.obstacles = [];
        this.PlayerA = null;
        this.PlayerB = null;
        this.eagle = null;
    	console.log('Game Over');
    	this.io.emit('gameover', this.topScores);
    	 //this.publishScore();  	 	 
    }

    gameOverClient() {
    }

	 checkTopScores(firebase) {
	 	this.topScores = [];
	    firebase.once("value").then( (snapshot) => {
		    let db = snapshot.val();
		    let keys = Object.keys(db);
		    let scores = [];
		    let score = [];
		    for (let i = 0; i < keys.length; i++) {
		        score.push(db[keys[i]].name, db[keys[i]].score, db[keys[i]].date);
		        scores.push(score);
		        score = [];
		    };
			scores
			    .sort(function(a, b) {
			      return a[1] - b[1];
			    })
			    .reverse();
			for (let j = 0; j < 3; j++) {
			    this.topScores.push("Name: " + scores[j][0] + ", score: " + scores[j][1] + ", date: " + scores[j][2])	   
			};
		})
		
    }

    publishScore(firebase, nickname, player) {
    	if (!!nickname) {
    		let name = nickname;
	    	let score = player.score;
	    	let date = new Date(Date.now()).toLocaleTimeString() + ' on ' + new Date(Date.now()).toLocaleDateString();
	    	let data = {
			    name: name,
			    score: score,
			    date: date
			};
	    	firebase.push(data);
			console.log('Publishing data to firebase: ' + name + ' ' + score + ' ' + date)
			console.log('this.topScores: ' + this.topScores);
	    	}
    }

}