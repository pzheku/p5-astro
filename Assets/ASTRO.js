//     .aMMMb  .dMMMb dMMMMMMP dMMMMb  .aMMMb
//    dMP"dMP dMP" VP   dMP   dMP.dMP dMP"dMP
//   dMMMMMP  VMMMb    dMP   dMMMMK" dMP dMP
//  dMP dMP dP .dMP   dMP   dMP"AMF dMP.aMP
// dMP dMP  VMMMP"   dMP   dMP dMP  VMMMP"
//
// By Sam Cameron

// --------------------------------- VARIABLES ---------------------------------

const P = { B: 250 };

const FRAMERATE = 30;

let WD;
let D = { R: 128, C: 80, S: 0, M: 8 };

let canvasElement;

let pb = { paused: true, pressed: false };
let g;
let g_;
let grd;

let MASTER = { x: 0, y: 0 };
let MASTVEL = { x: 0, y: 0 };

let level = 3;

let GM = { selection: 0, upPressed: false, downPressed: false };

let online = true;

let ASTraw = {
  l: new Array(7),
  r: new Array(7)
};

let ENYraw = new Array(2);
let EXPraw = new Array(7);
let LNDraw = new Array(10);
let JMPraw = new Array(10);

let animations = [];

// --------------------------------- ASSETS ------------------------------------

function preload() {
  if (online) {
    pxFontBig = loadFont(
      "https://cdn.rawgit.com/sweatersjpg/AI-Ping-Pong/efe8fa98/PressStart2P-Regular.ttf"
    );
    pxFontSmall = loadFont(
      "https://cdn.rawgit.com/sweatersjpg/Platformer/2287720c/Assets/pixel-millennium.regular.ttf"
    );
    TITLEART = loadImage(
      "https://cdn.rawgit.com/sweatersjpg/Platformer/f0d155c9/Assets/ASTRO-TITLE.png"
    );

    // music = loadSound('https://cdn.rawgit.com/sweatersjpg/Platformer/80b7d908/Assets/Sounds/high%20tech%20lab.flac');

    SFX = {
      complete: loadSound(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/b81577aa/Assets/Sounds/complete.wav"
      ),
      kill: loadSound(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/b81577aa/Assets/Sounds/hit.wav"
      ),
      hit: loadSound(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/1f6abcae/Assets/Sounds/Samus%20Hang.wav"
      ),
      jump: loadSound(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/bdaa9467/Assets/Sounds/Samus%20Morphball%20Jump.wav"
      ),
      select: loadSound(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/b81577aa/Assets/Sounds/select.wav"
      ),
      shoot: loadSound(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/1f6abcae/Assets/Sounds/Samus%20Land.wav"
      )
    };

    ENYraw[0] = loadImage(
      "https://cdn.rawgit.com/sweatersjpg/Platformer/4b704001/Assets/Enemy/Skull%20RIGHT.png"
    );
    ENYraw[1] = loadImage(
      "https://cdn.rawgit.com/sweatersjpg/Platformer/4b704001/Assets/Enemy/Skull.png"
    );

    HRTraw = loadImage(
      "https://raw.githubusercontent.com/sweatersjpg/ASTRO/master/Assets/Heart.png"
    );

    for (let i = 0; i < 6; i++) {
      ASTraw.l[i] = loadImage(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/24d27e9a/Assets/Astronaut/RIGHT%20no%20gun/Astronaut-Right-No-Gun_" +
          i +
          ".png"
      );
      ASTraw.r[i] = loadImage(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/24d27e9a/Assets/Astronaut/LEFT%20no%20gun/Astronaut-Left-No-Gun_" +
          i +
          ".png"
      );
    }

    ASTraw.l[6] = loadImage(
      "https://cdn.rawgit.com/sweatersjpg/Platformer/22c613fc/Assets/Astronaut/RIGHT%20no%20gun/Astronaut-Right-No-Gun_6.png"
    );
    ASTraw.r[6] = loadImage(
      "https://cdn.rawgit.com/sweatersjpg/Platformer/22c613fc/Assets/Astronaut/LEFT%20no%20gun/Astronaut-Left-No-Gun_6.png"
    );

    for (var i = 0; i < EXPraw.length; i++) {
      EXPraw[i] = loadImage(
        "https://raw.githubusercontent.com/sweatersjpg/ASTRO/master/Assets/Animations/Explosion/Explosion_" +
          i +
          ".png"
      );
    }
    for (var i = 0; i < LNDraw.length; i++) {
      LNDraw[i] = loadImage(
        "https://raw.githubusercontent.com/sweatersjpg/Platformer/master/Assets/Animations/Landing/Landing_" +
          i +
          ".png"
      );
    }
    for (var i = 0; i < JMPraw.length; i++) {
      JMPraw[i] = loadImage(
        "https://cdn.rawgit.com/sweatersjpg/Platformer/942b31d5/Assets/Animations/Jumping/Jumping_" +
          i +
          ".png"
      );
    }
  }
}

