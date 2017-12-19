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

//intialize firebase related data
let db = admin.database();
let ref = db.ref("/scores");

app.get('/', (req, res) => {
  	res.sendFile(__dirname + '/index.html');
});
let counter = 0;
let games = [];
// games[counter] = new Game(socket);
// game = games[counter];
// game.init();

console.log('Game nr ' + counter + ' ' + 'created.');

io.on('connection', (socket) => {
	console.log('Connecting a new player to game nr ' + counter);
	if (!games[counter]) {
		games[counter] = new Game(counter, socket);
		game = games[counter];
		game.init();
	}
	game = games[counter];
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
		player =  games[counter].createPlayer();
	}

	if (player.name === "PlayerA" || player.name === "PlayerB") {
		console.log(player.name + ' connected.');
		socket.join(counter);
		game.io.to(counter).emit('ready');
		game.io.to(counter).emit('game-info', counter);
		console.log('Sent game interface ready to ' + player.name + '.');
  		socket.on('gamestart', () => {
  		
  		console.log('Game started.');
  		setTimeout(() => {game.start()},200);
  		//console.log(game.enemycount);
  	
	  	});
	  	socket.on('gamestop', () => {
	  		console.log('Game stopped.');
		    game.stop();
		   
	  	});
	  	socket.on('gamereset', () => {
	  		console.log('Game resetted.');
	  		game[player.name] = null;
	  		player = null;
	  		player = game.createPlayer();
	  		game.checkTopScores(ref);
		    game.reset();
		
	  	});
	  	socket.on('disconnect', () => {
		    console.log('A player disconnected.');
		    game.stop();	    
		    console.log('Deleting ' + player.name + '...');
		    game[player.name] = null;
		    if ( game.PlayerA === null && game.PlayerB === null) {
		    	//game.reset();
		    	//game = null;
		    	setTimeout(() => {game.stop()},500);
		    }
		     
	  	});
	  	socket.on('keypressed', (key) => {
	  		//console.log(key);
	  		player.move(key);
	  	});
	  	socket.on('gameoverplayerdata', (name) => {
	  		console.log(name ? 'Game over data received. Player name: ' + name : "Game over data received. No player name, not saving any data.");
		    if (name) {
		    	game.publishScore(ref, name, player);
		    };	
	  	});
	} 

});

http.listen(port, () => {
  	console.log('Server listening on *:' + port);
});
