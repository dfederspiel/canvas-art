import { easeInOutSine, easeOutSine } from "../../../lib/easing";
import { rand } from "../../../lib/helpers";
import HSL from "../../../lib/HSL";
import RGB from "../../../lib/RGB";
import Size from "../../../lib/Size";
import Phosphorous from "./Phosphorous";

export default class Blinker extends Phosphorous {
  
  constructor(x: number, y: number, cx: number, cy: number) {


    // Silver
    const silverHue = rand(190, 220);
    const silverSaturation = rand(0, 10);
    const silverLightness = rand(40, 60);

    // Gold
    const goldHue = rand(45, 55);
    const goldSaturation = rand(75, 100);
    const goldLightness = rand(45, 55);

    super(
      x,
      y,
      cx,
      cy,
      new Size(0.8, rand(1, 2), 0.8, rand(1, 2)),
      new HSL(goldHue, goldSaturation, goldLightness),
      new HSL(silverHue, silverSaturation, silverLightness),
      easeOutSine
    );
    this.ageLimit = rand(180, 600);
    this.frames = Math.floor(rand(10, 50));
  }

  update(): void {
    super.update();
    let a = easeInOutSine(this.animationFrame / 2, 0.1, 1, this.frames);
    this.color.a = a < 0 ? 0 : a;
    this.secondaryColor.a = a < 0 ? 0 : a;
  }
}
