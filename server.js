let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let port = process.env.PORT || 3000;
// let admin = require("firebase-admin");
// let serviceAccount = require("./key.json");
let Game = require('./Game.js')
let Tank = require('./Tank.js')
let Player = require('./Player.js')

// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://tanks-c0fa6.firebaseio.com"
// });

// //intialize firebase related data
// let db = admin.database();
// let ref = db.ref("/scores");

app.get('/', (req, res) => {
  	res.sendFile(__dirname + '/index.html');
});

let game = new Game(io);

game.init();

io.on('connection', (socket) => {
	console.log('Connecting a new player.');
	
	game = game || new Game(io);
	let player = game.createPlayer();

	if (player.name === "PlayerA" || player.name === "PlayerB") {
		console.log(player.name + ' connected.');
		game.io.emit('ready');
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
		    game.reset();
		
	  	});
	  	socket.on('disconnect', () => {
		    console.log('A player disconnected.');
		    game.stop();	    
		    console.log('Deleting ' + player.name + '...');
		    game[player.name] = null;
		    //game = null;
	 
	  	});

	  	socket.on('keypressed', (key) => {
	  		//console.log(key);
	  		player.move(key);
	  	});
	} else if (player === 'Player limit') {
		console.log('Too many players.');
	}

});

http.listen(port, () => {
  	console.log('Server listening on *:' + port);
});
