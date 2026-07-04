import { Sprite, Graphics, Application } from "pixi.js";
import { Trail } from "./effectsmaker";

const Clones: Graphics[] = [];
const Collidables: Collidable[] = [];
let IsRoof = true;
let IsForce: boolean | undefined = false;
//let countOfCollides = 0;
let CalculatedSize = (innerWidth + innerHeight) / 1500;
console.log(CalculatedSize);
let amount = 10;
const max = 80;
//const IsPC = false;

// create trailol
export function Create(app: Application) {
  for (let i = 0; i < max; i++) {
    const Clone = new Graphics()
      .rect(-125, -125, 250, 250)
      .fill("rgba(255, 166, 0, 1)");
    Clone.zIndex = -1;
    Clone.scale.set(CalculatedSize * 0.4);
    app.stage.addChild(Clone);
    Clones.push(Clone);
  }
}

// delete trail :(
export function DeleteTrail() {
  for (let _ = 0; _ < max; _++) {
    Clones.pop();
  }
}

export function writeCollidablesIntoArray(collidablesArray: Collidable[]) {
  for (let i = 0; i < amount; i++) {
    Collidables.push(collidablesArray[i]);
  }
}
export function deleteAllCollidablesFromArray() {
  for (let _ = 0; _ < amount; _++) {
    Collidables.pop();
  }
  amount = Number(document.querySelector("#numberofshashkas")?.textContent);
}
/*export function readCountValue() {
  return countOfCollides;
}*/

export function ChangeCalculatedsize(newSize: number) {
  CalculatedSize = newSize;
}
export function roofenabla(ison: boolean) {
  IsRoof = ison;
  return ison;
}
export function forceenabla(ison?: boolean) {
  if (ison === undefined) {
    return IsForce;
  }
  IsForce = ison;
}
//window.addEventListener("touchmove", () => {
//  IsPC = false;
//});

export class Collidable {
  Name: string;
  startx: number;
  size: number;
  starty: number;
  PixiSprite: Sprite;
  Collidable!: boolean;
  plusyskorenie!: number;

  update: (time: number, mouseX: number, mouseY: number) => void;
  updateinertia: (x: number, y: number) => void;
  readinertia: () => [number, number];
  readyskorenie: () => number;
  updatestaticyskorenie: (newyskorenie: number) => void;
  updatedelta: (x: number, y: number) => void;

