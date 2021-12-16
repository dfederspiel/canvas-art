export default class Wall {
  constructor(x, y, w, h, colorString) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.colorString = colorString;
    this.hits = 0;
  }
}
