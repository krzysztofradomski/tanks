let Tank = require('./Tank.js')
module.exports = class Game {
    constructor(io) {
        this.io = io;
        this.on = false;
        this.speed = 100;
        this.running;
        this.tanks = [];
    };
    create() {
        let tank1config = {
            name: 'tank1',
            level: 1,
            speed: 10,
            origin: { x: 250, y: 250 },
            position: { x: 250, y: 250 },
            on: false
        };
        this.tank1 = new Tank(this.io, tank1config);
        let tank2config = {
		        name: 'manowar', 
		        level: 19, 
		        speed: 20,
		        origin: { x: 150, y: 150 },
		        position: { x: 150, y: 150 },
		        on: true
		    };
		this.tank2 = new Tank(this.io, tank2config);
		console.log(tank2config)
    }

    reset() {
        if (this) {
            this.on = false;
            clearInterval(this.running);
            let x = this.tank1.origin.x;
            let y = this.tank1.origin.y;
            this.tank1.position = { x, y };
            x = this.tank2.origin.x;
            y = this.tank2.origin.y;
            this.tank2.position = { x, y };

            return `Game resetted.`;
        }
        return `Game does not exist`;
    }

    start() {
        if (this) {
            this.on = true;
            this.running = setInterval(() => {
                this.tank1.move();
                let pos1 = this.tank1.position;
                console.log(`A ${this.tank1.name} moved to ${this.tank1.position.x}:${this.tank1.position.y}.`);
                this.tank1.position.x % 3 == 0 ? this.tank1.shoot() : ``;
                //this.tanks.push(pos1);

                this.tank2.move();
                let pos2 = this.tank2.position;
                console.log(this.tank2.position)
                console.log(`A ${this.tank2.name} moved to ${this.tank2.position.x}:${this.tank2.position.y}.`);
                this.tank2.position.x % 3 == 0 ? this.tank2.shoot() : ``;
                this.tanks = [pos1, pos2];
                console.log('this.tanks = ' + this.tanks)

                this.io.emit('gamestart', this.tanks);
            }, 100)
        }
    }

     stop() {
        if (this) {
            this.on = false;
            clearInterval(this.running);
            return `Game stopped.`;
        }
        return `Game does not exist`;
    }

}