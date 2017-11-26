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


io.on('connection', function(socket){
	console.log('a user connected');
	let game = new Game(io);
	// let tank1config = {
	// 	name: 'tank1', 
	// 	level: 1, 
	// 	speed: 10,
	// 	origin: { x: 250, y: 250 },
	// 	position: { x: 250, y: 250 },
	// 	on: false
	// };
	// let tank1 = new Tank(io, tank1config);
	game.init();

	// let tank2config = {
	// 	name: 'tank2', 
	// 	level: 1, 
	// 	speed: 20,
	// 	origin: { x: 150, y: 150 },
	// 	position: { x: 150, y: 150 },
	// 	on: false
	// };
	// let tank2 = new Tank(io, tank2config);

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
  		console.log(key);
  		game.Player1.move(key);
  	});
});

http.listen(port, function(){
  	console.log('listening on *:' + port);
});

