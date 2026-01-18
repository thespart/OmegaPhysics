import { Application, Assets, Sprite } from "pixi.js";
import { Howl } from "howler";
import { roofenabla } from "./Objects";

let ismute = false;
let ison = false;

export async function addsoundbutton(app: Application, soundsarray: Howl[]) {
  const turnontext = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/звуквключ.png",
  );
  const turnofftext = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/звуквыключ.png",
  );
  const button = new Sprite(turnontext);

  if (ismute == false) {
    button.texture = turnontext;
  } else {
    button.texture = turnofftext;
  }
  button.eventMode = "static";

  // лоджик
  button.on("pointertap", () => {
    ismute = !ismute;
    if (ismute == true) {
      button.texture = turnofftext;
    } else {
      button.texture = turnontext;
    }
    for (let i = 0; i < soundsarray.length; i++) {
      soundsarray[i].mute(ismute);
    }
  });

  button.position.set(15, 15);
  app.stage.addChild(button);
}

// so spagetti
export async function addroofbutton(app: Application) {
  const turnontext = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/потолоквкл.png",
  );
  const turnofftext = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/потолоквыкл.png",
  );
  const button = new Sprite(turnontext);
  if (ison == false) {
    button.texture = turnontext;
  } else {
    button.texture = turnofftext;
  }
  button.eventMode = "static";

  // лождик
  button.on("pointertap", () => {
    ison = !ison;
    if (ison == true) {
      button.texture = turnofftext;
    } else {
      button.texture = turnontext;
    }
    roofenabla(!ison);
  });

  button.position.set(75, 15);
  app.stage.addChild(button);
}

export async function addRestartbutton(
  app: Application,
  initfunction: () => any,
) {
  const text = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/рестарт.png",
  );
  const button = new Sprite(text);

  button.eventMode = "static";

  button.on("pointertap", () => {
    initfunction();
  });

  button.position.set(135, 15);
  app.stage.addChild(button);
}
