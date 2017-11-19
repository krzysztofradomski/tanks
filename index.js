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
	let enemy1 = new Enemy('tank', 1, 10, { x: 10, y: 10 });
	let enemy1on = null;
  	socket.on('start', function(){
  		enemy1.start();
    	enemy1on === null ? enemy1on = setInterval(function() {io.emit('start', enemy1.position);}, 100) : enemy1on;
  	});
  	socket.on('stop', function(){
  		clearInterval(enemy1on);
  		enemy1on = null;
	    enemy1.stop();
  	});
  	socket.on('disconnect', function(){
	    console.log('a user disconnected');
	    clearInterval(enemy1on);
	    enemy1on = null;
	    enemy1.reset();
	    enemy1.stop();
  	});
});

http.listen(port, function(){
  	console.log('listening on *:' + port);
});

