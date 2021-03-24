export class Point {
  constructor(index, x, y) {
    this.x = x;
    this.y = y;
    this.fixedY = y;
    this.speed = 1 / 60;
    this.cur = index;
    this.max = Math.random() * 100 + 150;
    this.vector = Math.random() > 0.5 ? 1 : -1;
  }

  update() {
    this.cur += this.speed * this.vector;
    this.y = this.fixedY + Math.sin(this.cur) * this.max;
  }
}
