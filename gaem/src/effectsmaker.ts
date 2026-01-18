import { Graphics, Sprite } from "pixi.js";
let tick = 0;
const max = 40;
export function Trail(
  PixiSprite: Sprite,
  Clones: Graphics[],
  offsetX: number,
  offsetY: number,
) {
  // каждый фрейм тупо переставляем трейЛ
  tick += 1;
  if (tick == max) {
    tick = 0;
  }
  if (Clones === undefined || Clones.length == 0) {
    // на всякий
    console.log("Seems like everyone are dead");
  } else {
    Clones[tick].position.x = PixiSprite.position.x + offsetX;
    Clones[tick].position.y = PixiSprite.position.y + offsetY;
  }
}
