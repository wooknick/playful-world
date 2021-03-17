import "./style.css";
var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
  navigator.userAgent
);
console.log(isMobile ? "mobile" : "not mobile");

var width = window.innerWidth;
var height = window.innerHeight;

var canvas = document.getElementById("world");
canvas.width = width;
canvas.height = height;
var context = canvas.getContext("2d");

var roads_canvas = document.createElement("canvas");
roads_canvas.width = width;
roads_canvas.height = height;
var roads_context = roads_canvas.getContext("2d");

var watercolor_canvas = document.createElement("canvas");
watercolor_canvas.width = width;
watercolor_canvas.height = height;
var watercolor_context = watercolor_canvas.getContext("2d");

var image, data;
var drawingId = -1;
var boids = [];

document.querySelector("canvas#world").addEventListener("click", (e) => {
  const { clientX, clientY } = e;
  boids.push(
    new Boid(clientX, clientY, (Math.random() * 180 * Math.PI) / 180, 0)
  );
  if (drawingId === -1) {
    drawingId = setInterval(() => {
      if (isMobile) {
        drawing(0.02, 200);
      } else {
        drawing(0.015, 400);
      }
    }, 1000 / 60);
  }
});

// functions
var dist = function (x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
};

var Boid = function (x, y, angle, gen) {
  // 초기값 설정
  // x, y : 그리기 시작점
  // angle, dx, dy : 랜덤 설정된 각도에 따라 거리 1만큼 이동시키기 위한 x, y 델타값
  // stride : 한 틱당 그릴 선분의 길이를 정하기 위한 보폭.
  //        값이 클 수록 한 번에 길게 그리므로, 더 적은 틱으로 수행 가능하다.
  // life, gen : 나중에 추가되는 자식일수록 gen이 높고, gen이 life보다 높으면 바로 kill()한다.
  //            프랙탈 구조가 너무 좁게 들어가는 걸 방지함.
  // dead : 계속 그릴지, 삭제할지를 판단하는 플래그
  // dist : 시작점과 캔버스 중심과의 거리
  // hue : 색상 관련

  this.x = x;
  this.y = y;
  this.angle = Math.pow(Math.random(), 10) + angle;
  this.dx = Math.cos(this.angle);
  this.dy = Math.sin(this.angle);
  this.stride = 2;
  this.life = Math.random() * 30 + 10;
  this.gen = gen;
  this.dead = false;
  this.dist = dist(this.x, this.y, width / 2, height / 2);
  this.hue = Math.random() * 120;

  // update함수가 실행되면서 선이 그려진다.

  this.update = function () {
    roads_context.strokeStyle = "#808080";
    roads_context.beginPath();
    roads_context.moveTo(this.x, this.y);

    this.x += this.dx * this.stride;
    this.y += this.dy * this.stride;

    this.dist = dist(this.x, this.y, width / 2, height / 2);

    roads_context.lineTo(this.x, this.y);
    roads_context.stroke();

    // trail : 음영 색 길이
    // var trail = Math.random() * ((50 - 10) * ((this.dist / width) * 2)) + 10;
    var trail = (Math.random() * Math.random() * 20 + 10) / 5;
    var color = { h: this.hue, s: "60%", l: "50%" };
    watercolor_context.strokeStyle =
      "hsla(" + color.h + "," + color.s + "," + color.l + ",0.1)";
    watercolor_context.lineWidth = 2;
    // trail은 한 번 그릴 때 5개씩 생기도록 함
    for (var i = 0; i < 5; i++) {
      watercolor_context.beginPath();
      watercolor_context.moveTo(this.x, this.y);
      var px = this.x + Math.cos(this.angle + 90) * (i * trail);
      var py = this.y + Math.sin(this.angle + 90) * (i * trail);
      watercolor_context.lineTo(px, py);
      watercolor_context.stroke();
    }

    // index : 한 획을 그렸을 때, 펜이 떨어지는 위치의 좌표 값.
    // ctx.getImageData.data 를 통해 얻어지는 1차원 행렬에 저장되어 있는 픽셀정보와 매핑됨
    // 바로 직전의 drawing() 결과와 비교함.
    // 픽셀정보 행렬에는 4개의 값이 하나의 픽셀을 표현함.
    var index = (Math.floor(this.x) + width * Math.floor(this.y)) * 4;

    // kill 조건
    // 너무 세부적인 반복인 경우
    if (this.gen >= this.life) this.kill();

    // 펜을 뗀 픽셀의 알파가 0이 아닌 경우
    if (data[index + 3] > 0) {
      this.kill();
    }

    // 벽에 부딪힐 경우
    if (this.x < 0 || this.x > width) this.kill();
    if (this.y < 0 || this.y > height) this.kill();
  };

  // 배열에서 제거
  this.kill = function () {
    boids.splice(boids.indexOf(this), 1);
    this.dead = true;
  };
};

var drawing = function (bubbleFrequency = 0.01, boidsLength = 400) {
  // 직전 틱의 canvas 상태를 가져온다.
  image = roads_context.getImageData(0, 0, width, height);
  data = image.data;
  for (var i = 0; i < boids.length; i++) {
    var boid = boids[i];
    boid.update();
    // 매 틱마다 2% 확률로 새로운 직선을 추가함.
    // 완성된 직선에서 추가하는게 아니고 조금씩 그려가는 와중에 추가하는 것.
    if (
      !boid.dead &&
      Math.random() < bubbleFrequency &&
      boids.length < boidsLength
    ) {
      boids.push(
        new Boid(
          boid.x,
          boid.y,
          ((Math.random() > 0.5 ? 90 : -90) * Math.PI) / 180 + boid.angle,
          boid.gen + 1
        )
      );
    }
  }
  // 메인 캔버스에 그림을 그린다.
  context.clearRect(0, 0, width, height);
  context.globalAlpha = 0.5;
  context.drawImage(watercolor_canvas, 0, 0);
  context.globalAlpha = 1;
  context.drawImage(roads_canvas, 0, 0);

  if (boids.length == 0) {
    clearInterval(drawingId);
    drawingId = -1;
    console.log("done");
  }
};
