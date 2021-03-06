import { easeInOutSine, easeOutSine } from "../../../lib/easing";
import { rand } from "../../../lib/helpers";
import RGB from "../../../lib/RGB";
import Size from "../../../lib/Size";
import Phosphorous from "./Phosphorous";

export default class Blinker extends Phosphorous {


  constructor(x: number, y: number, cx: number, cy: number) {
    super(x, y, cx, cy,
      new Size(.1, rand(.5, 1.9), .1, rand(.5, 1.9)),
      new RGB(158, 137, 0, 1),
      new RGB(220, 220, 220, 1),
      easeOutSine
    )
    this.ageLimit = rand(180, 600)
    this.frames = Math.floor(rand(15, 20))
  }

  update(): void {
    super.update();
    let a = easeInOutSine(this.animationFrame / 2, .1, 1, this.frames)
    this.color.alpha = a < 0 ? 0 : a;
    this.secondaryColor.alpha = a < 0 ? 0 : a;
  }
}