// --------------------------------- SETUP -------------------------------------

function setup() {
  updateSize();
  canvasElement = createCanvas(WD.W, WD.H).elt;
  let context = canvasElement.getContext("2d");
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;
  context.msImageSmoothingEnabled = false;
  context.imageSmoothingEnabled = false;

  frameRate(FRAMERATE);

  g = new pixelDraw(D, window);
  b = new bombs(g);
  p = new player(g, b);
  e = new enemy(g, b, p);
  p.updateVariables();
  lvl = new levels(g, b, p, e);
}

// --------------------------------- MAIN LOOP ---------------------------------

function draw() {
  g.update(D.S, window);

  background(255);
  backDrop(196);

  pause();
  if (!pb.paused) {
    if (lvl.transition.show) {
      lvl.transitionAnimation(level);
    } else {
      gameLoop();
    }
  } else {
    gameMenu();
  }

  push();
  fill(color(128, 0, 128, 63));
  noStroke();
  rect(0, 0, window.innerWidth, window.innerHeight);
  pop();

  // if (!music.isPlaying()) {
  //   music.setVolume(0.3);
  //   music.play();
  // }

  // showFrames();
}

// --------------------------------- DISPLAY LOOP ------------------------------

function dispLoop() {
  b.disp();
  p.disp(D.S, ASTraw);
  e.disp();
}

// --------------------------------- GAME LOOP ---------------------------------

function gameLoop() {
  p.update();
  b.update();
  e.update();

  lvl.level[level]();

  for (var i = 0; i < animations.length; i++) {
    animations[i].disp();
  }

  updateMaster();

  dispLoop();
}

// --------------------------------- MENU --------------------------------------

function gameMenu() {
  scrollBackground();
  if (online) {
    image(TITLEART, 0, 4 * D.S, 128 * D.S, 32 * D.S);
  }

  if (keyIsDown(p.key.UP) & !GM.upPressed) {
    GM.selection = abs(GM.selection - 1);
    GM.upPressed = true;
  } else if (!keyIsDown(p.key.UP)) {
    GM.upPressed = false;
  }
  if (keyIsDown(p.key.DOWN) & !GM.downPressed) {
    GM.selection = abs(GM.selection - 1);
    GM.downPressed = true;
  } else if (!keyIsDown(p.key.DOWN)) {
    GM.downPressed = false;
  }

  if (GM.selection == 0) {
    g.DrawFillRect(0, D.C - 23, D.R, 9, 0);
    pxText("NEW GAME", 16, D.C - 16, 255);
    pxText("CONTINUE", 16, D.C - 4, 0);

    if (keyIsDown(p.key.SHOOT)) {
      pb.paused = false;
      level = 0;
      p.dead = true;
      p.life = 0;
    }
  } else {
    g.DrawFillRect(0, D.C - 11, D.R, 9, 0);
    pxText("CONTINUE", 16, D.C - 4, 255);
    pxText("NEW GAME", 16, D.C - 16, 0);

    if (keyIsDown(p.key.SHOOT)) {
      pb.paused = false;
    }
  }
}

function scrollBackground() {
  MASTER.x -= 2;
  MASTER.y += 2;
}

// --------------------------------- ANIMATIONS -------------------------------------

function explosion(x, y) {
  this.frames = 6 * 3;
  this.x = x;
  this.y = y;
  this.w = 32;
  this.h = 32;

  this.disp = function() {
    image(
      EXPraw[6 - round(this.frames / 3)],
      int(this.x - this.w / 2 - MASTER.x) * D.S,
      int(this.y - (this.h * 2) / 3 - MASTER.y) * D.S,
      this.w * D.S,
      this.h * D.S
    );

    this.frames--;

    if (this.frames < 0) {
      kill(this);
    }
  };
}

function landing(x_, y_) {
  speed = 1.5;
  this.frames = 9 * speed;
  this.w = 16;
  this.h = 8;

  this.x = x_ - p.d.w / 2;
  this.y = y_ - this.h + p.d.h;

  this.disp = function() {
    image(
      LNDraw[9 - round(this.frames / speed)],
      int(this.x - MASTER.x) * D.S,
      int(this.y - MASTER.y) * D.S,
      this.w * D.S,
      this.h * D.S
    );

    this.frames--;

    if (this.frames < 0) {
      kill(this);
    }
  };
}

function jumping(x_, y_) {
  speed = 1.5;
  this.frames = 9 * speed;
  this.w = 8;
  this.h = 16;

  this.x = x_ - this.w / 2 + p.d.w / 2;
  this.y = y_ - this.h + p.d.h;

  this.disp = function() {
    image(
      JMPraw[9 - round(this.frames / speed)],
      int(this.x - MASTER.x - p.v.x / 2) * D.S,
      int(this.y - MASTER.y) * D.S,
      this.w * D.S,
      this.h * D.S
    );

    this.frames--;

    if (this.frames < 0) {
      kill(this);
    }
  };
}

