import { Sprite, Graphics, Application } from "pixi.js";
import { Howl } from "howler";
import { Trail } from "./effectsmaker";

const Clones: Graphics[] = [];
let IsRoof = true;
let CalculatedSize = innerWidth / 1000;
console.log(CalculatedSize);
const max = 40;
let IsPC = true;
export function Create(app: Application) {
  for (let i = 0; i < max; i++) {
    const Clone = new Graphics()
      .rect(-125, -125, 250, 250)
      .fill("rgba(255, 166, 0, 1)");
    Clone.zIndex = -1;
    Clone.scale.set(CalculatedSize * 0.6);
    app.stage.addChild(Clone);
    Clones.push(Clone);
  }
}
export function DeleteTrail() {
  for (let _ = 0; _ < max; _++) {
    Clones.pop();
  }
}
export function ChangeCalculatedsize(newSize: number) {
  CalculatedSize = newSize;
}
export function roofenabla(ison: boolean) {
  IsRoof = ison;
}

window.addEventListener("touchmove", () => {
  IsPC = false;
});

export class Collidable {
  startx: number;
  size: number;
  starty: number;
  PixiSprite: Sprite;
  Collidable!: boolean;
  HitSound: Howl;
  plusyskorenie!: number;

  update: (time: number, mouseX: number, mouseY: number) => void;
  collisiontest: (otherSprite: Sprite) => boolean;
  updateinertia: (x: number, y: number) => void;
  readinertia: () => [number, number];
  readyskorenie: () => number;
  updatestaticyskorenie: (newyskorenie: number) => void;
  updatedelta: (x: number, y: number) => void;

  public constructor(
    startx: number,
    starty: number,
    size: number,
    PixiSprite: Sprite,
    Collidable: boolean,
    HitSound: Howl,
  ) {
    this.startx = startx;
    this.starty = starty;
    this.size = size;
    this.PixiSprite = PixiSprite;
    this.HitSound = HitSound;

    // set some variablyas
    PixiSprite.scale.set(size);
    PixiSprite.anchor.set(0.5);
    PixiSprite.position.set(startx, starty);
    PixiSprite.eventMode = "static";
    let yskorenie = 0;
    const plusyskorenie = CalculatedSize * 0.6;
    let IsHolding = false;
    let dx = 0;
    let dy = 0;
    let cd = true; // cooldown for touching ground
    let pitchCount = 0; // сделано для того чтобы звук удара звучал ниже и ниже при каждом ударе кота

    const inertia = {
      x: 0,
      y: 0,
    };

    PixiSprite.on("pointerdown", () => {
      IsHolding = true;
    });

    PixiSprite.on("pointerup", () => {
      IsHolding = false;
      inertia.x = dx;
      inertia.y = dy;
    });

    PixiSprite.on("pointertap", () => {
      if (dx == 0 && dy == 0) {
        inertia.x = 100;
        inertia.y = 100;
      }
    });

    this.updateinertia = function (inertiax: number, inertiay: number) {
      inertia.x = inertiax;
      inertia.y = inertiay;
    };
    this.readinertia = function () {
      return [inertia.x, inertia.y];
    };
    this.updatestaticyskorenie = function (newyskorenie: number) {
      yskorenie = newyskorenie;
    };
    this.readyskorenie = function () {
      return yskorenie;
    };

    this.updatedelta = function (dxnew: number, dynew: number) {
      dx = dxnew;
      dy = dynew;
    };

    // checking collision with other sprite
    this.collisiontest = function (otherSprite: Sprite) {
      if (Collidable == false) {
        return false;
      }
      const bounds1 = PixiSprite.getBounds(false);
      const bounds2 = otherSprite.getBounds(false);

      return (
        bounds1.x < bounds2.x + bounds2.width &&
        bounds1.x + bounds1.width > bounds2.x &&
        bounds1.y < bounds2.y + bounds2.height &&
        bounds1.y + bounds1.height > bounds2.y
      );
    };

    this.update = function (time: number, mouseX: number, mouseY: number) {
      // cool trail

      Trail(PixiSprite, Clones, 0, 0);

      // applying physic forces
      if (IsHolding == true) {
        PixiSprite.rotation = Math.sin(time / 10) / 50;
        if (IsPC == true) {
          // for pc
          PixiSprite.position.y = PixiSprite.position.y + dy;
          PixiSprite.position.x = PixiSprite.position.x + dx;
        } else {
          // for mobile
          PixiSprite.position.y = mouseY;
          PixiSprite.position.x = mouseX;
        }
        yskorenie = 0;
        cd = true;
        pitchCount = 0;
      } else {
        PixiSprite.rotation = 0;
        PixiSprite.position.y += yskorenie + inertia.y;
        PixiSprite.position.x += inertia.x;
        inertia.x *= 0.99;
        inertia.y *= 0.99;
        yskorenie += plusyskorenie;

        // checking for collisions

        // below zero
        if (
          PixiSprite.position.y + PixiSprite.bounds.bottom * size >
          innerHeight
        ) {
          yskorenie *= 0.7;
          inertia.x *= 0.8;
          PixiSprite.position.y = innerHeight - PixiSprite.bounds.bottom * size;
          if (cd == true) {
            cd = false;
            pitchCount += 1;
            HitSound.play();
          }
        }
        //bottom
        if (
          PixiSprite.position.y + PixiSprite.bounds.bottom * size >=
          innerHeight
        ) {
          inertia.y = -yskorenie - inertia.y;
          inertia.y *= 0.9;
        }

        // top
        if (IsRoof == true) {
          if (PixiSprite.position.y + PixiSprite.bounds.top * size <= 0) {
            inertia.y = -yskorenie - inertia.y * 0.8;
            cd = true;
            pitchCount += 1;
            HitSound.play();
          }
        }

        // right
        if (
          PixiSprite.position.x + PixiSprite.bounds.right * size >=
          innerWidth
        ) {
          inertia.x = -inertia.x;
          cd = true;
          pitchCount += 1;
          HitSound.play();
        }
        // left
        if (PixiSprite.position.x + PixiSprite.bounds.left * size <= 0) {
          inertia.x = -inertia.x;
          cd = true;
          pitchCount += 1;
          HitSound.play();
        }

        HitSound.rate(1 + pitchCount / 20);

        // if stuck in top
        if (IsRoof == true) {
          if (PixiSprite.position.y + PixiSprite.bounds.top * size < 0) {
            PixiSprite.position.y = PixiSprite.bounds.bottom * size;
          }
        }

        // if stuck in right
        if (
          PixiSprite.position.x + PixiSprite.bounds.right * size >
          innerWidth
        ) {
          PixiSprite.position.x =
            innerWidth + PixiSprite.bounds.left * size - 1;
        }

        // if stuck in left
        if (PixiSprite.position.x + PixiSprite.bounds.left * size < 0) {
          PixiSprite.position.x = 0 - PixiSprite.bounds.left * size + 1;
        }
      }
    };
  }
}
