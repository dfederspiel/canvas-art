import Rect from "./Rect";
export default class Wall extends Rect {
  colorString: string;
  hits: number;

  constructor(x: number, y: number, w: number, h: number, colorString: string) {
    super(x, y, w, h);
    this.colorString = colorString;
    this.hits = 0;
  }
}
