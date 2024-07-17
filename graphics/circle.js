export class Circle {
  #isGrab = false;
  #isSelect = false;
  #offset = {
    x: 0,
    y: 0,
  };
  #ground = 0;

  #a = 9.8;
  #speed = 0;

  #timer = null;

  constructor(ctx, x, y, radius, background) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.background = background;

    this.init();
  }

  init() {
    const canvas = this.ctx.canvas;
    this.#ground = canvas.height - this.radius;

    canvas.addEventListener("mousemove", this.handleMove.bind(this));
    canvas.addEventListener("mousedown", this.handleDown.bind(this));
    canvas.addEventListener("mouseup", this.handleUp.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = this.background;
    this.ctx.fill();
  }

  handleDown(ev) {
    const { offsetX, offsetY } = ev;
    this.#isGrab = this.#isSelect;
    this.#offset = {
      x: offsetX - this.x,
      y: offsetY - this.y,
    };
    
    this.#timer && cancelAnimationFrame(this.#timer);
    this.#speed = 0;
  }

  handleUp(ev) {
    this.#isGrab = false;
    this.#offset = {
      x: 0,
      y: 0,
    };
    this.handleDrop();
  }

  handleMove(ev) {
    const { offsetX, offsetY } = ev;
    let x = Math.abs(offsetX - this.x);
    let y = Math.abs(offsetY - this.y);

    const lessRadius = Math.sqrt(x ** 2 + y ** 2) < this.radius;

    if (this.#isGrab) {
      canvas.style.cursor = "grabbing";
      this.x = offsetX - this.#offset.x;
      this.y = offsetY - this.#offset.y;
      return void 0;
    }

    if (lessRadius) {
      this.#isSelect = true;
      canvas.style.cursor = "grab";
    } else {
      this.#isSelect = false;
      canvas.style.cursor = "default";
    }
  }

  handleDrop() {
    if (this.y === this.#ground && this.#speed === 0) return void 0;

    this.#speed = this.#speed + this.#a;
    this.y = this.y + this.#speed;

    if (this.y >= this.#ground) {
      this.y = this.#ground;
      this.#speed *= -1;
    }

    this.#timer = requestAnimationFrame(this.handleDrop.bind(this));
  }
}