function kill(element) {
  const index = animations.indexOf(element);
  animations.splice(index, 1);
}

// --------------------------------- UTILITY -----------------------------------

function pxText(s_, x, y, c) {
  push();
  textSize(8 * D.S);
  if (online) {
    textFont(pxFontSmall);
  }
  fill(c);
  text(s_, x * D.S, y * D.S);
  pop();
}

function updateMaster() {
  if (p.v.y < -1) {
    MASTVEL.y += p.a * 16;
  }

  MASTVEL.x *= 0.85;
  MASTVEL.y *= 0.85;

  let xpos = int(D.R / 2.1) - int(MASTVEL.x);
  let ypos = int(D.C / 2.1) - round(MASTVEL.y);

  if (p.p.y > D.C) {
    MASTER.y = D.C - ypos;
  } else {
    MASTER.y = int(p.p.y) - ypos;
  }
  if (p.p.x < D.R / 8) {
    MASTER.x = D.R / 8 - xpos;
  } else {
    MASTER.x = int(p.p.x) - xpos;
  }
}

function backDrop(c_) {
  let scrollSpeed = 1.5;
  let s = 16;
  for (var row = 0; row < int(D.R / s) + 4; row++) {
    for (var col = 0; col < int(D.C / s) + 4; col++) {
      if (row % 2 == col % 2) {
        let m_x = MASTER.x - int(MASTER.x / scrollSpeed);
        let m_y = MASTER.y - int(MASTER.y / scrollSpeed);
        let x_diff = m_x - int(m_x / (s * 2)) * s * 2 + s * 2;
        let y_diff = m_y - int(m_y / (s * 2)) * s * 2 + s * 2;
        let x = row * s - x_diff;
        let y = col * s - y_diff;
        g.DrawFillRect(x, y, s, s, c_);
      }
    }
  }
}

function showFrames() {
  push();
  textSize(12);
  // fill(0);
  // text(round(frameRate()), width - (3 * textSize()), height - textSize());
  fill(255);
  text(round(frameRate()), width - 4 * textSize(), height - textSize());
  pop();
}

function pause() {
  if (!pb.pressed & keyIsDown(27)) {
    pb.paused = !pb.paused;
    pb.pressed = true;
  } else if (!keyIsDown(27)) {
    pb.pressed = false;
  }
}

function windowResized() {
  updateSize();
  resizeCanvas(WD.W, WD.H);
}

function updateSize() {
  WD = { W: window.innerWidth - 16, H: window.innerHeight - 16 };
  D.S = WD.W / D.R;
  let C_ = WD.H / D.S;
  if (C_ < D.C) {
    D.S = WD.H / D.C;
  }
  WD.H = D.C * D.S;
  WD.W = D.R * D.S;
}

// -----------------------------------------------------------------------------