  public constructor(
    Name: string,
    startx: number,
    starty: number,
    size: number,
    PixiSprite: Sprite,
    Collidable: boolean,
  ) {
    this.Name = Name;
    this.startx = startx;
    this.starty = starty;
    this.size = size;
    this.PixiSprite = PixiSprite;

    // set some variablyas
    PixiSprite.scale.set(size);
    PixiSprite.anchor.set(0.5);
    PixiSprite.position.set(startx, starty);
    PixiSprite.eventMode = "static";
    let yskorenie = 0;
    const plusyskorenie = CalculatedSize * 0.6;
    let IsHolding = false;
    const DeltaXY = {
      dx: 0,
      dy: 0,
    };
    let cd = true; // cooldown for touching ground
    let CPF = 0; // collisions per frame

    const inertia = {
      x: 0,
      y: 0,
    };

    PixiSprite.on("pointerdown", () => {
      IsHolding = true;
    });

    PixiSprite.on("pointerup", () => {
      IsHolding = false;
      inertia.x = DeltaXY.dx;
      inertia.y = DeltaXY.dy;
    });

    PixiSprite.on("pointertap", () => {
      if (DeltaXY.dx == 0 && DeltaXY.dy == 0 && IsForce) {
        inertia.x = 100;
        inertia.y = -100;
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
      DeltaXY.dx = dxnew;
      DeltaXY.dy = dynew;
    };

    // checking collision with other sprite
    function collisiontest(otherCollidable: Collidable) {
      // чтобы сами себя не засчитываил
      if (Collidable == false || Name == otherCollidable.Name) {
        return false;
      }

      const bounds1 = PixiSprite.getBounds(false);
      const bounds2 = otherCollidable.PixiSprite.getBounds(false);

      return (
        Math.min(bounds1.x, bounds1.x - inertia.x) <
          bounds2.x + bounds2.width &&
        Math.max(bounds1.x + bounds1.width, bounds1.x - inertia.x) >
          bounds2.x &&
        Math.min(bounds1.y, bounds1.y - inertia.y) <
          bounds2.y + bounds2.height &&
        Math.max(bounds1.y, bounds1.y - inertia.y) + bounds1.height > bounds2.y
      );
    }

    this.update = function (time: number, mouseX: number, mouseY: number) {
      CPF = 0;

      // cool trail

      Trail(PixiSprite, Clones, 0, 0);

      // applying physic forces
      if (IsHolding == true) {
        PixiSprite.rotation = Math.sin(time / 10) / 50;
        inertia.x = 0;
        inertia.y = 0;
        yskorenie = 0;
        PixiSprite.position.y = mouseY;
        PixiSprite.position.x = mouseX;
        cd = true;
      } else {
        PixiSprite.rotation = 0;
        PixiSprite.position.y += yskorenie + inertia.y;
        PixiSprite.position.x += inertia.x;
        inertia.x *= 0.99;
        inertia.y *= 0.99;
        yskorenie += plusyskorenie;

        // checking for collision with walls

        // floor
        if (
          PixiSprite.position.y + PixiSprite.bounds.bottom * size >
          innerHeight
        ) {
          yskorenie *= 0.7;
          inertia.x *= 0.8;
          inertia.y = -yskorenie - inertia.y;
          inertia.y *= 0.9;
          PixiSprite.position.y = innerHeight - PixiSprite.bounds.bottom * size;
          if (cd == true) {
            cd = false;
          }
        }

        // top
        if (IsRoof == true) {
          if (PixiSprite.position.y + PixiSprite.bounds.top * size < 0) {
            inertia.y = -yskorenie - inertia.y * 0.6;
            cd = true;
          }
        }

        // right
        if (
          PixiSprite.position.x + PixiSprite.bounds.right * size >
          innerWidth
        ) {
          inertia.x = -inertia.x;
          cd = true;
          //countOfCollides++;
        }
        // left
        if (PixiSprite.position.x + PixiSprite.bounds.left * size < 0) {
          inertia.x = -inertia.x;
          cd = true;
          //countOfCollides++;
        }

        // if stuck in top
        if (IsRoof == true) {
          if (PixiSprite.position.y + PixiSprite.bounds.top * size < 0) {
            PixiSprite.position.y = PixiSprite.bounds.bottom * size;
            inertia.y *= 0.8;
          }
        }

        //* if stuck in right
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

        // checking for collisions\

        for (let i = 0; i < amount; i++) {
          if (collisiontest(Collidables[i]) == true) {
            CPF++;
            // top check
            if (
              PixiSprite.position.y - Collidables[i].PixiSprite.position.y >=
              CalculatedSize *
                (350 - Math.abs(Collidables[i].readinertia()[1])) *
                0.2
            ) {
              Collidables[i].PixiSprite.position.y =
                PixiSprite.position.y - PixiSprite.getSize().height;
              Collidables[i].updatestaticyskorenie(1.1 * (plusyskorenie / CPF));
              yskorenie = 1.1 * (plusyskorenie / CPF);
              Collidables[i].updateinertia(
                Collidables[i].readinertia()[0] * 0.8,
                -Collidables[i].readinertia()[1] * 0.7,
              );
            }
            // right check
            if (
              (PixiSprite.position.x - Collidables[i].PixiSprite.position.x) *
                size <=
                0 &&
              Math.abs(
                PixiSprite.position.y - Collidables[i].PixiSprite.position.y,
              ) <
                CalculatedSize * (75 - Math.abs(inertia.y))
            ) {
              Collidables[i].PixiSprite.position.x =
                PixiSprite.position.x + PixiSprite.getSize().width;
              inertia.x += Collidables[i].readinertia()[0] * 0.8;
              Collidables[i].updateinertia(
                -Collidables[i].readinertia()[0] * 0.8,
                Collidables[i].readinertia()[1],
              );
            }

            // left check
            if (
              (PixiSprite.position.x - Collidables[i].PixiSprite.position.x) *
                size >=
                0 &&
              Math.abs(
                PixiSprite.position.y - Collidables[i].PixiSprite.position.y,
              ) <
                CalculatedSize * (75 - Math.abs(inertia.y))
            ) {
              Collidables[i].PixiSprite.position.x =
                PixiSprite.position.x - PixiSprite.getSize().width;
              inertia.x += Collidables[i].readinertia()[0] * 0.8;
              Collidables[i].updateinertia(
                -Collidables[i].readinertia()[0] * 0.8,
                Collidables[i].readinertia()[1],
              );
            }

            // bottom check
            if (
              (PixiSprite.position.y - Collidables[i].PixiSprite.position.y) *
                size <
              0
            ) {
              Collidables[i].updateinertia(
                Collidables[i].readinertia()[0] * 0.8,
                -Collidables[i].readinertia()[1] * 0.5,
              );
              inertia.y += Collidables[i].readinertia()[1] * 0.8;
            }
          }
        }
      }
    };
  }
}
