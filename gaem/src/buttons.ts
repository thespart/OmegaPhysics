/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Application, Assets, Sprite } from "pixi.js";
import { Howl } from "howler";
import { roofenabla, forceenabla } from "./Objects";

let ismute = false;
let ison = false;
let ison2 = false;
//let ischeater = false;
//let calculatedSize = innerHeight / 1000;

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

export async function addForcebuttion(app: Application) {
  const texton = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/forceon.png",
  );
  const textoff = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/forceoff.png",
  );
  const button = new Sprite(textoff);
  ison2 ? (button.texture = texton) : (button.texture = textoff);

  button.eventMode = "static";

  button.on("pointertap", () => {
    ison2 = !ison2;
    ison2 ? (button.texture = texton) : (button.texture = textoff);
    forceenabla(ison2);
  });
  button.position.set(195, 15);
  app.stage.addChild(button);
}
/*export async function countText(app: Application) {
  calculatedSize = innerHeight / 1000;
  const text = new HTMLText({
    text: "0",
    style: {
      fontFamily: "Arial",
      align: "center",
      fontSize: 100 * calculatedSize,
    },
  });
  let prevValue = 0;
  function help() {
    requestAnimationFrame(help);
    const newValue = readCountValue();
    if (ischeater == false) {
      text.text = newValue;
    }
    if (newValue - prevValue >= 8 && newValue - prevValue < 10) {
      console.warn(
        "youre either wanted to farm points or dont know what youre doing. However, you just encountered anti-dupe error and all of your points are freezed now" +
          (newValue - prevValue),
      );
      ischeater = true;
    }
    prevValue = newValue;
    text.position.set(
      innerWidth -
        75 -
        Math.log10(newValue - (newValue % 50)) * 50 * calculatedSize,
      15,
    );
  }

  help();
  app.stage.addChild(text);
}*/