function player(G, B) {
  this.p = { x: 50, y: 20 };
  this.v = { x: 0, y: 0 };

  this.horizontalJump = 0;
  this.jumping = false;
  this.jumpKeypressed;

  this.m = 100;

  this.d = { w: 8, h: 16 };
  this.key = { LEFT: 65, RIGHT: 68, UP: 87, DOWN: 83, JUMP: 32, SHOOT: 13 };
  // this.key = { LEFT : 37, RIGHT : 39, UP : 38, DOWN : 40, JUMP : 72, SHOOT : 74 }

  this.frame = 0;
  this.dir = 0;

  this.dead = true;
  this.maxLife = 3;
  this.life = 0;
  this.hitAnim = { justHit: false, timer: FRAMERATE / 2 };

  this.updateVariables = function() {
    let jumpHeight = 4;
    this.g = ((10 * D.M) / (FRAMERATE * FRAMERATE)) * jumpHeight;
    this.maxJump = sqrt(2 * this.g * D.M * jumpHeight);

    let jumpDist = 5;
    this.a = (this.g * jumpDist) / (4 * jumpHeight);
  };

  this.animation = function() {
    if (this.hitAnim.justHit) {
      this.hitAnim.timer--;
      if (this.hitAnim.timer < 0) {
        this.hitAnim.justHit = false;
        this.hitAnim.timer = FRAMERATE * 2;
      }
    }
  };

  this.disp = function(S, ASTR) {
    if (this.frame > 5) {
      this.frame = 0;
    }

    if ((this.v.y > 0) & this.jumping) {
      this.frame = 2;
    }
    if (this.v.y < -1) {
      this.frame = 0;
      this.jumping = true;
    }

    let hh;
    if (round(this.frame) == 1 || round(this.frame) == 4) {
      hh = 7;
    } else {
      hh = 6;
    }

    if (this.hitAnim.justHit) {
      x = round(frameCount / 5) * 5;
      if (x % 10 == 0) {
        var show = true;
      } else {
        var show = false;
      }
    } else {
      var show = true;
    }

    if (show) {
      if (online) {
        if (this.dir == 0) {
          image(
            ASTR.l[round(this.frame)],
            (int(this.p.x) - MASTER.x) * S,
            (int(this.p.y) - MASTER.y) * S,
            8 * D.S,
            16 * D.S
          );

          G.DrawFillRect(
            int(this.p.x) - MASTER.x + 6,
            int(this.p.y) - MASTER.y + hh,
            4,
            4,
            0
          );
        } else {
          image(
            ASTR.r[round(this.frame)],
            (int(this.p.x) - MASTER.x) * S,
            (int(this.p.y) - MASTER.y) * S,
            round(8 * D.S),
            round(16 * D.S)
          );

          G.DrawFillRect(
            int(this.p.x) - MASTER.x - 2,
            int(this.p.y) - MASTER.y + hh,
            9,
            4,
            0
          );
        }
      } else {
        G.DrawRect(
          int(this.p.x) - MASTER.x,
          int(this.p.y) - MASTER.y,
          this.d.w,
          this.d.h,
          0
        );
      }
    }

    for (var i = 0; i < this.life; i++) {
      y = 2;
      x = 2 + 9 * i;
      image(HRTraw, x * S, y * S, 7 * S, 6 * S);
    }
  };

  this.update = function() {
    this.controls();

    this.frame += (3 / (8 + abs(this.v.x) * 8)) * abs(this.v.x);

    this.p.x += this.v.x;
    this.p.y -= this.v.y;

    // print((this.v.x) + "," + (this.v.y));
    // print((this.v.y))

    this.v.y -= this.g;

    this.v.x *= 0.96;

    this.updateVariables();

    this.animation();

    // print(this.horizontalJump);
  };

  this.controls = function() {
    let peek = 32;
    if (keyIsDown(this.key.UP)) {
      MASTVEL.y -= (this.a * peek * 1) / 2;
    }
    if (keyIsDown(this.key.DOWN)) {
      MASTVEL.y += (this.a * peek * 5) / 4;
    }
    if (keyIsDown(this.key.RIGHT)) {
      this.v.x += this.a;
      MASTVEL.x += this.a * peek;
      this.dir = 0;
    }
    if (keyIsDown(this.key.LEFT)) {
      this.v.x += -this.a;
      MASTVEL.x -= this.a * peek;
      this.dir = 1;
    }
    if (keyIsDown(this.key.JUMP) & !this.jumping & !this.jumpKeyPressed) {
      SFX.jump.setVolume(1.5);
      SFX.jump.play();
      splice(animations, new jumping(p.p.x, p.p.y), 0);
      this.v.y = this.maxJump;
      this.v.x += this.horizontalJump;
      this.jumping = true;
      this.jumpKeyPressed = true;
    } else if (!keyIsDown(this.key.JUMP)) {
      // if (this.jumpKeyPressed & this.v.y > 0) {
      //   this.v.y -= map(this.v.y, this.maxJump, 0, this.maxJump/1.5, 0);
      // }
      this.jumpKeyPressed = false;
    }
    if (keyIsDown(this.key.SHOOT) & !this.bombKeyPressed) {
      // let ratio = int(FRAMERATE/frameRate());
      SFX.shoot.setVolume(0.5);
      SFX.shoot.play();
      let ratio = 1;
      let amount = 10 * ratio;
      for (var i = 0; i < amount; i++) {
        B.newBomb(this);
      }
      // this.bombKeyPressed = true;
    } else if (!keyIsDown(this.key.SHOOT)) {
      this.bombKeyPressed = false;
    }
  };
}

function bombs(G) {
  this.b = [];
  this.d = { w: 2 };
  this.m = 0.025;

  this.disp = function() {
    for (var i = 0; i < this.b.length; i++) {
      let bomb = this.b[i];
      G.DrawFillRect(
        int(bomb.p.x) - MASTER.x,
        int(bomb.p.y) - MASTER.y,
        this.d.w * 2,
        this.d.w,
        20
      );
      // G.DrawRect(int(bomb.p.x), int(bomb.p.y), this.d.w, this.d.w, 0);
    }
  };

  this.update = function() {
    for (var i = 0; i < this.b.length; i++) {
      this.b[i].p.x += this.b[i].v.x;
      this.b[i].p.y -= this.b[i].v.y;

      this.b[i].v.y -= this.b[i].g;

      // this.b[i].v.y *= 0.95;
      // this.b[i].v.x *= 0.98;

      this.b[i].life -= 1;
      if (this.b[i].life <= 0) {
        this.kill(this.b[i]);
      }
    }
  };

  this.purge = function() {
    this.b = [];
  };

  this.kill = function(element) {
    const index = this.b.indexOf(element);
    this.b.splice(index, 1);
  };

  // Machine Gun
  this.newBomb = function(p_) {
    vx_1 = (350 * D.M) / FRAMERATE;
    vx_2 = (3 / 4) * vx_1;
    vx_ = random(vx_2, vx_1);

    if (p_.dir == 0) {
      vx = vx_;
    } else {
      vx = -vx_;
    }

    let p = { x: p_.p.x + random(-vx, 0), y: p_.p.y + int(random(6, 8)) };
    let v = { x: p_.v.x + vx, y: p_.v.y };

    if (p_.jumping) {
      p_.v.x -= (this.m * vx) / p_.m;
    } else {
      p_.v.x -= ((this.m * vx) / p_.m) * 0.2;
    }

    let temp = { p, v, g: p_.g, life: 5 };
    splice(this.b, temp, 0);
  };
}

