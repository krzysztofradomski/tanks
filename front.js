$(function () {
        let socket = io();
        let canvas = document.getElementById('myCanvas');
        let context = canvas.getContext('2d');
        let clean = {x:0,y:0};
        $('#start').click(function(){
          socket.emit('gamestart');
          return false;
        });
        $('#stop').click(function(){
          socket.emit('gamestop');
          return false;
        });
        $('#reset').click(function(){
          context.clearRect(0, 0, canvas.width, canvas.height);
          socket.emit('gamereset');
          return false;
        });
        socket.on('gamestart', function(msg){
            context.arc(clean.x, clean.y, 6, 0, 2 * Math.PI, false);
            context.fillStyle = 'red';
            let m = msg[0].x + ' ' + msg[0].y;
            clean = msg;
            console.log(m);
            context.clearRect(0, 0, canvas.width, canvas.height);
            let centerX = msg[0].x;
            let centerY = msg[0].y;
            let radius = 10;
            context.beginPath();
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
            context.fillStyle = 'green';
            context.fill();

            let ccenterX = msg[1].x;
            let ccenterY = msg[1].y;
            let rradius = 10;
            context.beginPath();
            context.arc(ccenterX, ccenterY, rradius, 0, 2 * Math.PI, false);
            context.fillStyle = 'blue';
            context.fill();

        });
        
      });