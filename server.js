let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let port = process.env.PORT || 3000;
let admin = require("firebase-admin");
let serviceAccount = require("./key.json");
let Game = require('./Game.js')
let Tank = require('./Tank.js')
let Player = require('./Player.js')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tanks-c0fa6.firebaseio.com"
});

let db = admin.database();
let ref = db.ref("/scores");

app.get('/', (req, res) => {
  	res.sendFile(__dirname + '/index.html');
});

let counter = 0;
let games = [];
console.log('Game nr ' + counter + ' ' + 'created.');


io.on('connection', (socket) => {

	console.log('Connecting a new player to game nr ' + counter + '.');

	if (!games[counter]) {
		games[counter] = new Game(counter, socket);
		game = games[counter];
		game.init();
	}
	//game = games[counter];
	let player =  games[counter].createPlayer();
	games[counter].checkTopScores(ref);

	if (player === 'Player limit') {
		console.log('Too many players.');
		console.log('Creating new game...');
		counter = counter + 1;
		games[counter] = new Game(counter, socket);
		game = games[counter];
		game.init();		
		console.log('Game nr ' + counter + ' ' + 'created.');
		//player =  games[counter].createPlayer();
	}

	if (player.name === "PlayerA" || player.name === "PlayerB") {
		console.log(player.name + ' connected  to game nr ' + counter + '.');
		socket.join(counter);
		game.io.to(counter).emit('ready');
		game.io.to(counter).emit('game-info', counter);
		console.log('Sent game  ' + counter + ' interface ready to ' + player.name + '.');
  		socket.on('gamestart', () => {
  		
  		console.log('Game  nr ' + counter + ' started.');
  		setTimeout(() => {game.start()},100);
  		//console.log(game.enemycount);
  	
	  	});
	  	socket.on('gamestop', () => {
	  		console.log('Game ' + counter + ' stopped.');
		    game.stop();	   
	  	});

	  	socket.on('gamereset', () => {
	  		console.log('Game  nr ' + counter + ' resetted.');
	  		game[player.name] = null;
	  		player = null;
	  		player = game.createPlayer();
	  		game.checkTopScores(ref);
		    game.reset();
		
	  	});

	  	socket.on('disconnect', () => {
		    console.log('A player disconnected from game nr ' + counter + '.');
		    //game.stop();	    
		    console.log('Deleting ' + player.name + ' from game nr ' + counter + '.');
		    game[player.name] = null;
		    if ( game.PlayerA === null && game.PlayerB === null) {
		    	//game.reset();
		    	//game = null;
		    	setTimeout(() => {game.stop()},200);
		    }	     
	  	});

	  	socket.on('keypressed', (key) => {
	  		player.move(key);
	  	});

	  	socket.on('gameoverplayerdata', (name) => {
	  		console.log(name ? 'Game over data received. Player name: ' + name : "Game over data received. No player name, not saving any data.");
		    if (name) {
		    	game.publishScore(ref, name, player);
		    };
		    //game[counter] = null;
		    counter = counter + 1;
	  	});

	};

});

http.listen(port, () => {
  	console.log('Server listening on *:' + port);
});