function enemy(G, B_, P) {
  this.v;

  this.e = [];

  // this.p = { x : 0, y : 0 }
  // this.v = { x : 0, y : 0 }
  //
  // this.m = 200;
  //
  // this.d = { w : 8, h : 16 }

  this.disp = function() {
    for (var i = 0; i < this.e.length; i++) {
      E = this.e[i];
      if (!E.dead) {
        x = int(E.p.x) - MASTER.x - P.d.w / 2;
        y = int(E.p.y) - MASTER.y - P.d.w / 2;

        if (frameCount % 2 == 0) {
          s_ = 1;
        } else {
          s_ = 0;
        }

        for (var s = s_; s < E.s.x.length; s += 2) {
          if (s == E.s.x.length - 2) {
            s += 1;
          }

          let x_ = int(E.s.x[s]) - MASTER.x;
          let y_ = int(E.s.y[s]) - MASTER.y + P.d.w / 2;

          G.DrawEllipse(x_, y_, s - int(s / 4), 127);
        }

        // G.DrawFillRect(x, y, P.d.w, P.d.w, 0);
        // G.DrawFillRect(x + 1, y + 1, P.d.w - 2, P.d.w - 2, 255);
        if (online) {
          if (E.p.x > P.p.x) {
            image(
              ENYraw[1],
              (int(E.p.x) - MASTER.x - 4) * D.S,
              (int(E.p.y) - MASTER.y) * D.S,
              8 * D.S,
              8 * D.S
            );
          } else {
            image(
              ENYraw[0],
              (int(E.p.x) - MASTER.x - 4) * D.S,
              (int(E.p.y) - MASTER.y) * D.S,
              8 * D.S,
              8 * D.S
            );
          }
        }

        if (x > D.R) {
          G.DrawFillRect(
            D.R,
            map(y, 0, D.C - P.d.w, 0, D.C - P.d.w, true),
            -2,
            P.d.w,
            127
          );
        }
        if (x < 0) {
          G.DrawFillRect(
            0,
            map(y, 0, D.C - P.d.w, 0, D.C - P.d.w, true),
            2,
            P.d.w,
            127
          );
        }
        if (y > D.C) {
          G.DrawFillRect(
            map(x, 0, D.R - P.d.w, 0, D.R - P.d.w, true),
            D.C,
            P.d.w,
            -2,
            127
          );
        }
        if (y < 0) {
          G.DrawFillRect(
            map(x, 0, D.R - P.d.w, 0, D.R - P.d.w, true),
            0,
            P.d.w,
            2,
            127
          );
        }
      }
    }
  };

  this.update = function() {
    this.v = P.a * 30;

    for (var i = 0; i < this.e.length; i++) {
      if (!this.e[i].dead) {
        let dx = P.p.x + P.d.w / 2 - this.e[i].p.x;
        let dy = P.p.y + P.d.h / 2 - this.e[i].p.y;

        this.e[i].a = atan2(dx, dy) + PI / 2;

        let r = dist(
          P.p.x + P.d.w / 2,
          P.p.y + P.d.h / 2,
          this.e[i].p.x,
          this.e[i].p.y
        );

        let a = 2000 / (r * r);

        if (a > P.g / 2) {
          a = P.g / 2;
        }
        if (a < P.g / 16) {
          a = P.g / 16;
        }

        this.e[i].v.y += sin(this.e[i].a) * a;
        this.e[i].v.x -= cos(this.e[i].a) * a;

        this.checkForDeath(this.e[i]);
      }

      this.e[i].v.x *= 0.98;
      this.e[i].v.y *= 0.98;

      this.e[i].p.x += this.e[i].v.x;
      this.e[i].p.y += this.e[i].v.y;

      for (let s = 0; s < this.e[i].s.x.length; s++) {
        if (s != this.e[i].s.x.length - 1) {
          this.e[i].s.x[s] = this.e[i].s.x[s + 1];
          this.e[i].s.y[s] = this.e[i].s.y[s + 1];
        } else {
          this.e[i].s.x[s] = this.e[i].p.x;
          this.e[i].s.y[s] = this.e[i].p.y;
        }
      }
    }
  };

  this.checkForDeath = function(E) {
    if ((E.p.x > P.p.x) & (E.p.x < P.p.x + P.d.w)) {
      if ((E.p.y > P.p.y) & (E.p.y < P.p.y + P.d.h)) {
        if (!P.hitAnim.justHit) {
          P.dead = true;
          tvx = P.v.x * 0.5;
          tvy = P.v.x * 0.5;
          P.v.x += E.v.x * 0.5;
          E.v.x *= -0.5;
          E.v.y *= -0.5;
          E.v.x += tvx;
          E.v.y += tvx;
          splice(animations, new explosion(E.p.x, E.p.y), 0);
          SFX.kill.setVolume(0.7);
          SFX.kill.play();
        }
      }
    }

    for (var i = 0; i < B_.b.length; i++) {
      let B = B_.b[i];
      w = P.d.w / 2;
      if ((B.p.x - B.v.x > E.p.x - w) & (B.p.x - B.v.x < E.p.x + w)) {
        if ((B.p.y > E.p.y - w) & (B.p.y < E.p.y + w)) {
          let willDie = false;
          if (P.dir == 0) {
            if (E.p.x > P.p.x) {
              willDie = true;
            }
          } else {
            if (E.p.x < P.p.x) {
              willDie = true;
            }
          }

          if (willDie) {
            B_.kill(B);
            SFX.kill.setVolume(0.3);
            SFX.kill.play();
            if (!E.dead) {
              splice(animations, new explosion(E.p.x, E.p.y), 0);
            }
            E.dead = true;
          }
        }
      }
    }
  };

  this.kill = function(element) {
    const index = this.e.indexOf(element);
    this.e.splice(index, 1);
  };
}

