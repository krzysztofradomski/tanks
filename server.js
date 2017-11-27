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
	console.log(player.name + ' connected.');

  	socket.on('gamestart', function(){
  		
  		console.log('started');
  		setTimeout(() => {game.start()},200);
  		//console.log(game.enemycount);
  		//console.log(game.enemy1)
  		//tank2.start();
  	});
  	socket.on('gamestop', function(){
  		console.log('stopped');
	    game.stop();
	    //tank2.stop();
  	});
  	socket.on('gamereset', function(){
  		console.log('resetted');
	    game.reset();
	    //tank2.reset();
	    //tank2.start();
  	});
  	socket.on('disconnect', function(){
	    console.log('a user disconnected');
	    game.stop();
	    game = null;
	    //tank2.reset();   
  	});

  	socket.on('keypressed', function(key){
  		//console.log(key);
  		player.move(key);
  	});
});

http.listen(port, function(){
  	console.log('listening on *:' + port);
});


