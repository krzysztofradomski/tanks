const app = require('express')();
const http = require('http').Server(app);
const express = require("express");
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
const admin = require("firebase-admin");
const serviceAccount = require("./key.json");
const Game = require('./Game.js')
const Tank = require('./Tank.js')
const Player = require('./Player.js')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://tanks-c0fa6.firebaseio.com"
});

const db = admin.database();
const ref = db.ref("/scores");

// app.get('/', (req, res) => {
//   	res.sendFile(__dirname + '/index.html');
// });
app.use(express.static("public"));

let counter = 0;
let games = [];
console.log('Game nr ' + counter + ' ' + 'created.');


io.on('connection', (socket) => {
	let room = counter;
    setTimeout(() => {games.splice(games.indexOf(games[room]), 1); console.log('Game nr ' + room + ' deleted.'); },5*60000); //delete game after 5mins
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
		console.log('Game nr ' + game.gameRoom + ' ' + 'created.');
		//player =  games[counter].createPlayer();
	}

	if (player.name === "PlayerA" || player.name === "PlayerB") {
		console.log(player.name + ' connected  to game nr ' + game.gameRoom + '.');
		socket.join(counter);
		game.io.to(counter).emit('ready', counter);
		game.io.to(counter).emit('game-info', counter);
		console.log('Sent game  ' + game.gameRoom + ' interface ready to ' + player.name + '.');
  		socket.on('gamestart', () => {
  		
  		console.log('Game  nr ' + game.gameRoom + ' started.');
  		setTimeout(() => {game.start()},100);
  		//console.log(game.enemycount);
  	
	  	});
	  	socket.on('gamestop', () => {
	  		console.log('Game nr ' + game.gameRoom + ' stopped.');
		    game.stop();	   
	  	});

	  	socket.on('gamereset', () => {
	  		console.log('Game  nr ' + game.gameRoom + ' resetted.');
	  		game[player.name] = null;
	  		player = null;
	  		player = game.createPlayer();
	  		game.checkTopScores(ref);
		    game.reset();
		
	  	});

	  	socket.on('disconnect', () => {
		    console.log('A player disconnected from game nr ' + game.gameRoom + '.');
		    //game.stop();	    
		    console.log('Deleting ' + player.name + ' from game nr ' + game.gameRoom + '.');
		    game[player.name] = null;
		    if ( game.PlayerA === null && game.PlayerB === null) {
		    	//game.reset();
		    	//game = null;
		    	setTimeout(() => {game.stop()},200);
		    	//setTimeout(() => {games.splice(games.indexOf(games[room]), 1); console.log('Game nr ' + room + ' deleted.'); },2000);
		    }	     
	  	});

	  	socket.on('keypressed', (key) => {
	  		player.move(key);
	  	});

	  	socket.on('gameoverplayerdata', (name, room) => {
	  		console.log(name ? 'Game over data received. Player name: ' + name : "Game over data received. No player name, not saving any data.");
		    if (name) {
		    	game.publishScore(ref, name, player);
		    };
		    //game[counter] = null;
		    counter = counter + 1;
		    setTimeout(() => {games.splice(games.indexOf(games[room]), 1); console.log('Game nr ' + room + ' deleted.'); },2000);
	  	});

	};

});

http.listen(port, () => {
  	console.log('Server listening on *:' + port);
});