function pixelDraw(D, G_) {
  this.S = D.S;
  this.G = G_;

  this.update = function(s, g_) {
    this.S = s;
    this.G = g_;
  };

  this.DrawRect = function(x, y, w, h, c1, c2) {
    push();
    this.G.stroke(c1);
    this.G.fill(c2);
    this.G.strokeWeight(this.S);
    this.G.rect(
      x * this.S + this.S / 2,
      y * this.S + this.S / 2,
      w * this.S - this.S,
      h * this.S - this.S
    );
    pop();
  };

  this.DrawFillRect = function(x, y, w, h, c) {
    push();
    this.G.fill(c);
    this.G.noStroke();
    this.G.rect(x * this.S, y * this.S, w * this.S, h * this.S);
    pop();
  };

  this.DrawDot = function(x, y, c) {
    push();
    this.G.fill(c);
    this.G.noStroke();
    this.G.rect(x * this.S, y * this.S, this.S, this.S);
    pop();
  };

  this.DrawLine = function(x1, y1, x2, y2, c) {
    let m = (y2 - y1) / (x2 - x1);

    if (x2 - x1 >= 0) {
      for (let i = 0; i < x2 - x1; i++) {
        this.DrawDot(i + x1, int(m * i) + y1, c);
      }
    } else {
      for (let i = 0; i >= x2 - x1; i--) {
        this.DrawDot(i + x1, int(m * i) + y1, c);
      }
    }
    if (y2 - y1 >= 0) {
      for (let i = 0; i < y2 - y1; i++) {
        this.DrawDot(int(i / m) + x1, i + y1, c);
      }
    } else {
      for (let i = 0; i >= y2 - y1; i--) {
        this.DrawDot(int(i / m) + x1, i + y1, c);
      }
    }
  };

  this.DrawEllipse = function(x, y, r, c) {
    for (var x_ = round(x - r + 1); x_ <= x + r; x_++) {
      var eq = int(sqrt(pow(r, 2) - pow(x_ - x, 2)));
      var y_ = eq + y;
      var y__ = -eq + y;

      if (eq == r) {
        this.DrawFillRect(x_, y_ - 1, 1, -eq * 2 + 2, c);
      } else if (eq != 0) {
        this.DrawFillRect(x_, y_, 1, -eq * 2 + 1, c);
      }
    }
    for (var y_ = round(y - r + 1); y_ <= y + r; y_++) {
      var eq = int(sqrt(pow(r, 2) - pow(y_ - y, 2)));
      var x_ = eq + x;
      var x__ = -eq + x;

      if (eq == r) {
        this.DrawFillRect(x_ - 1, y_, -eq * 2 + 2, 1, c);
      } else if (eq != 0) {
        this.DrawFillRect(x_, y_, -eq * 2 + 1, 1, c);
      }
    }
  };
}

