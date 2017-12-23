module.exports = class Player {

    constructor(io, config, obstacles) {
        this.config = config;
        this.name = config.name;
        this.level = config.level;
        this.lives = config.lives;
        this.score = config.score;
        this.origin = config.origin;
        this.position = config.position;
        this.color = config.color;
        ///this.running;
        this.sandbox = { x: 500, y: 500 };
        this.playersize = 50;
        this.drawsize = 25;
        this.obstacles = obstacles;
        this.missile = null;
        this.axis = '-y';
        this.vector = 25;
        this.gameOver = false;
    }

    get info() {
        if (this.name) {
            return {
                    name: this.name, 
                    level: this.level, 
                    lives: this.lives,
                    score: this.score,
                    color: this.color, 
                    origin: this.origin,
                    position: this.position 
                    };
        }
        return `Player does not exist`;
    }

    move(key) {
        
        switch (key) {
            case 'q':
                this.loading();
                break;
            case 'w', 'ArrowUp':
                this.position.y -= 10; 
                this.axis = '-y';
                break;
            case 's', 'ArrowDown':
                this.position.y += 10;          
                this.axis = 'y';
                 break;
            case 'a', 'ArrowLeft':
                this.position.x -= 10;         
                this.axis = '-x';
                break;
            case 'd', 'ArrowRight':
                this.position.x += 10;        
                this.axis = 'x';
                break;
           
            default:
                this.position.x += 0;
                this.position.y += 0;
        }
        if (this.position.x > this.sandbox.x-this.drawsize) {this.position.x = this.sandbox.x - this.drawsize;}
        if (this.position.y > this.sandbox.y-this.drawsize) {this.position.y = this.sandbox.y - this.drawsize;}
        if (this.position.x < 0) {this.position.x = 0;}
        if (this.position.y < 0) {this.position.y = 0;}
        this.obstaclesCollisionDetection();
    }

    reset(obst) {
         if (this.name) {
            let x = this.config.origin.x;
            let y = this.config.origin.y;
            let color = this.config.color;
            this.color = color;
            this.position = {x,y};
            this.obstacles = obst;
            return `Player resetted.`;
        }
        return `Player does not exist`;
    }

    start() {
        
        return `Player does not exist`;
    }

    stop() {
       
        return `Player does not exist`;
    }

    loading() {
        if (!this.missile) {  
            let position = this.position;
            let axis = this.axis;
            this.missile = {
                size: 10,
                position: {
                    x: position.x+this.drawsize/2,
                    y: position.y+this.drawsize/2
                },
                vector: -25,
                axis: 'y'
            };
             switch (axis) {
            case '-x':
                this.missile.vector = -25;
                this.missile.axis = 'x';
                break;
            case 'x':
                this.missile.vector = 25;
                this.missile.axis = 'x';
                break;
            case '-y':
                this.missile.vector = -25;
                this.missile.axis = 'y';
                break;
            case 'y':
                this.missile.vector = 25;
                this.axis = 'y';
                break;

        }
        }
    }

   shooting() {
        //this.loading();       
        if (!!this.missile) {
            this.missile.position[this.missile.axis] += this.missile.vector;
            if (this.missile.position.x > this.sandbox.x || 
                this.missile.position.y > this.sandbox.y || 
                this.missile.position.x < 0 ||
                this.missile.position.y < 0 ) {
                this.missile = null;
            }
            this.obstaclesHitDetection();     
        }
       
    }

    obstaclesCollisionDetection() {
        this.obstacles.map((v2,i,arr) => { 
            if (v2) {
                var a = this.position.x - v2.x > 0 ? this.position.x - v2.x : v2.x - this.position.x;
                var b = this.position.y - v2.y;
                let distance = Math.sqrt(a*a + b*b);
                if (distance < this.drawsize) {
                    if (this.position.x > v2.x) { //po prawej
                        this.position.x += v2.x+this.drawsize - this.position.x;
                    }
                    if (this.position.y > v2.y) { //u dolu
                        this.position.y += v2.y+this.drawsize - this.position.y;
                    }
                    if (this.position.x < v2.x) { //po lewej
                        this.position.x -= v2.x - this.position.x;
                    }
                    if (this.position.y < v2.y) { //u gory
                        this.position.y -= v2.y - this.position.y;
                    }
                }
            }
        });
    }

    obstaclesHitDetection() {
        this.obstacles.map((v2,i,arr) => { 
            if (this.missile && v2) {
                let v1 = this.missile;
                var a = (this.missile.position.x+this.missile.size/2) -  (v2.x+v2.size/2);
                var b = (this.missile.position.y+this.missile.size/2) - (v2.y+v2.size/2);
                let distance = Math.sqrt(a*a + b*b);
                if (distance < this.drawsize-this.missile.size && v2.on) {
                   console.log('Player suicide, game over.');
                   this.gameOver = true;
                }
                if (distance < this.drawsize-this.missile.size) {
                    this.obstaclesDestruction(v2);
                }
                
            }
        });
    }

    obstaclesDestruction(obstacle) {
        //console.log('obstacle destroyed by player');
        this.missile = null;
        this.obstacles.splice(this.obstacles.indexOf(obstacle), 1);
    }

};