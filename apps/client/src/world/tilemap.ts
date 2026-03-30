import Phaser from "phaser";

export const createSimpleTilemap = (scene: Phaser.Scene): Phaser.Tilemaps.TilemapLayer => {
  const map = scene.make.tilemap({ tileWidth: 32, tileHeight: 32, width: 40, height: 30 });
  const tiles = map.addTilesetImage("tiles", undefined, 32, 32, 0, 0);

  const layer = map.createBlankLayer("ground", tiles);
  for (let y = 0; y < 30; y += 1) {
    for (let x = 0; x < 40; x += 1) {
      const index = x === 0 || y === 0 || x === 39 || y === 29 ? 1 : 0;
      layer.putTileAt(index, x, y);
    }
  }

  layer.setCollision(1);
  return layer;
};
