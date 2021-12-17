export default class Wall {
  constructor(x, y, w, h, colorString) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.colorString = colorString;
    this.hits = 0;

    const halfWidth = this.w / 2;
    const halfHeight = this.h / 2;

    this.coords = {
      tl: {
        x: this.x,
        y: this.y,
      },
      tr: {
        x: this.x + this.w,
        y: this.y
      },
      bl: {
        x: this.x,
        y: this.y + this.h,
      },
      br: {
        x: this.x + this.w,
        y: this.y + this.h,
      },
    };
    this.angles = {
        tl: this.#angle(this.coords.tl.x, this.coords.tl.y),
        tr: this.#angle(this.coords.tr.x, this.coords.tr.y),
        bl: this.#angle(this.coords.bl.x, this.coords.bl.y),
        br: this.#angle(this.coords.br.x, this.coords.br.y),
    };
  }

  #angle(x, y) {
    var dx = this.x + this.w / 2 - x;
    var dy = this.y + this.h / 2 - y;

    var angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (angle < 0) angle += 360;

    return angle;
  }
}
