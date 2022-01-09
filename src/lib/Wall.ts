import Rect from "./Rect";
import RGB from "./RGB";
export default class Wall extends Rect {
  color: RGB;
  hits: number;

  constructor(x: number, y: number, w: number, h: number, color: RGB) {
    super(x, y, w, h);
    this.color = color;
    this.hits = 0;
  }
}
