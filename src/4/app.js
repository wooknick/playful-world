import { Dot } from "./dot";
import ironman from "./ironman.jpg";
import { Ripple } from "./ripple";
import { collide } from "./util";

class App {
  constructor() {
    this.canvas = document.getElementById("app");
    this.ctx = this.canvas.getContext("2d");
    this.pixelRatio = window.devicePixelRatio > 1 ? 2 : 1;

    this.tmpCanvas = document.createElement("canvas");
    this.tmpCtx = this.tmpCanvas.getContext("2d");

    this.ripple = new Ripple();
    this.resize();

    this.radius = 10;
    this.pixelSize = 30;
    this.dots = [];

    this.isLoaded = false;
    this.imgPos = {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };

    this.image = new Image();
    this.image.src = ironman;
    this.image.onload = () => {
      this.isLoaded = true;
      this.drawImage();
    };

    window.addEventListener("resize", this.resize.bind(this), false);
    this.canvas.addEventListener("click", this.onClick.bind(this), false);
    window.requestAnimationFrame(this.animate.bind(this));
  }

  resize() {
    this.stageWidth = document.body.clientWidth;
    this.stageHeight = document.body.clientHeight;

    this.canvas.width = this.stageWidth * this.pixelRatio;
    this.canvas.height = this.stageHeight * this.pixelRatio;
    this.ctx.scale(this.pixelRatio, this.pixelRatio);

    this.tmpCanvas.width = this.stageWidth;
    this.tmpCanvas.height = this.stageHeight;

    this.ripple.resize(this.stageWidth, this.stageHeight);

    if (this.isLoaded) {
      this.drawImage();
    }
  }

  drawImage() {
    const stageRatio = this.stageWidth / this.stageHeight;
    const imgRatio = this.image.width / this.image.height;

    this.imgPos.width = this.stageWidth;
    this.imgPos.height = this.stageHeight;

    /**
     * 이미지의 종횡비가 캔버스의 종횡비보다 크다 => 가로가 더 길다
     * 가로가 더 긴데 가로를 맞춘다면, 세로에 여백이 생김
     * 근데 위 코드에서 가로 세로를 다 맞춰놨다.
     *
     * 1) 이미지의 종횡비 > 캔버스의 종횡비
     * 2) 가로가 더 김
     * 3) 캔버스에 맞췄을 때, 가로가 왜곡됨.
     * 4) 가로를 원본 비율로 늘려주면 됨.
     * 5) 이 때, 가로를 다시 늘려주는 것보다, 세로 조절 비율만큼 가로를 조절하는 것이 계산이 더 쉬움.
     */

    if (imgRatio > stageRatio) {
      this.imgPos.width = Math.round(
        this.image.width * (this.stageHeight / this.image.height)
      );
      this.imgPos.x = Math.round((this.stageWidth - this.imgPos.width) / 2);
      this.imgPos.height = this.stageHeight;
    } else {
      this.imgPos.height = Math.round(
        this.image.height * (this.stageWidth / this.image.width)
      );
      this.imgPos.y = Math.round((this.stageHeight - this.imgPos.height) / 2);
    }

    this.ctx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height
    );

    this.tmpCtx.drawImage(
      this.image,
      0,
      0,
      this.image.width,
      this.image.height,
      this.imgPos.x,
      this.imgPos.y,
      this.imgPos.width,
      this.imgPos.height
    );

    this.imgData = this.tmpCtx.getImageData(
      0,
      0,
      this.stageWidth,
      this.stageHeight
    );

    this.drawDots();
  }

  drawDots() {
    this.dots = [];

    this.columns = Math.ceil(this.stageWidth / this.pixelSize);
    this.rows = Math.ceil(this.stageHeight / this.pixelSize);

    for (let i = 0; i < this.rows; i++) {
      const y = (i + 0.5) * this.pixelSize;
      const pixelY = Math.max(Math.min(y, this.stageHeight), 0);

      for (let j = 0; j < this.columns; j++) {
        const x = (j + 0.5) * this.pixelSize;
        const pixelX = Math.max(Math.min(x, this.stageWidth), 0);

        const pixelIndex = (pixelX + pixelY * this.stageWidth) * 4;
        const red = this.imgData.data[pixelIndex + 0];
        const green = this.imgData.data[pixelIndex + 1];
        const blue = this.imgData.data[pixelIndex + 2];

        const dot = new Dot(
          x,
          y,
          this.radius,
          this.pixelSize,
          red,
          green,
          blue
        );
        this.dots.push(dot);
      }
    }
  }

  animate(t) {
    // this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    // this.drawImage();

    this.ripple.animate(this.ctx);

    for (let i = 0; i < this.dots.length; i++) {
      const dot = this.dots[i];
      if (
        collide(dot.x, dot.y, this.ripple.x, this.ripple.y, this.ripple.radius)
      ) {
        dot.animate(this.ctx);
      }
    }

    window.requestAnimationFrame(this.animate.bind(this));
  }

  onClick(e) {
    this.ctx.clearRect(0, 0, this.stageWidth, this.stageHeight);
    this.drawImage();
    for (let i = 0; i < this.dots.length; i++) {
      this.dots[i].reset();
    }
    this.ripple.start(e.offsetX, e.offsetY);
  }

  isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }
}

window.onload = () => {
  const app = new App();
};
