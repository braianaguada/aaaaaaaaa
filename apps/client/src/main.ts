import Phaser from "phaser";
import "./style.css";
import { MainScene } from "./scenes/MainScene";

const game = new Phaser.Game({
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  parent: "game-root",
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: [MainScene]
});

void game;
