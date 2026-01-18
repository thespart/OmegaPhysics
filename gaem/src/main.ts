import { Howl } from "howler";
import { Application, Assets, Rectangle, Sprite } from "pixi.js";
import {
  Collidable,
  Create,
  DeleteTrail,
  ChangeCalculatedsize,
} from "./Objects";
import { ImagesToList } from "./catsimagesload";
import { addsoundbutton, addroofbutton, addRestartbutton } from "./buttons";

(async () => {
  // моё авторство
  console.log(
    "Hello everyone! This little website is made by TheSpart (or SpartTheKOT or Spart, it doesnt matter :) ). I hope you liked it!" +
      "However, if you didn't really enjoyed it, you can gimme ideas what to improve to make this website better!" +
      "You can contact me in telegram - @the_spart, or in discord - @the_spart",
  );

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

  const listOfHitSound = [
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound.mp3",
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound2.mp3",
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound3.mp3",
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound4.mp3",
    "/OmegaPhysics/OmegaPhysics/assets/audio/hitsound5.mp3",
  ];
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
    if (mousePos.dx == 0 && mousePos.dy == 0) {
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
  let CalculatedSize = innerWidth / 1000;
  const amount = 5;
  const listOfImages: string[] = ImagesToList(20);
  //const randomHitSound = listOfHitSound[Randomizable(0,5)];
  const hitsoundsused: Howl[] = [
    new Howl({ src: listOfHitSound[0], volume: 0.5 }),
    new Howl({ src: listOfHitSound[0], volume: 0.5 }),
    new Howl({ src: listOfHitSound[0], volume: 0.5 }),
    new Howl({ src: listOfHitSound[0], volume: 0.5 }),
    new Howl({ src: listOfHitSound[0], volume: 0.5 }),
  ]; // это для кнопки

  async function CreateColliadables() {
    for (let i = 0; i < amount; i++) {
      const texture = await Assets.load(listOfImages[Randomizable(0, 20)]);
      Objects.push(
        new Collidable(
          i * innerWidth * 0.25,
          400,
          CalculatedSize * 0.3,
          new Sprite(texture),
          true,
          hitsoundsused[i],
        ),
      );
      app.stage.addChild(Objects[i].PixiSprite);
    }
  }
  async function InitializeEverything() {
    // создаем все объекты
    await CreateColliadables();
    // создаем клонов (для создания трейл эффекта)
    Create(app);
    app.stage.addChild(man);

    // cjplftv fjedfkdf
    addRestartbutton(app, async () => {
      app.ticker.stop();
      CalculatedSize = innerWidth / 1000;
      ChangeCalculatedsize(CalculatedSize);
      for (let _ = 0; _ < amount; _++) {
        Objects.pop();
      }
      DeleteTrail();
      app.stage.removeChildren(0, 999);
      await InitializeEverything();
      app.ticker.start();
    });
    // cоздаем кнопку для включения/выключения потолка
    addroofbutton(app);
    // создаем кнопку для включения/выключения звуков
    addsoundbutton(app, [
      ggdrop,
      ggfail,
      ggshoot,
      gghold,
      ggpick,
      hitsoundsused[0],
      hitsoundsused[1],
      hitsoundsused[2],
      hitsoundsused[3],
      hitsoundsused[4],
    ]);
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
