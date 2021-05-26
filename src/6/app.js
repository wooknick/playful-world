class App {
  constructor() {
    // dom
    this.lifeDOM = document.getElementById("lifeCount");
    this.avatarDOM = document.getElementById("avatar");
    this.foodButtonDOMS = document.getElementsByClassName("foodButton");
    // data
    this.positions = [
      { bottom: 0, left: 50, scalex: -1 },
      { bottom: 20, left: 100, scalex: 1 },
      { bottom: 0, left: 150, scalex: -1 },
      { bottom: 20, left: 200, scalex: -1 },
      { bottom: 0, left: 200, scalex: 1 },
      { bottom: 20, left: 200, scalex: -1 },
      { bottom: 0, left: 150, scalex: 1 },
      { bottom: 20, left: 100, scalex: 1 },
    ];
    this.positionIdx = 0;
    this.position = this.positions[0];
    this.foodData = {
      meat: 1,
      fish: 2,
      fruit: 3,
      water: 1,
    };
    this.life = 5;
    // timeId
    this.avatarMoveId = undefined;
    this.lifeDecreaseId = undefined;
    // method
    this.start(); // init 포함
    this.update();
  }
  feed(e) {
    let food;
    let tooltip;
    if (e.target.classList.contains("tooltip")) {
      food = e.target.parentElement.id;
      tooltip = e.target;
    } else {
      food = e.target.id;
      tooltip = document.getElementById(food).firstElementChild;
    }
    tooltip.classList.add("fadeInOut");
    tooltip.onanimationend = (e) => {
      e.target.classList.remove("fadeInOut");
      this.life += Number(this.foodData[food]);
    };
  }
  start() {
    this.lifeDOM.innerHTML = this.life;
    for (let foodButtonDOM of this.foodButtonDOMS) {
      foodButtonDOM.addEventListener("click", this.feed.bind(this));
      const food = foodButtonDOM.id;
      foodButtonDOM.firstElementChild.innerHTML = `+${this.foodData[food]}`;
    }
    window.requestAnimationFrame(this.animate.bind(this));
  }
  update() {
    this.avatarMoveId = setInterval(this.avatarMove.bind(this), 750);
    this.lifeDecreaseId = setInterval(this.lifeDecrease.bind(this), 5000);
  }
  avatarMove() {
    this.positionIdx = (this.positionIdx + 1) % this.positions.length;
    this.position = this.positions[this.positionIdx];
  }
  lifeDecrease() {
    this.life = this.life - 1;
  }
  animate(t) {
    this.avatarDOM.style.bottom = this.position.bottom + "px";
    this.avatarDOM.style.left = this.position.left + "px";
    this.avatarDOM.style.transform = `scaleX(${this.position.scalex})`;
    this.lifeDOM.innerHTML = this.life;
    if (this.life > 0) {
      window.requestAnimationFrame(this.animate.bind(this));
    } else {
      clearInterval(this.avatarMoveId);
      clearInterval(this.lifeDecreaseId);
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
};
