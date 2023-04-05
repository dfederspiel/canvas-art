import { easeInOutSine, easeOutSine } from "../../../lib/easing";
import { rand } from "../../../lib/helpers";
import HSL from "../../../lib/HSL";
import RGB from "../../../lib/RGB";
import Size from "../../../lib/Size";
import Phosphorous from "./Phosphorous";

export default class Blinker extends Phosphorous {
  constructor(x: number, y: number, cx: number, cy: number) {
    super(
      x,
      y,
      cx,
      cy,
      new Size(0.1, rand(0.2, 0.8), 0.1, rand(0.2, 0.8)),
      HSL.fromRGB(158, 137, 0, 1),
      HSL.fromRGB(220, 220, 220, 1),
      easeOutSine
    );
    this.ageLimit = rand(180, 600);
    this.frames = Math.floor(rand(1, 100));
  }

  update(): void {
    super.update();
    let a = easeInOutSine(this.animationFrame / 2, 0.1, 1, this.frames);
    this.color.a = a < 0 ? 0 : a;
    this.secondaryColor.a = a < 0 ? 0 : a;
  }
}
