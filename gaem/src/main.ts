import { Howl } from "howler";
import { Application, Assets, Rectangle, Sprite } from "pixi.js";
import {
  Collidable,
  Create,
  DeleteTrail,
  ChangeCalculatedsize,
  writeCollidablesIntoArray,
  deleteAllCollidablesFromArray,
  forceenabla,
} from "./Objects";
import { ImagesToList } from "./catsimagesload";
import {
  addsoundbutton,
  addroofbutton,
  addRestartbutton,
  addForcebuttion,
} from "./buttons";

(async () => {
  // моё авторство
  console.log("Version: 1.1");
  console.warn("visit thespart.ru for more info");
  // Create a new application
  const app = new Application();

  // Initialize the application
  await app.init({ background: "#ffffffff", resizeTo: window });
  document.getElementById("pixi-container")!.appendChild(app.canvas);

  const mousePos = {
    x: 0,
    y: 0,
    prevx: 0,
    prevy: 0,
    dx: 0,
    dy: 0,
  };

  function Randomizable(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const gravitygunsleeptexture = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/pixil-frame-0.png",
  );
  const gravitygunactivetexture = await Assets.load(
    "/OmegaPhysics/OmegaPhysics/assets/images/pixil-frame-0 (1).png",
  );

  const man = new Sprite(gravitygunsleeptexture);
  const sizeofman = 1;
  const ongoingTouches = new Map();
  // sounds

  /*const listOfHitSound = [
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound.mp3",
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound2.mp3",
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound3.mp3",
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound4.mp3",
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound5.mp3",
  ];*/
  const ggshoot = new Howl({
    src: ["/OmegaPhysics/OmegaPhysics/assets/audio/ggshoot.mp3"],
    volume: 0.4,
  });
  const ggpick = new Howl({
    src: ["/OmegaPhysics/OmegaPhysics/assets/audio/ggpick.mp3"],
    volume: 0.4,
  });
  const gghold = new Howl({
    src: ["/OmegaPhysics/OmegaPhysics/assets/audio/gghold.mp3"],
    volume: 1,
    loop: true,
  });
  const ggfail = new Howl({
    src: ["/OmegaPhysics/OmegaPhysics/assets/audio/ggfail.mp3"],
    volume: 0.4,
  });
  const ggdrop = new Howl({
    src: ["/OmegaPhysics/OmegaPhysics/assets/audio/ggdrop.mp3"],
    volume: 0.4,
  });

  //man.anchor.set(0.5);
  man.scale.set(sizeofman);
  man.eventMode = "static";
  man.zIndex = 1000;
  man.hitArea = new Rectangle(0, 0, 0, 0);

  // for pc
  man.on("globalpointermove", (event) => {
    mousePos.x = event.x;
    mousePos.y = event.y;
  });

  window.addEventListener("touchstart", (event) => {
    event.preventDefault();

    for (const changedTouch of event.changedTouches) {
      const touch = {
        pageX: changedTouch.pageX,
        pageY: changedTouch.pageY,
      };
      ongoingTouches.set(changedTouch.identifier, touch);
      mousePos.x = touch.pageX;
      mousePos.y = touch.pageY;
    }
  });
  window.addEventListener("click", (event) => {
    mousePos.x = event.x;
    mousePos.y = event.y;
    if (mousePos.dx == 0 && mousePos.dy == 0 && forceenabla()) {
      ggshoot.play();
    } else {
      ggfail.play();
    }
  });
  window.addEventListener("pointerdown", () => {
    ggpick.play();
    gghold.play();
    man.texture = gravitygunactivetexture;
  });
  window.addEventListener("pointerup", () => {
    ggdrop.play();
    gghold.stop();
    man.texture = gravitygunsleeptexture;
  });

  const Objects: Collidable[] = [];
  let CalculatedSize = (innerWidth + innerHeight) / 1500;
  let amount = 10;
  const catImages = 37;
  const listOfImages: string[] = ImagesToList(catImages);
  //const randomHitSound = listOfHitSound[Randomizable(0,5)];
  const soundsused: Howl[] = []; // это для кнопки
  soundsused.push(ggdrop, ggfail, gghold, ggpick, ggshoot);

  async function CreateColliadables() {
    for (let i = 0; i < amount; i++) {
      const texture = await Assets.load(
        listOfImages[Randomizable(0, catImages)],
      );
      Objects.push(
        new Collidable(
          `${i}`,
          (i * innerWidth) / amount,
          CalculatedSize + ((i % 4) - 1) * 400,
          CalculatedSize * 0.2,
          new Sprite(texture),
          true,
        ),
      );
      app.stage.addChild(Objects[i].PixiSprite);
    }
    writeCollidablesIntoArray(Objects);
  }

  async function InitializeEverything() {
    // создаем все объекты
    amount = Math.min(
      Number(document.querySelector("#numberofshashkas")?.textContent),
      700,
    );
    await CreateColliadables();
    // создаем клонов (для создания трейл эффекта)
    Create(app);
    app.stage.addChild(man);

    // cjplftv fjedfkdf
    addRestartbutton(app, async () => {
      app.ticker.stop();
      CalculatedSize =
        ((innerWidth + innerHeight) / 1500) *
        Number(document.querySelector("#sizeofshashkas")?.textContent);
      ChangeCalculatedsize(CalculatedSize);
      for (let _ = 0; _ < amount; _++) {
        Objects.pop();
      }
      deleteAllCollidablesFromArray();
      DeleteTrail();
      app.stage.removeChildren(0, 9999);
      await InitializeEverything();
      app.ticker.start();
    });
    // cоздаем кнопку для включения/выключения потолка
    addroofbutton(app);
    // создаем кнопку для включения/выключения звуков
    addsoundbutton(app, soundsused);
    addForcebuttion(app);
  }

  await InitializeEverything();

  // game loop
  app.ticker.add((time) => {
    time.maxFPS = 0;
    man.position.set(mousePos.x, mousePos.y);

    mousePos.dx = mousePos.x - mousePos.prevx;
    mousePos.dy = mousePos.y - mousePos.prevy;

    for (let i = 0; i < amount; i++) {
      Objects[i].updatedelta(mousePos.dx, mousePos.dy); // сначала обновляем силу с которой игрок кидает объект
      Objects[i].update(time.lastTime, mousePos.x, mousePos.y); // обновляем все значения
    }

    mousePos.prevx = mousePos.x;
    mousePos.prevy = mousePos.y;
  });
})();
