import "./style.css";
let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
console.log(isMobile ? "mobile" : "not mobile");

let width = window.innerWidth;
let height = window.innerHeight - 100;

const canvas = document.querySelector("canvas#screen");
canvas.width = width;
canvas.height = height;
let context = canvas.getContext("2d");

let lineCanvas = document.createElement("canvas");
lineCanvas.width = width;
lineCanvas.height = height;
let lineContext = lineCanvas.getContext("2d");

let popCanvas = document.createElement("canvas");
popCanvas.width = width;
popCanvas.height = height;
let popContext = popCanvas.getContext("2d");

let animationId;

const sceneInfo = {
  x: 0,
  speed: 4,
  second: 0,
  size: 80,
  popCount: 0,
  gameCount: 0,
  popSpeed: 60,
};

const nodes = [];
for (let i = 0; i < Math.floor(height / sceneInfo.size); i++) {
  nodes.push(new Array(Math.floor(width / sceneInfo.size)).fill(-1));
  sceneInfo.gameCount += Math.floor(width / sceneInfo.size);
}

const colors = ["#344f73", "#f2b705", "#8c591b", "#f25c05"];

function pop(size = sceneInfo.size, colorNo = Math.floor(Math.random() * 4)) {
  let xIdx = Math.floor((Math.random() * width) / size - 1);
  let yIdx = Math.floor((Math.random() * height) / size - 1);
  xIdx = xIdx < 0 ? 0 : xIdx;
  yIdx = yIdx < 0 ? 0 : yIdx;

  if (nodes[yIdx][xIdx] === -1) {
    sceneInfo.popCount += 1;
  }

  const x = xIdx * size;
  const y = yIdx * size;

  nodes[yIdx][xIdx] = colorNo;
  popContext.fillStyle = colors[colorNo];
  popContext.fillRect(x, y, size, size);
}

function remove(idx) {
  const tx = Math.floor(sceneInfo.x / sceneInfo.size);
  for (let i = 0; i < nodes.length; i++) {
    if (nodes[i][tx] === idx) {
      nodes[i][tx] = -1;
      popContext.clearRect(
        tx * sceneInfo.size,
        i * sceneInfo.size,
        sceneInfo.size,
        sceneInfo.size
      );
      sceneInfo.popCount -= 1;
      break;
    }
  }
}

const tick = (timestamp) => {
  // variable
  sceneInfo.x = sceneInfo.x + sceneInfo.speed;
  const s = Math.floor(timestamp / 1000);
  const f = Math.floor(timestamp / (1000 / 60));

  // 조건부 로직
  if (sceneInfo.x < 0 || sceneInfo.x > width) {
    sceneInfo.speed *= -1;
  }
  if (sceneInfo.second !== s) {
    sceneInfo.second = s;
    if (s % 4 === 0 && sceneInfo.popSpeed > 2) {
      sceneInfo.popSpeed -= 2;
    }
  }
  if (f % sceneInfo.popSpeed === 0) {
    pop();
  }

  // move line
  lineContext.strokeStyle = "#080808";
  lineContext.lineWidth = "5";
  lineContext.clearRect(0, 0, width, height);
  lineContext.beginPath();
  lineContext.moveTo(sceneInfo.x, 0);
  lineContext.lineTo(sceneInfo.x, height);
  lineContext.stroke();

  context.clearRect(0, 0, width, height);
  context.drawImage(popCanvas, 0, 0);
  context.drawImage(lineCanvas, 0, 0);

  if (sceneInfo.second !== Math.floor(timestamp / 1000)) {
    sceneInfo.second;
  }

  if (sceneInfo.gameCount * 0.8 < sceneInfo.popCount) {
    document.getElementById("gameover").style.display = "flex";
    window.cancelAnimationFrame(animationId);
  } else {
    animationId = window.requestAnimationFrame(tick);
  }
};

animationId = window.requestAnimationFrame(tick);

const buttons = document.querySelectorAll(".button");
[...buttons].forEach((button, idx) => {
  button.addEventListener("click", () => {
    remove(idx);
  });
});
