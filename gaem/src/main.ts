import {Howl} from 'howler';
import { Application, Assets, Rectangle, Sprite } from "pixi.js";

(async () => {

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
    dy: 0
  };

  function Randomizable(min: number, max: number) {
    return Math.floor(Math.random()) * (max - min) + min;
  };

  const texture = await Assets.load("/assets/pixil-frame-0.png");
  const texture1 = await Assets.load("/assets/pixil-frame-0 (1).png")
  const textureShin = await Assets.load("/assets/саша милаша.png");
  const man = new Sprite(texture);
  const Shinshila = new Sprite(textureShin);
  const sizeofman = 1;
  const sizeofshin = 0.25;

  // sounds 
  const ggshoot = new Howl({src: ["/assets/ggshoot.mp3"]});
  const ggpick = new Howl({src: ["/assets/ggpick.mp3"]});
  const gghold = new Howl({src: ["/assets/gghold.mp3"], loop: true});
  const ggfail = new Howl({src: ["/assets/ggfail.mp3"]});
  const ggdrop = new Howl({src: ["assets/ggdrop.mp3"]});
  //const col1 = new Howl({src: ["/assets/col1.MP3"]});
  //const col2 = new Howl({src: ["assets/col2(1).MP3"]});
  //const col3 = new Howl({src: ["/assets/col3.MP3"]});

  //const collisionSounds = [col1,col2,col3];

  //man.anchor.set(0.5);
  man.scale.set(sizeofman);
  man.eventMode = 'static';
  man.hitArea = new Rectangle(0,0,0,0);

  man.on('globalpointermove', (event) => {
    mousePos.x = event.x;
    mousePos.y = event.y;
  });

  Shinshila.anchor.set(0.5);
  app.stage.addChild(Shinshila);
  app.stage.addChild(man);

  // shinshilla

  var IsHolding = false;
  var yskorenie = 0;
  var belowZero = false;
  const inertia = {
    x: 0,
    y: 0
  };

  Shinshila.position.set(innerWidth/2, innerHeight/2);
  Shinshila.scale.set(sizeofshin);

  Shinshila.eventMode = 'static';
  
  Shinshila.on('pointerdown', () => {
    IsHolding = true;
    man.texture = texture1;
    ggpick.play();
    gghold.play();
  });

  Shinshila.on('pointerup', () => {
    IsHolding = false;
    inertia.x = mousePos.dx;
    inertia.y = mousePos.dy;
    man.texture = texture;
    ggdrop.play();
    gghold.pause();
  });

  Shinshila.on('pointertap', () => {
    if (mousePos.dx == 0 && mousePos.dy == 0) {
      inertia.x = Randomizable(-100, 100);
      inertia.y = Randomizable(-100, 100);
      ggshoot.play();
    } else {ggfail.play()};
  });

  app.ticker.add(() => {

    mousePos.dx = mousePos.x - mousePos.prevx;
    mousePos.dy = mousePos.y - mousePos.prevy;

    // man ------------
    /*if (mousePos.x > innerWidth/2) {
      man.scale.set(-sizeofman,sizeofman);
    }else {
      man.scale.set(sizeofman, sizeofman);
    };*/
    man.position.set(mousePos.x, mousePos.y);
    //-------------------

    // shinshila ----------------
    if (IsHolding == true) {
      Shinshila.position.y = Shinshila.position.y + mousePos.dy;
      Shinshila.position.x = Shinshila.position.x + mousePos.dx;
      yskorenie = 0;
    } else {

      if (!belowZero) {
        yskorenie += 0.983;
      };

      Shinshila.position.y += yskorenie + inertia.y;
      Shinshila.position.x += inertia.x;
      inertia.x *= 0.99;
      inertia.y *= 0.99;

      // collision

      // below zero
      if (Shinshila.position.y + Shinshila.bounds.bottom*sizeofshin > innerHeight) {
        belowZero = true;
        yskorenie *= 0.7;
        inertia.x *= 0.8;
        Shinshila.position.y = innerHeight - Shinshila.bounds.bottom*sizeofshin;
      } else {belowZero = false};

      //bottom
       if (Shinshila.position.y + Shinshila.bounds.bottom*sizeofshin >= innerHeight) {
        inertia.y = -yskorenie - inertia.y;
        inertia.y *= 0.9;
        yskorenie = 0;
        //collisionSounds[1].play();
       };

       // top, it never happens when shinshilla stucks in top
      if (Shinshila.position.y + Shinshila.bounds.top*sizeofshin <= 0) {
        inertia.y = -yskorenie - inertia.y;
        yskorenie = 0;
        //collisionSounds[1].play();
       };

       // right
      if (Shinshila.position.x + Shinshila.bounds.right*sizeofshin >= innerWidth) {
        inertia.x = -inertia.x;
        //collisionSounds[1].play();
       };

       // if stuck in right
       if (Shinshila.position.x + Shinshila.bounds.right*sizeofshin > innerWidth) {
        Shinshila.position.x -= 10;
       }

       // left
        if (Shinshila.position.x + Shinshila.bounds.left*sizeofshin <= 0) {
        inertia.x = -inertia.x;
        //collisionSounds[1].play();
       };
       // if stuck in left
       if (Shinshila.position.x + Shinshila.bounds.left*sizeofshin < 0) {
        Shinshila.position.x += 10;
       }
       
    };
    mousePos.prevx = mousePos.x;
    mousePos.prevy = mousePos.y;

  });

})();
