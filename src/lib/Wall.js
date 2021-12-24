import Rect from "./Rect";
export default class Wall extends Rect {
  constructor(x, y, w, h, colorString) {
    super(x, y, w, h);
    this.colorString = colorString;
    this.hits = 0;
  }
}
