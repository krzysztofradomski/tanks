let Tank = require('./Tank.js');
let Player = require('./Player.js');
let ObstacleSets = require('./ObstacleSets.js');
let Bunker = require('./Bunker.js');

module.exports = class Game {
	constructor(counter, socket, fb) {
		this.io = socket;
		this.enemysize = 50;
		this.drawsize = 25;
		this.obstaclesize = 25;
		this.on = false;
		this.refreshRate = 1000 / 25;
		this.tankspeed = 2; ///enemy tank speed, best if 3-5
		this.running;
		this.enemies = [];
		this.enemycount = 0;
		this.enemiesLimit = 5;
		this.sandbox = {
			x: 500,
			y: 500
		};
		this.obstacles = [];
		this.eagle = null;
		this.PlayerA = null;
		this.PlayerB = null;
		this.firebase = fb;
		this.topScores = [];
		this.gameRoom = counter;
		this.round = 1;
	}

	init() {
		this.enemycount = 0;
		//this.createObstacles();
		this.obstaclesGenerator();
		this.createEnemies();
		this.drawEagleBunker();
		this.drawEagle();
		//this.io.emit('ready');
		console.log('Game initialised.');

	}

	createPlayer() {
		let playerAConfig = {
			name: 'PlayerA',
			level: 1,
			lives: 5,
			score: 0,
			origin: {
				x: 50,
				y: 475
			},
			position: {
				x: 50,
				y: 475
			},
			color: 'green'
		};
		let playerBConfig = {
			name: 'PlayerB',
			level: 1,
			lives: 5,
			score: 0,
			origin: {
				x: 450,
				y: 475
			},
			position: {
				x: 450,
				y: 475
			},
			color: 'blue'
		};
		if (!this.PlayerA) {
			this.PlayerA = new Player(this.io, playerAConfig, this.obstacles);
			return this.PlayerA;
		} else if (!this.PlayerB) {
			this.PlayerB = new Player(this.io, playerBConfig, this.obstacles);
			return this.PlayerB;
		} else {
			return 'Player limit';
		}
	}

	createObstacles() {
		this.obstacles = [];
		this.obstacles = ObstacleSets.sets[parseInt(Math.random() * ObstacleSets.sets.length)];
	}

	createEnemy(roundSpeed, roundDifficulty) {
		if (this.enemies.length < this.enemiesLimit) {
			this.enemycount += 1;
			let enemyName = 'enemy' + this.enemycount;
			let x = parseInt(Math.random() * (this.sandbox.x - this.enemysize));
			let y = parseInt(Math.random() * (this.round * 50));
			let enemyConfig = {
				name: enemyName,
				level: 1,
				lives: roundDifficulty || 1,
				speed: this.tankspeed + (roundSpeed / 10) || this.tankspeed,
				origin: {
					x: x,
					y: y
				},
				position: {
					x: x,
					y: y
				}
			};
			this[enemyName] = new Tank(enemyConfig);

			this.enemies.push(this[enemyName].info);
		}
	}

	createEnemies() {
		this.enemycount = 0;
		this.enemies = [];
		for (let count = 0; count < this.enemiesLimit; count++) {
			this.createEnemy(this.round, this.round);
		}
	}

	obstaclesGenerator() {
		let random = (min, max) => {
			return Math.round((Math.random() * (max - min) + min) / this.obstaclesize) * this.obstaclesize;
		};
		for (let count = 0; count < this.enemiesLimit; count++) {
			let x = random(0, this.sandbox.x - this.obstaclesize);
			let y = random(0, 400);
			for (let times = 0; times < 3; times++) {
				x = x + this.obstaclesize;
				this.obstacles.push({
					size: this.obstaclesize,
					x: x,
					y: y
				});
			}
			x = random(0, this.sandbox.x - this.obstaclesize);
			for (let times = 0; times < 3; times++) {
				y = y - this.obstaclesize;
				this.obstacles.push({
					size: this.obstaclesize,
					x: x,
					y: y
				});
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
		};
		this.obstacles.push(this.eagle);
	}

	drawEagleBunker() {
		this.obstacles = this.obstacles.concat(Bunker.bunkerStructure);
	}

	checkRound() {
		if (this.enemies.length === 0 && (!this.PlayerA || !this.PlayerB)) {
			this.getNextRound();
		}
	}

	getRound() {
		return this.round;
	}

	getNextRound() {
		this.round++;
		this.enemiesLimit++;
		this.createEnemies();
		this.obstaclesGenerator();
	}

	reset() {
		if (this) {
			this.on = false;
			this.enemycount = 0;
			this.enemies = [];
			this.obstacles = [];
			this.init();
			if (this.PlayerA) {
				this.PlayerA.reset(this.obstacles);
			}
			if (this.PlayerB) {
				this.PlayerB.reset(this.obstacles);
			}
			clearInterval(this.running);
			setTimeout(() => {
				this.start();
			}, 500);
			return 'Game resetted.';
		}
		return 'Game does not exist';
	}

	start() {
		if (this && !this.on) {
			this.on = true;
			this.running = setInterval(() => {
				if (!!this.PlayerA || !!this.PlayerB) {
					if ((this.PlayerA === null && (this.PlayerB.gameOver || this.PlayerB.lives <= 0)) ||
						(this.PlayerB === null && (this.PlayerA.gameOver || this.PlayerA.lives <= 0))) {
						this.gameOver();
					}
				}
				if (this.PlayerA) {
					this.PlayerA.shooting();
					if (this.PlayerA.lives <= 0) {
						this.io.to(this.gameRoom).emit('askForScores');
						this.PlayerA = null;

					} else
					if (this.PlayerA.gameOver) {
						this.gameOver();
					}

				}
				if (this.PlayerB) {
					this.PlayerB.shooting();
					if (this.PlayerB.lives <= 0) {
						this.io.to(this.gameRoom).emit('askForScores');
						this.PlayerB = null;

					} else
					if (this.PlayerB.gameOver) {
						this.gameOver();
					}

				}
				this.checkRound();
				this.enemies.map((v, i) => {
					if (this.enemies[i] && this[this.enemies[i].name]) {
						this[this.enemies[i].name].move();
						this.tanksCollisionDetection(i, v);
						this.obstaclesCollisionDetection(i, v);
						this.obstaclesTankHitDetection(v);
						if (this.PlayerA) {
							this.playerCollisionDetection(i, v, this.PlayerA);
							this.playerHitDetection(v, this.PlayerA);
							this.playerScoreDetection(i, v, this.PlayerA);

						}
						if (this.PlayerB) {
							this.playerCollisionDetection(i, v, this.PlayerB);
							this.playerHitDetection(v, this.PlayerB);

							this.playerScoreDetection(i, v, this.PlayerB);
						}
						if (this.enemies[i] && this[this.enemies[i].name]) {
							//let pos = this[this.enemies[i].name].position;      
							this[this.enemies[i].name].shooting();
							this.enemies[i] = this[this.enemies[i].name].info;
						}
					}
				});
				this.io.to(this.gameRoom).emit('gamestart', {
					enemies: this.enemies,
					obstacles: this.obstacles,
					playerA: this.PlayerA,
					playerB: this.PlayerB,
					eagle: this.eagle,
					round: this.round,
					gameRoom: this.gameRoom
				});
				//console.log({enemies: this.enemies, obstacles: this.obstacles})

			}, this.refreshRate);
		}
	}

	stop() {
		if (this && this.on) {
			this.on = false;
			clearInterval(this.running);
			return 'Game stopped.';
		}
		return 'Game does not exist';
	}

	tanksCollisionDetection(i, v) {
		this.enemies.map((v2, j) => {
			if (this.enemies[j] && this[this.enemies[j].name]) {
				let v1 = v;
				let a = v1.position.x - v2.position.x > 0 ? v1.position.x - v2.position.x : v2.position.x - v1.position.x;
				let b = v1.position.y - v2.position.y;
				let distance = Math.sqrt(a * a + b * b);
				if (v.movementQ.length > 0 && v2.movementQ.length > 0 &&
					distance < this.drawsize &&
					v1.name !== v2.name) {
					let vector = this[this.enemies[i].name].moveTo.vector > v2.position.x ? this.enemysize : -this.enemysize;
					let escape = {
						axis: this[this.enemies[i].name].moveTo.axis,
						vector: vector / 2
					};
					this[this.enemies[i].name].movementQ = [];
					this[this.enemies[i].name].movementQ.push(escape);
					return;
				}
			}
		});
	}

	obstaclesCollisionDetection(i, v) {
		this.obstacles.map((v2) => {
			if (v && v2) {
				let v1 = v;
				let a = v1.position.x - v2.x > 0 ? v1.position.x - v2.x : v2.x - v1.position.x;
				let b = v1.position.y - v2.y;
				let distance = Math.sqrt(a * a + b * b);
				if (v.movementQ.length > 0 && distance < this.drawsize) {

					if (this[this.enemies[i].name].position.x > v2.x) { //po prawej
						this[this.enemies[i].name].position.x += v2.x + this.drawsize - this[this.enemies[i].name].position.x;
					}
					if (this[this.enemies[i].name].position.y > v2.y) { //u dolu
						this[this.enemies[i].name].position.y += v2.y + this.drawsize - this[this.enemies[i].name].position.y;
					}
					if (this[this.enemies[i].name].position.x < v2.x) { //po lewej
						this[this.enemies[i].name].position.x -= v2.x - this[this.enemies[i].name].position.x;
					}
					if (this[this.enemies[i].name].position.y < v2.y) { //u gory
						this[this.enemies[i].name].position.y -= v2.y - this[this.enemies[i].name].position.y;
					}
				}
			}
		});
	}

	playerCollisionDetection(i, v, player) {
		let a = v.position.x - player.position.x;
		let b = v.position.y - player.position.y;
		let distance = Math.sqrt(a * a + b * b);

		if (distance < this.drawsize) {
			player.color = 'orange';
			//console.log(player.name + ' - ' + v.name + ' collision.');
			player.lives -= 1;
		}
	}

	playerHitDetection(tank, player) {
		let missile = tank.missile;
		if (player && missile) {
			let a = (missile.position.x + missile.size / 2) - (player.position.x + this.drawsize / 2);
			let b = (missile.position.y + missile.size / 2) - (player.position.y + this.drawsize / 2);
			let distance = Math.sqrt(a * a + b * b);
			if (distance < this.drawsize / 2) {
				player.color = 'yellow';
				//console.log(player.name + ' hit by ' + tank.name);
				player.lives -= 1;
				this[tank.name].missile = null;
			}
		}
	}

	playerScoreDetection(index, tank, player) {
		let missile = player.missile;
		if (tank && missile) {
			let a = (missile.position.x + missile.size / 2) - (tank.position.x + this.drawsize / 2);
			let b = (missile.position.y + missile.size / 2) - (tank.position.y + this.drawsize / 2);
			let distance = Math.sqrt(a * a + b * b);
			if (distance < this.drawsize / 2) {
				this.killEnemyTank(tank, player);
			}
		}
	}

	obstaclesTankHitDetection(tank) {
		this.obstacles.map((v2) => {
			if (tank.missile && v2) {
				var a = tank.missile.position.x - v2.x > 0 ? tank.missile.position.x - v2.x : v2.x - tank.missile.position.x;
				var b = tank.missile.position.y - v2.y;
				let distance = Math.sqrt(a * a + b * b);
				if (distance < tank.drawsize - tank.missile.size) {
					this.obstaclesDestruction(tank, v2);
				}
				if (distance < tank.drawsize - tank.missile.size && v2.on) {
					this.gameOver();
				}
			}
		});

	}

	obstaclesDestruction(tank, obstacle) {
		//console.log('obstacle hit by ' + tank.name);
		this[tank.name].missile = null;
		this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
	}

	killEnemyTank(tank, player) {
		this.io.to(this.gameRoom).emit('enemyExplosion', tank.position);
		this[player.name].missile = null;
		this[tank.name].lives--;
		if (this[tank.name].lives <= 0) {
			this[tank.name].color = 'white';
			this[tank.name] = null;
			this.enemies.splice(this.enemies.indexOf(tank), 1);
			//console.log(tank.name + ' hit by ' + player.name);
			player.score += this.round;
		}
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
		this.io.to(this.gameRoom).emit('gameover', this.topScores);
		this.io.to(this.gameRoom).emit('scores', this.topScores);
		this;
		//this.publishScore();  	 	 
	}


	checkTopScores(firebase) {
		this.topScores = [];
		firebase.once('value').then((snapshot) => {
			let db = snapshot.val();
			let keys = Object.keys(db);
			let scores = [];
			let score = [];
			for (let i = 0; i < keys.length; i++) {
				score.push(db[keys[i]].name, db[keys[i]].score, db[keys[i]].date);
				scores.push(score);
				score = [];
			}
			scores
				.sort(function (a, b) {
					return a[1] - b[1];
				})
				.reverse();
			for (let j = 0; j < 3; j++) {
				if (scores[j]) {
					this.topScores.push('Name: ' + scores[j][0] + ', score: ' + scores[j][1] + ' points, date: ' + scores[j][2]);
				}

			}
			this.io.to(this.gameRoom).emit('scores', this.topScores);
		});

	}

	publishScore(firebase, nickname, player, room) {
		if (nickname) {
			let name = nickname;
			let score = player.score;
			let date = new Date(Date.now()).toLocaleDateString();
			let data = {
				name: name,
				score: score,
				date: date,
				game: room
			};
			firebase.push(data);
			console.log('Publishing data to firebase: ' + name + ' ' + score + ' ' + date);
			//console.log('this.topScores: ' + this.topScores);
		}
	}

};