function levels(g, b, p, e) {
  // --------------------------------- VARIABLES -------------------------------

  // --------------------------------- ANIMATIONS ------------------------------

  this.transition = {
    show: false,
    timer: FRAMERATE
  };

  this.transitionAnimation = function(l) {
    this.transition.timer--;
    if (this.transition.timer < 0) {
      this.transition.show = false;
      this.transition.timer = FRAMERATE;
    }

    // print(this.transition.timer)

    txt = "LEVEL " + (l + 1);

    d = round(frameCount / 5) * 5;
    if (d % 10 == 0) {
      background(0);
      pxText(txt, D.R / 2 - 2 * txt.length, D.C / 2, 255);
    } else {
      background(127);
      pxText(txt, D.R / 2 - 2 * txt.length, D.C / 2, 0);
    }
  };

  // --------------------------------- PLATFORM TYPES --------------------------

  var flatplat = function(px, py, w) {
    let h = py * D.M + 1;
    py = D.C - py * D.M;
    px *= D.M;
    w *= D.M;

    g.DrawRect(px - MASTER.x, py - MASTER.y, w, h, 0, 255);

    if ((p.p.x + p.d.w > px) & (p.p.x < px + w)) {
      if (
        (p.v.y < 0) &
        (p.p.y + p.d.h + p.v.y < py) &
        (p.p.y + p.d.h > py) &
        !keyIsDown(p.key.DOWN)
      ) {
        p.v.y = 0;
        p.p.y = py - p.d.h;
        if (p.jumping == true) {
          splice(animations, new landing(p.p.x, p.p.y), 0);
        }
        p.jumping = false;
      }
    }
  };

  var solidplat = function(px, py, w, h) {
    py = D.C - py * D.M;
    px *= D.M;
    w *= D.M;
    h *= D.M;
    g.DrawFillRect(px - MASTER.x, py - MASTER.y, w, h, 0);

    if ((p.p.x + p.d.w > px) & (p.p.x < px + w)) {
      if ((p.v.y < 0) & (p.p.y + p.d.h + p.v.y < py) & (p.p.y + p.d.h > py)) {
        p.v.y = 0;
        p.p.y = py - p.d.h;
        if (p.jumping == true) {
          splice(animations, new landing(p.p.x, p.p.y), 0);
        }
        p.jumping = false;
      }
      if (
        (p.v.y > 0) &
        (p.p.y - p.v.y < py + h) &
        (p.p.y > py + h) &
        p.jumping
      ) {
        p.v.y = 0;
        p.p.y = py + h;
      }
    }
    if ((p.p.y < py + h) & (p.p.y + p.d.h > py)) {
      if ((p.v.x > 0) & (p.p.x + p.d.w + p.v.x > px) & (p.p.x < px)) {
        p.v.x = 0;
        if ((p.v.y < 0) & (p.p.y + p.d.h < py + h)) {
          p.v.y = 0;
          p.jumping = false;
          p.horizontalJump = -p.a * 30;
        }
        p.p.x = px - p.d.w;
        p.frame = 0;
      }
      if ((p.v.x < 0) & (p.p.x + p.v.x < px + w) & (p.p.x + p.d.w > px + w)) {
        p.v.x = 0;
        if ((p.v.y < 0) & (p.p.y + p.d.h < py + h)) {
          p.v.y = 0;
          p.jumping = false;
          p.horizontalJump = p.a * 30;
        }
        p.p.x = px + w + 0.1;
        p.frame = 0;
      }
    }
  };

  var newenemy = function(px, py, i) {
    py = D.C - py * D.M;
    px *= D.M;

    let tx = px - MASTER.x;
    let ty = py - MASTER.y;

    let temp = {
      p: { x: px, y: py, mx: px, my: py },
      s: { x: new Array(10), y: new Array(10) },
      v: { x: 0, y: 0 },
      a: 0,
      spawnAgain: false,
      dead: false
    };

    for (var s = 0; s < temp.s.x.length; s++) {
      temp.s.x[s] = temp.p.x;
      temp.s.y[s] = temp.p.y;
    }

    if (e.e.length <= i) {
      splice(e.e, temp, i);
    }

    if ((ty < 0) | (ty > D.C) | (tx < 0) | (tx > D.R)) {
      e.e[i].spawnAgain = true;
    }

    if ((ty > 0) & (ty < D.C) & (tx > 0) & (tx < D.R)) {
      if (e.e[i].spawnAgain) {
        temp = {
          p: {
            x: e.e[i].p.mx,
            y: e.e[i].p.my,
            mx: e.e[i].p.mx,
            my: e.e[i].p.my
          },
          s: { x: new Array(10), y: new Array(10) },
          v: { x: 0, y: 0 },
          a: 0,
          spawnAgain: false,
          dead: false
        };

        for (var s = 0; s < temp.s.x.length; s++) {
          temp.s.x[s] = temp.p.x;
          temp.s.y[s] = temp.p.y;
        }

        e.e[i] = temp;
      }
    }
  };

  var ground = function(px1, px2) {
    px1 *= D.M;
    px2 *= D.M;
    py = D.C;
    w = px2 - px1;
    h = MASTER.y;

    g.DrawFillRect(px1 - MASTER.x, py - MASTER.y, w, h, 0);

    if ((p.p.x + p.d.w > px1) & (p.p.x < px2)) {
      if ((p.v.y < 0) & (p.p.y + p.d.h + p.v.y < py) & (p.p.y + p.d.h > py)) {
        p.v.y = 0;
        p.p.y = py - p.d.h;
        if (p.jumping == true) {
          splice(animations, new landing(p.p.x, p.p.y), 0);
        }
        p.jumping = false;
      }
    }

    if ((p.p.y < py + h) & (p.p.y + p.d.h > py)) {
      if ((p.v.x > 0) & (p.p.x + p.d.w + p.v.x > px1) & (p.p.x < px1)) {
        p.v.x = 0;
        if (p.v.y < 0) {
          p.v.y = 0;
          p.jumping = false;
          p.horizontalJump = -p.a * 30;
        }
        p.p.x = px1 - p.d.w;
        p.frame = 0;
      }
      if ((p.v.x < 0) & (p.p.x + p.v.x < px2) & (p.p.x + p.d.w > px2)) {
        p.v.x = 0;
        if (p.v.y < 0) {
          p.v.y = 0;
          p.jumping = false;
          p.horizontalJump = p.a * 30;
        }
        p.p.x = px2 + 0.1;
        p.frame = 0;
      }
    } else {
      p.horizontalJump = 0;
    }
  };

  var spawn = function(px, py) {
    py = D.C - py * D.M;
    px *= D.M;

    if (p.p.y > D.C + D.M * 8) {
      p.dead = true;
    }

    if (p.dead) {
      p.dead = false;

      p.life -= 1;
      p.hitAnim.justHit = true;

      // print(p.life);

      if (p.life < 0) {
        p.life = p.maxLife;

        lvl.transition.show = true;

        b.purge();
        e.e = [];

        p.v.x = 0;
        p.v.y = 0;

        p.p.y = py - p.d.h;
        p.p.x = px;

        SFX.complete.play();
      }
    }
  };

  var goal = function(px, py) {
    py = D.C - py * D.M;
    px *= D.M;
    w = D.M;
    h = D.M * 2;

    g.DrawFillRect(px - MASTER.x, py - MASTER.y - h, w, h, 127);

    if ((p.p.y < py - 1) & (p.p.y + p.d.h > py - h - 1)) {
      if ((p.p.x + p.d.w < px + w + 1) & (p.p.x > px - 1)) {
        p.dead = true;
        p.life = 0;
        level += 1;
      }
    }
  };

  // --------------------------------- LEVELS ----------------------------------

  this.level = [
    function() {
      spawn(1, 0);

      ground(-10, 32);

      flatplat(12, 12, 8);
      flatplat(10, 8, 8);
      flatplat(8, 4, 8);

      newenemy(10, 4, 0);

      flatplat(26, 4, 6);
      flatplat(24, 2, 8);

      solidplat(38, 4, 8, 2);

      ground(52, 78);

      flatplat(52, 4, 6);
      flatplat(52, 2, 8);

      goal(76, 0);
    },
    function() {
      spawn(1, 0);

      ground(-10, 32);

      flatplat(16, 12, 8);
      flatplat(14, 8, 8);
      flatplat(12, 4, 8);

      newenemy(14, 16, 0);

      ground(40, 56);
      flatplat(46, 8, 6);
      flatplat(44, 4, 6);

      ground(63, 68);

      ground(76, 92);
      solidplat(82, 2, 4, 2);
      solidplat(84, 4, 2, 4);
      flatplat(86, 4, 6);

      newenemy(90, -8, 1);

      ground(100, 108);
      goal(106, 0);
    },
    function() {
      spawn(1, 0);

      newenemy(-10, 0, 0);
      newenemy(-20, 16, 1);
      newenemy(32, 32, 2);
      newenemy(16, -8, 3);

      counter = 0;

      for (var i = 0; i < e.e.length; i++) {
        if (e.e[i].dead) {
          counter++;
        }
      }

      if (counter == 4) {
        ground(0, 10);
        goal(7, 0);
      } else {
        ground(0, 5);
      }
    },
    function() {
      spawn(1, 0);
      ground(0, 8);

      ground(14, 22);
      flatplat(18, 4, 4);
      flatplat(16, 2, 4);

      newenemy(-10, 6, 0);

      ground(30, 53);
      solidplat(40, 30, 13, 30);
      flatplat(35, 8, 5);
      flatplat(33, 4, 7);

      y = D.C - 16 * D.M;
      if (p.p.y < y) {
        newenemy(26, -4, 1);
        if (e.e[1].dead) {
          flatplat(22, 18, 6);
          goal(24, 18);
        }
      }

      solidplat(20, 16, 12, 6);
    },
    function() {
      pb.paused = true;
    }
  ];
}
