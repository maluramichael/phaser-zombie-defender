'use strict';

class Boom extends Phaser.State {

	preload() {
		this.game.load.image('base', 'assets/base.png');
		this.game.load.image('canon', 'assets/canon.png');
		this.game.load.image('ball', 'assets/ball.png');
		this.game.load.image('xp', 'assets/xp.png');
		this.game.load.image('background', 'assets/background.png');
		this.game.load.spritesheet('zombie', 'assets/zombie.png', 32, 32);

		this.game.load.tilemap('map', 'assets/tilemaps/map.json', null, Phaser.Tilemap.TILED_JSON);
		this.game.load.image('tiles', 'assets/tiles.png');
	}

	create() {
		// variables
		this.playerPosition = new Phaser.Point(64, this.game.world.height - 64);
		this.shootStrength = 300;
		this.enemySpeed = .1;
		this.xp = 0;
		this.xpToAdd = 0;

		// game
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		this.game.physics.arcade.gravity.y = 200;
		this.game.stage.backgroundColor = '#0072bc';

		// keys
		this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(this.shoot, this);
		this.game.input.keyboard.addKey(Phaser.Keyboard.X).onDown.add(this.spawnEnemy, this);

		// ui
		this.xpCounterImage = this.game.add.sprite(16, 16, 'xp');
		this.xpCounterText = this.game.add.text(48, 16, '0', {
			fill: 'white',
			font: '20px Arial'
		});

		// sprites
		this.enemies = this.game.add.group();
		this.enemies.enableBody = true;
		this.enemies.physicsBodyType = Phaser.Physics.ARCADE;

		this.balls = this.game.add.group();
		this.balls.enableBody = true;
		this.balls.physicsBodyType = Phaser.Physics.ARCADE;

		for (var x = 0; x < 10; x++) {
			var ball = this.game.add.sprite(0, 0, 'ball');
			this.balls.add(ball);
			ball.anchor.setTo(0.5, 0.5);
			this.game.physics.enable(ball, Phaser.Physics.ARCADE);
			ball.kill();
		}

		for (var y = 0; y < 300; y++) {
			var enemy = this.createEnemy();
			this.enemies.add(enemy);
			enemy.body.allowGravity = false;
			enemy.anchor.setTo(0.5, 1);
			enemy.kill();
		}

		this.canon = this.game.add.sprite(this.playerPosition.x, this.playerPosition.y, 'canon');
		this.base = this.game.add.sprite(this.playerPosition.x, this.playerPosition.y, 'base');

		this.canon.anchor.setTo(0.5, 1);
		this.base.anchor.setTo(0.5, 0.5);

		this.map = this.game.add.tilemap('map');
		this.map.addTilesetImage('Grass', 'tiles');
		this.layer = this.map.createLayer('Map');

		this.xpEmitter = this.game.add.emitter(0, 0, 100);
		this.xpEmitter.makeParticles('xp');
		this.xpEmitter.gravitiy = 0;
	}

	update() {

		this.game.physics.arcade.overlap(this.balls, this.enemies, this.hitHandler, null, this);

		if (this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
			this.canon.rotation -= .001 * this.game.time.elapsed;
			if (this.canon.rotation <= 0) {
				this.canon.rotation = 0;
			}
		}
		else if (this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
			this.canon.rotation += .001 * this.game.time.elapsed;
			if (this.canon.rotation >= Phaser.Math.PI2 / 4) {
				this.canon.rotation = Phaser.Math.PI2 / 4;
			}
		}

		for (var i = 0; i < this.enemies.children.length; i++) {
			let enemy = this.enemies.children[i];
			if (enemy && enemy.alive) {
				enemy.x -= this.enemySpeed * this.game.time.elapsed;
			}
		}

		if (this.xpToAdd - 1 >= 0) {
			this.xp++;
			this.xpToAdd--;
			this.xpCounterText.text = this.xp;
		}
	}

	render() {
	}

	hitHandler(ball, enemy) {
		this.xpEmitter.x = enemy.x;
		this.xpEmitter.y = enemy.y;

		this.xpEmitter.start(true, 2000, null, 10);
		this.xpToAdd += 10;

		ball.kill();
		enemy.kill();
	}

	createEnemy() {
		var enemy = this.game.add.sprite(0, 0, 'zombie');
		enemy.animations.add('walk', [12, 13, 14, 13]);
		enemy.animations.play('walk', 4, true);

		return enemy;
	}

	spawnEnemy() {
		var enemy = this.enemies.getFirstDead();
		if (enemy === null || enemy === undefined) return;
		enemy.revive();
		enemy.reset(this.game.width, this.game.height - 64);
	}

	shoot() {
		var ball = this.balls.getFirstDead();

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
		this.game = new Phaser.Game(1280, 448, Phaser.AUTO);

		this.game.state.add('boom', new Boom(this.game));
		this.game.state.start('boom');
	}
}

const game = new Game();