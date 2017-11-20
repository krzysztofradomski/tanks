let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let port = process.env.PORT || 3000;
// let admin = require("firebase-admin");
// let serviceAccount = require("./key.json");
let Enemy = require('./Enemy.js')

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
	let enemy1config = {
		name: 'tank1', 
		level: 1, 
		speed: 10,
		origin: { x: 250, y: 250 },
		position: { x: 250, y: 250 },
		on: false
	};
	let enemy1 = new Enemy(io, enemy1config);

  	socket.on('start', function(){
  		console.log('started');
  		enemy1.start();
  	});
  	socket.on('stop', function(){
  		console.log('stopped');
	    enemy1.stop();
  	});
  	socket.on('reset', function(){
  		console.log('resetted');
	    enemy1.reset();
	    	console.log(enemy1.position);
  			console.log(enemy1.origin);
	    enemy1.start();
  	});
  	socket.on('disconnect', function(){
	    console.log('a user disconnected');
	    enemy1.reset();  
  	});
});

http.listen(port, function(){
  	console.log('listening on *:' + port);
});

