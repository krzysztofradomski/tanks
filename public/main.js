window.onload = () => {

	setTimeout(() => {
		if (scoresData === null) {
			console.log('Room full, forcing reload to get a new game room.');
			location.reload();
		}
	}, 2000);

	let sprites = new Image();
	sprites.src = 'sprites.png';
	const enemyTanksPositions = {
		'x': 240,
		'-x': 161,
		'y': 208,
		'-y': 130,
		'1': 0,
		'2': 16,
		'3': 32,
		'4': 48,
		'5': 64,
		'6': 80,
		'7': 96,
		'8': 112
	};
	const playerPositions = {
		'x': 95,
		'-x': 50,
		'y': 65,
		'-y': 0,
		'playerA': 0,
		'playerB': 129
	};
	let enemyExplosionPosition = {
		'x': -50,
		'y': -50
	};
	let gameNumber = null;
	let scoresData = null;
	let canvas = document.getElementById('myCanvas');
	let context = canvas.getContext('2d');
	let socket = io();

	const drawScores = (data) => {
		//console.log(data);
		scoresData = data;
		for (let j = 0; j < 3; j++) {
			let suffix = j === 0 ? 'st' : j === 1 ? 'nd' : 'rd';
			let text = typeof data[j] !== 'undefined' ? (j + 1) + suffix + ' place: ' + data[j] + '.' : (j + 1) + suffix + ' place: ' + 'No data available.';
			//console.log(text);
			document.querySelectorAll('topscores p')[j].textContent = text;
		}
	};

	document.onkeydown = (e) => {
		e = e || window.event;
		if (e.key.match(/w|s|a|d|q/i)) {
			socket.emit('keypressed', e.key);
		}
	};

	document.getElementById('start').addEventListener('click', () => {
		socket.emit('gamestart');
		return false;
	});

	socket.on('ready', (data) => {
		document.getElementById('start').disabled = false;
		document.getElementById('reload').disabled = false;
		document.querySelector('gameover h2').style.display = 'none';
		document.querySelector('gameover h2').style.top = '-1000px';
		gameNumber = data;
		console.log('Using game room nr ' + gameNumber + '.');
	});

	socket.on('gamestart', (gamestate) => {
		//console.log(gamestate.playerA);    
		context.clearRect(0, 0, canvas.width, canvas.height);

		const drawEnemy = (enemy, round) => {
			let r = enemy.drawsize;
			let x = enemy.position.x;
			let y = enemy.position.y;
			let pos = (enemy.moveto.vector > 0 ? '' : '-') + enemy.moveto.axis;
			let version = round < 8 ? enemyTanksPositions[String(round)] : enemyTanksPositions[String((Math.random(1) * 8).toFixed(0))];
			context.drawImage(sprites, enemyTanksPositions[pos], version, 15, 15, x, y, r, r);
			context.drawImage(sprites, 271, 127, 17, 17, enemyExplosionPosition.x, enemyExplosionPosition.y, 25, 25);
		};
		const drawPlayer = (player) => {
			let lives = gamestate[player].lives;
			let score = gamestate[player].score;
			document.querySelector('stats ' + player + ' .scoreValue').textContent = score;
			document.querySelector('stats ' + player + ' .livesValue').textContent = lives;
			let playerSize = gamestate[player].drawsize;
			let playerX = gamestate[player].position.x;
			let playerY = gamestate[player].position.y;
			let pos = gamestate[player].axis;
			context.drawImage(sprites, playerPositions[pos], playerPositions[player], 15, 15, playerX, playerY, playerSize, playerSize);
			enemyExplosionPosition = {
				'x': -50,
				'y': -50
			};
		};
		const drawMissile = (who, size, color) => {
			if (who.missile) {
				let mr = who.missile.size / size;
				let mx = who.missile.position.x;
				let my = who.missile.position.y;
				context.beginPath();
				context.fillStyle = color;
				context.fillRect(mx, my, mr, mr);
			}
		};
		const drawObject = (obj, index) => {
			let size = index !== undefined ? obj[index].size : obj.size;
			let x = index !== undefined ? obj[index].x : obj.x;
			let y = index !== undefined ? obj[index].y : obj.y;
			context.beginPath();
			if (obj === gamestate.obstacles) {
				context.drawImage(sprites, 256, 0, 15, 15, x, y, size, size);
			}
			if (obj === gamestate.eagle) {
				context.drawImage(sprites, 305, 32, 15, 15, x, y, size, size);
			}
		};

		gamestate.enemies.map((tank) => {
			drawEnemy(tank, gamestate.round);
			if (tank.missile) {
				drawMissile(tank, 1, 'grey');
			}
		});

		gamestate.obstacles.map((brick, index) => {
			drawObject(gamestate.obstacles, index);
		});

		if (gamestate.playerA) {
			drawPlayer('playerA');
			drawMissile(gamestate.playerA, 2, 'orange');
		}
		if (gamestate.playerB) {
			drawPlayer('playerB');
			drawMissile(gamestate.playerB, 2, 'orange');
		}

		if (!!gamestate.eagle && gamestate.eagle.on) {
			drawObject(gamestate.eagle);
			let round = gamestate.round;
			if (document.getElementById('roundNumber').textContent != 'Round: ' + round) {
				document.getElementById('roundNumber').textContent = 'Round: ' + round;
			}
		}

	});

	socket.on('enemyExplosion', (position) => {
		enemyExplosionPosition = position;
		context.drawImage(sprites, 255, 128, 15, 15, enemyExplosionPosition.x, enemyExplosionPosition.y, 25, 25);
	});

	socket.on('scores', (topscoresdata) => {
		drawScores(topscoresdata);
	});

	socket.on('askForScores', () => {
		let playerName = prompt('Please enter your name (max 15 characters):', 'Player Unknown');
		if (playerName) {
			playerName = playerName.length > 15 ? playerName.slice(0, 15) + '...' : playerName;
		}
		socket.emit('gameoverplayerdata', playerName);
	});

	socket.on('gameover', (topscoresdata) => {
		//context.clearRect(0, 0, canvas.width, canvas.height);
		document.getElementById('start').disabled = true;
		setTimeout(() => {
			document.querySelector('gameover h2').style.top = '100px';
			context.clearRect(0, 0, canvas.width, canvas.height);
		}, 200);
		document.querySelector('gameover h2').style.display = 'block';
		drawScores(topscoresdata);
		setTimeout(() => {
			let playerName = prompt('Please enter your name (max 15 characters):', 'Player Unknown');
			if (playerName) {
				playerName = playerName.length > 15 ? playerName.slice(0, 15) + '...' : playerName;
			}
			socket.emit('gameoverplayerdata', playerName, gameNumber);
		}, 2200);
	});

};