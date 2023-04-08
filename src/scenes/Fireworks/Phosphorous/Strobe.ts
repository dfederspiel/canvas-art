import { easeInOutSine, easeLinear, easeOutSine, getRandomEasing } from "../../../lib/easing";
import { rand } from "../../../lib/helpers";
import Size from "../../../lib/Size";
import HSL from '../../../lib/HSL';
import Phosphorous from './Phosphorous';

export default class Strobe extends Phosphorous {

  constructor(c1: HSL, c2: HSL, x: number, y: number, cx: number, cy: number) {
    super(
      x,
      y,
      cx,
      cy,
      new Size(0.8, rand(1, 1.2), 0.8, rand(1, 1.2)),
      c1,
      c2,
      getRandomEasing()
    );
    this.ageLimit = Math.abs(((x - cx) + (y - cy)) / 2) / .5;
    this.frames = rand(2, 100);
  }

  update(): void {
    super.update();
  }
}