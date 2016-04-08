'use strict';

class Game {
	constructor() {
		this.game = new Phaser.Game(768, 768, Phaser.AUTO, '', {
			preload: this.preload,
			create: this.create,
			update: this.update
		});

		this.map = null;
	}

	preload() {
		const game = this.game;
		game.load.image('sheet', 'assets/RPGpack_sheet_2X.png');
	}

	create() {
		const game = this.game;
		var data =
			'0,1,1,1,1,2\n' +
			'20,21,21,21,21,22\n' +
			'20,21,21,21,21,22\n' +
			'20,21,21,21,21,22\n' +
			'20,21,21,21,21,22\n' +
			'40,41,41,41,41,42\n';
		console.log(data);

		const tileSize = 128;

		game.cache.addTilemap('dynamicMap', null, data, Phaser.Tilemap.CSV);
		this.map = game.add.tilemap('dynamicMap', tileSize, tileSize);
		this.map.addTilesetImage('sheet', 'sheet', tileSize, tileSize);
		this.layer = this.map.createLayer(0);
		this.layer.resizeWorld();
	}

	update() {
		const game = this.game;
	}
}

const game = new Game();