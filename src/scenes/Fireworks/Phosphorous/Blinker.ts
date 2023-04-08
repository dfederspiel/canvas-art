import { easeInOutCubic, easeInOutExpo, easeInOutSine, easeOutSine } from "../../../lib/easing";
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

    const gold = new HSL(goldHue, goldSaturation, goldLightness);
    const silver =   new HSL(silverHue, silverSaturation, silverLightness);

    super(
      x,
      y,
      cx,
      cy,
      new Size(.5, rand(.9, 1.5), .5, rand(.9, 1.5)),
      Math.random() < .5 ? gold : silver,
      Math.random() < .5 ? silver : gold,
      easeInOutCubic
    );
    this.ageLimit = rand(180, 600);
    this.frames = Math.floor(rand(10, 50));
  }

  update(): void {
    super.update();

    if(this.age > 100) {
      let a = easeInOutExpo(this.animationFrame, 0, 1, rand(10, 30));
      this.color.a = a;
      this.secondaryColor.a = a;
    }
  }
}
