/**
 * @class Dot
 * @property {number} Dot.x - coordinate of x
 * @property {number} Dot.y - coordinate of y
 *
 * @author Mino
 */
export class Dot {
  /** @type {number} coordinate of x */
  x;

  /** @type {number} coordinate of y */
  y;

  speedX = 0;
  speedY = 0;

  /** @type {Set<Dot>} 私有 Set of `Dot`  */
  #near = new Set();

  static radius = 4;

  /** @type {string} 临界值 Critical */
  static Critical = 50;

  /** @type {CanvasRenderingContext2D | null} Canvas context 2d */
  static #context = null;

  /** @constructor initial dot coordinate */
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
    this.speedX = Math.random() * 20;
    this.speedY = Math.random() * 20;
  }

  static setContext(context) {
    Dot.#context = context;
  }

  get near() {
    const list = [];
    const iterator = this.#near.values();
    while (true) {
      const result = iterator.next();
      if (result.done) break;
      list.push(result.value);
    }
    return list;
  }

  /**
   * @param {Dot} dot
   * @return {Dot} return this
   * @desc append a dot into **#near**
   */
  append(dot) {
    this.#near.add(dot);
    return this;
  }

  remove(dot) {
    this.#near.delete(dot);
    return this;
  }

  render(dot) {
    Dot.#drawPoint(dot);
  }

  // 静态方法只能使用静态的成员变量，没有this
  static render(...dots) {
    dots.forEach(Dot.#drawPoint);

    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dot1 = dots[i];
        const dot2 = dots[j];
        if (Dot.isNear(dot1, dot2)) {
          dot1.append(dot2);
          dot2.append(dot1);
        }
      }
    }

    dots.forEach((dot1) => {
      dot1.near.forEach((dot2) => {
        Dot.#drawLine(dot1, dot2);
      });
    });
  }

  static #drawPoint(dot) {
    const ctx = Dot.#context;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, Dot.radius, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.closePath();
  }

  static #drawLine(dot1, dot2) {
    const ctx = Dot.#context;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(dot1.x, dot1.y);
    ctx.lineTo(dot2.x, dot2.y);
    ctx.stroke();
    ctx.closePath();
  }

  static distance(dot1, dot2) {
    const absX = Math.abs(dot1.x - dot2.x);
    const absY = Math.abs(dot1.y - dot2.y);
    return Math.round(Math.sqrt(absX ** 2 + absY ** 2));
  }

  static isNear(dot1, dot2) {
    return this.distance(dot1, dot2) <= Dot.Critical;
  }
}
