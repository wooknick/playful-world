class App {
  constructor() {
    // DOM
    this.targetCountDOM = document.getElementById("targetCount");
    this.userInputDOM = document.getElementById("userInput");
    this.animatedPinDOM = document.getElementById("animatedPin");
    // Setting
    this.targetCount = 100;
    this.currentCount = 0;
    // timestamp
    this.inputT = undefined;
    // Start App
    this.init();
    this.start();
  }
  init() {
    this.targetCountDOM.innerHTML = `${this.currentCount} / ${this.targetCount}`;
    this.userInputDOM.addEventListener("input", this.count.bind(this));
    this.userInputDOM.addEventListener("input", () => {
      if (this.inputT) {
        clearTimeout(this.inputT);
      }
      this.inputT = setTimeout(this.rotateWheel.bind(this), 400);
    });
  }
  start() {
    // this.animate();
  }
  count() {
    const totalCount = this.userInputDOM.value.length;
    this.currentCount = totalCount;
    this.targetCountDOM.innerHTML = `${this.currentCount} / ${this.targetCount}`;
  }
  rotateWheel() {
    if (this.currentCount === 0) {
      this.animatedPinDOM.style.animationDuration = "10s";
    } else {
      const speed = this.targetCount / this.currentCount;
      this.animatedPinDOM.style.animationDuration = `${speed / 2}s`;
    }
  }
  animate(t) {
    window.requestAnimationFrame(this.animate.bind(this));
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
