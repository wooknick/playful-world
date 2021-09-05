import forest from "./forest.png";
import run from "./run.png";

class App {
  constructor() {
    this.canvas = document.getElementById("app");
    this.ctx = this.canvas.getContext("2d");
    this.stageWidth = Math.min(928, document.body.clientWidth);
    this.stageHeight = Math.min(793, document.body.clientHeight);
    // this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;
    this.pixelRatio = 1;

    this.bgImage = new Image();
    this.bgX = 0;
    this.runSprite = new Image();
    this.spriteX = -50;
    this.spriteY = this.stageHeight - 162;
    this.spriteSpeed = 0;
    this.jumpDelta = 0;
    this.spriteFrame = 0;
    this.spriteMaxFrame = 8;
    this.keyDownCodes = [];

    this.load();
    this.resize();
    window.addEventListener("resize", this.resize.bind(this), false);
    window.addEventListener("keydown", this.handleKeyDown.bind(this), false);
    window.addEventListener("keyup", this.handleKeyUp.bind(this), false);
    window.requestAnimationFrame(this.animate.bind(this));
  }

  load() {
    this.bgImage.src = forest;
    this.runSprite.src = run;
  }

  resize() {
    this.stageWidth = Math.min(928, document.body.clientWidth);
    this.stageHeight = Math.min(793, document.body.clientHeight);

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);
  }

  animate(t) {
    // this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.ctx.drawImage(this.bgImage, this.bgX--, 0);
    if (this.bgX <= -928) {
      this.bgX = 0;
    }
    this.spriteX += this.spriteSpeed;
    this.spriteY += this.jumpDelta;
    if (this.spriteY === this.stageHeight - 162) {
      this.jumpDelta = 0;
    }
    const targetFrameX =
      (Math.floor(this.spriteFrame) % this.spriteMaxFrame) * 150;
    const targetFrameY = 0;
    this.ctx.drawImage(
      this.runSprite,
      targetFrameX,
      targetFrameY,
      150,
      150,
      this.spriteX,
      this.spriteY,
      150,
      150
    );
    this.spriteFrame = this.spriteFrame + 0.2;

    window.requestAnimationFrame(this.animate.bind(this));
  }

  jump() {}

  handleKeyDown(event) {
    if (event.code === "ArrowLeft") {
      this.spriteSpeed = -2;
      this.keyDownCodes.push("ArrowLeft");
    } else if (event.code === "ArrowRight") {
      this.spriteSpeed = 2;
      this.keyDownCodes.push("ArrowRight");
    } else if (event.code === "Space") {
      this.jumpDelta = -2;
    }
  }
  handleKeyUp(event) {
    if (event.code === "ArrowLeft") {
      this.keyDownCodes = this.keyDownCodes.filter(
        (item) => item !== "ArrowLeft"
      );
    } else if (event.code === "ArrowRight") {
      this.keyDownCodes = this.keyDownCodes.filter(
        (item) => item !== "ArrowRight"
      );
    } else if (event.code === "Space") {
      this.jumpDelta = 2;
    }
    if (this.keyDownCodes.length === 0) {
      this.spriteSpeed = 0;
    }
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
}

window.onload = () => {
  const app = new App();
  console.log(app.isMobile());
};
