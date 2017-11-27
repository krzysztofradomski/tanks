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
// let ref = db.ref("/convos");

app.get('/', function(req, res){
  	res.sendFile(__dirname + '/index.html');
});

let game = new Game(io);

	game.init();

io.on('connection', function(socket){
	console.log('a user connected');
	game.io.emit('ready');
	let player = game.createPlayer();

	if (player.name === "PlayerA" || player.name === "PlayerB") {
		console.log(player.name + ' connected.');

  		socket.on('gamestart', function(){
  		
  		console.log('started');
  		setTimeout(() => {game.start()},200);
  		//console.log(game.enemycount);
  	
	  	});
	  	socket.on('gamestop', function(){
	  		console.log('stopped');
		    game.stop();
		   
	  	});
	  	socket.on('gamereset', function(){
	  		console.log('resetted');
		    game.reset();
		
	  	});
	  	socket.on('disconnect', function(){
		    console.log('a user disconnected');
		    game.stop();
		    game = null;
	 
	  	});

	  	socket.on('keypressed', function(key){
	  		//console.log(key);
	  		player.move(key);
	  	});
	} else if (player.name === 'Player limit') {
		console.log('Too many players.')
	}

});

http.listen(port, function(){
  	console.log('listening on *:' + port);
});


