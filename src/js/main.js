'use strict';

class Map {
	constructor(game) {
		this.game = game;
	}

	preload() {
		const game = this.game;
		game.load.image('sheet', 'assets/RPGpack_sheet_2X.png');

		this.map = null;
	}

	create() {
		const game = this.game;

		// Map
		const tileSize = 128;
		const grasMap =
			'0,1,1,1,1,2\n' +
			'20,21,21,21,21,22\n' +
			'20,21,21,21,21,22\n' +
			'20,21,21,21,21,22\n' +
			'20,21,21,21,21,22\n' +
			'40,41,41,41,41,42\n';


		game.cache.addTilemap('dynamicMap', null, grasMap, Phaser.Tilemap.CSV);
		this.map = game.add.tilemap('dynamicMap', tileSize, tileSize);
		this.map.addTilesetImage('sheet', 'sheet', tileSize, tileSize);
		this.layer = this.map.createLayer(0);
		this.layer.resizeWorld();


		// Objects

	}

	update() {
		const game = this.game;
	}
}

class Boom extends Phaser.State {

	preload() {
		this.game.load.image('base', 'assets/base.png');
		this.game.load.image('canon', 'assets/canon.png');
		this.game.load.image('ball', 'assets/ball.png');
	}

	create() {

		// variables
		this.playerPosition = new Phaser.Point(100, this.game.world.height);
		this.shootStrength = 300;

		// game
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 200;
		this.game.stage.backgroundColor = '#0072bc';

		// keys
		this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		this.spacebar.onDown.add(this.shoot, this);

		// sprites
		this.ballPool = this.game.add.group();
		for (var x = 0; x < 30; x++) {
			var ball = this.game.add.sprite(0, 0, 'ball');
			this.ballPool.add(ball);
			ball.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(ball, Phaser.Physics.ARCADE);
			ball.kill();
		}

		this.canon = this.game.add.sprite(this.playerPosition.x, this.playerPosition.y, 'canon');
		this.base = this.game.add.sprite(this.playerPosition.x, this.playerPosition.y, 'base');

		this.canon.anchor.setTo(0.5, 1);
		this.base.anchor.setTo(0.5, 0.5);
	}

	update() {
		const game = this.game;

		if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			this.canon.rotation -= .001 * game.time.elapsed;
			if (this.canon.rotation <= 0) {
				this.canon.rotation = 0;
			}
		}
		else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			this.canon.rotation += .001 * game.time.elapsed;
			if (this.canon.rotation >= Phaser.Math.PI2 / 4) {
				this.canon.rotation = Phaser.Math.PI2 / 4;
			}
		}
	}

	render() {
		this.game.debug.spriteInfo(this.canon, 32, 32);
	}

	shoot() {
		var ball = this.ballPool.getFirstDead();

		if (ball === null || ball === undefined) return;

		ball.revive();
		ball.checkWorldBounds = true;
		ball.outOfBoundsKill = true;

		var direction = new Phaser.Point(Math.sin(this.canon.rotation), Math.cos(this.canon.rotation));

		ball.reset(this.canon.x + (direction.x * 60), this.canon.y - (direction.y * 60));

		ball.body.velocity.x = direction.x * this.shootStrength;
		ball.body.velocity.y = -(direction.y * this.shootStrength);
	}
}

class Game {
	constructor() {
		this.game = new Phaser.Game(1200, 400, Phaser.AUTO);

		this.game.state.add('map', new Map(this.game));
		this.game.state.add('boom', new Boom(this.game));
		this.game.state.start('boom');
	}
}

const game = new Game();